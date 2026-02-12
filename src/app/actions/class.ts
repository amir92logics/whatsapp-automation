"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generatePaymentLink } from "@/lib/payment";

export async function createClass(formData: {
    name: string;
    section?: string;
    monthlyFee?: number;
    schoolId: string;
}) {
    try {
        const errors: Record<string, string> = {};
        if (!formData.name || formData.name.trim() === "") {
            errors.name = "Class name is required";
        }
        if (!formData.monthlyFee || formData.monthlyFee <= 0) {
            errors.monthlyFee = "Monthly fee is required and must be greater than 0";
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        const cls = await prisma.class.create({
            data: {
                name: formData.name,
                section: formData.section || null,
                monthlyFee: formData.monthlyFee || 0,
                schoolId: formData.schoolId,
            },
        });

        revalidatePath("/(school)/classes");
        revalidatePath("/(school)/students");
        return { success: true, data: cls };
    } catch (error) {
        console.error("Failed to create class:", error);
        return { success: false, error: "Failed to create class" };
    }
}

export async function updateClass(id: string, data: { name: string; section: string; monthlyFee: number }) {
    try {
        const errors: Record<string, string> = {};
        if (!data.name || data.name.trim() === "") {
            errors.name = "Class name is required";
        }
        if (!data.monthlyFee || data.monthlyFee <= 0) {
            errors.monthlyFee = "Monthly fee is required and must be greater than 0";
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        const existingClass = await prisma.class.findUnique({
            where: { id },
            select: { monthlyFee: true }
        });

        await prisma.class.update({
            where: { id },
            data: {
                name: data.name,
                section: data.section,
                monthlyFee: data.monthlyFee,
            },
        });

        // If monthly fee changed, update all pending fee records
        if (existingClass && existingClass.monthlyFee.toNumber() !== data.monthlyFee) {
            await prisma.feeRecord.updateMany({
                where: {
                    student: { classId: id },
                    status: "PENDING"
                },
                data: {
                    amount: data.monthlyFee
                }
            });
        }

        revalidatePath("/(school)/classes");
        revalidatePath("/(school)/students");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update class" };
    }
}

export async function deleteClass(id: string) {
    try {
        await prisma.class.delete({
            where: { id },
        });
        revalidatePath("/(school)/classes");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete class" };
    }
}

export async function generateClassFees(classId: string, month: string) {
    try {
        const cls = await prisma.class.findUnique({
            where: { id: classId },
            include: { students: true }
        });

        if (!cls) return { success: false, error: "Class not found" };
        if (cls.monthlyFee.toNumber() <= 0) return { success: false, error: "Class fee is not set or zero." };

        let createdCount = 0;
        const dueDate = new Date(); // Ideally this should be configurable or set to 10th of month

        for (const student of cls.students) {
            // Check if fee already exists for this month
            const existing = await prisma.feeRecord.findFirst({
                where: {
                    studentId: student.id,
                    month: month
                }
            });

            if (!existing) {
                const fee = await prisma.feeRecord.create({
                    data: {
                        studentId: student.id,
                        month: month,
                        amount: cls.monthlyFee,
                        dueDate: dueDate,
                        status: "PENDING"
                    }
                });

                // Auto-generate payment link
                await generatePaymentLink(fee.id, "EASYPAISA");
                createdCount++;
            }
        }

        revalidatePath("/(school)/fees");
        return { success: true, count: createdCount };

    } catch (error) {
        console.error("Bulk fee generation error:", error);
        return { success: false, error: "Failed to generate class fees" };
    }
}
