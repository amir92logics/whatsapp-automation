"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generatePaymentLink } from "@/lib/payment";

export async function createFeeRecord(studentId: string, month: string, amount: number, dueDate: Date) {
    try {
        const fee = await prisma.feeRecord.create({
            data: {
                studentId,
                month,
                amount,
                dueDate,
                status: "PENDING",
            },
        });

        // Auto-generate a payment link immediately
        await generatePaymentLink(fee.id, "EASYPAISA");

        revalidatePath("/(school)/fees");
        revalidatePath("/(school)/students");
        return {
            success: true,
            data: {
                ...fee,
                amount: fee.amount.toString()
            }
        };
    } catch (error) {
        return { success: false, error: "Failed to create fee" };
    }
}

export async function updateFeeStatus(id: string, status: "PENDING" | "PAID" | "OVERDUE" | "PARTIAL") {
    try {
        await prisma.feeRecord.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/(school)/fees");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update status" };
    }
}
