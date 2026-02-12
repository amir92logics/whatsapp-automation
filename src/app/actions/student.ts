"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function enrollStudent(formData: {
    name: string;
    rollNo: string;
    grade: string;
    parentPhone: string;
    schoolId: string;
    classId: string;
}) {
    try {
        const student = await prisma.student.create({
            data: {
                name: formData.name,
                rollNo: formData.rollNo,
                grade: formData.grade,
                parentPhone: formData.parentPhone,
                schoolId: formData.schoolId,
                classId: formData.classId,
            },
        });

        revalidatePath("/(school)/students");
        revalidatePath("/(school)/dashboard");
        return { success: true, data: student };
    } catch (error) {
        console.error("Failed to enroll student:", error);
        return { success: false, error: "Failed to enroll student" };
    }
}

export async function deleteStudent(id: string) {
    try {
        await prisma.student.delete({
            where: { id },
        });
        revalidatePath("/(school)/students");
        revalidatePath("/(school)/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete student" };
    }
}
export async function updateStudent(id: string, formData: {
    name: string;
    rollNo: string;
    grade?: string;
    parentPhone?: string;
    classId?: string;
}) {
    try {
        await prisma.student.update({
            where: { id },
            data: {
                name: formData.name,
                rollNo: formData.rollNo,
                grade: formData.grade,
                parentPhone: formData.parentPhone,
                classId: formData.classId,
            },
        });
        revalidatePath("/(school)/students");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update student" };
    }
}
