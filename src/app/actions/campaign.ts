"use server";

import { prisma } from "@/lib/prisma";
import { sendWhatsAppNotification } from "@/lib/whatsapp-client";
import { revalidatePath } from "next/cache";



export async function triggerManualReminders(schoolId: string) {
    try {

        const pendingFees = await (prisma as any).feeRecord.findMany({
            where: {
                student: { schoolId },
                status: "PENDING"
            },
            include: { student: { include: { school: true } } }
        });


        if (pendingFees.length === 0) return { success: true, count: 0 };

        const campaign = await (prisma as any).campaign.create({
            data: {
                schoolId,
                campaignType: "REMINDER",
                messageContent: "Fee Due Reminder",
                totalRecipients: pendingFees.length
            }
        });


        let sent = 0;
        let failed = 0;

        for (const fee of pendingFees) {

            const paymentLink = fee.paymentLink || 'pay.am-studio.com';

            // Construct both links dynamically
            const baseUrl = paymentLink.split('?')[0];
            const baseParams = paymentLink.split('?')[1];
            const feeIdParam = baseParams ? baseParams.split('&').find((p: string) => p.startsWith('feeId')) : `feeId=${fee.id}`;

            let cleanBaseUrl = baseUrl;
            if (baseUrl.includes("localhost")) {
                cleanBaseUrl = "https://pay.am-studio.com/api/mock/pay";
            } else if (!baseUrl.startsWith("http")) {
                cleanBaseUrl = `https://${baseUrl}`;
            }

            const epLink = `${cleanBaseUrl}?${feeIdParam}&provider=EASYPAISA`;
            const jcLink = `${cleanBaseUrl}?${feeIdParam}&provider=JAZZCASH`;

            const message = `Dear Parent,\n\nThis is a notification from ${fee.student.school.name} regarding the fee voucher for ${fee.student.name} for ${fee.month}.\n\nPending Amount: Rs. ${fee.amount}\n\nPlease click a link below to pay securely:\n\nPay via EasyPaisa:\n${epLink}\n\nPay via JazzCash:\n${jcLink}\n\nThank you,\nAM Automation Studio`;

            const result = await sendWhatsAppNotification({
                schoolId,
                studentId: fee.student.id,
                studentName: fee.student.name,
                parentPhone: fee.student.parentPhone,
                message,
                type: "REMINDER"
            });

            await (prisma as any).notification.create({
                data: {
                    schoolId,
                    studentId: fee.student.id,
                    parentPhone: fee.student.parentPhone,
                    messageContent: message,
                    providerUsed: result.providerUsed,
                    type: "REMINDER",
                    status: result.status,
                    errorMessage: result.errorMessage,
                    campaignId: campaign.id
                }
            });

            if (result.status === "SENT") sent++; else failed++;
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        await (prisma as any).campaign.update({
            where: { id: campaign.id },
            data: { sentCount: sent, failedCount: failed }
        });

        revalidatePath("/(school)/campaigns");
        revalidatePath("/(school)/notifications");
        return { success: true, count: sent };
    } catch (error) {

        console.error("Campaign Error:", error);
        return { success: false, error: "Failed to process campaign" };
    }
}

export async function triggerManualConfirmations(schoolId: string) {
    try {
        const paidFees = await (prisma as any).feeRecord.findMany({
            where: {
                student: { schoolId },
                status: "PAID",
                confirmationSent: false
            },
            include: { student: { include: { school: true } } }
        });

        if (paidFees.length === 0) return { success: true, count: 0 };

        const campaign = await (prisma as any).campaign.create({
            data: {
                schoolId,
                campaignType: "CONFIRMATION",
                messageContent: "Payment Confirmation",
                totalRecipients: paidFees.length
            }
        });

        let sent = 0;
        let failed = 0;

        for (const fee of paidFees) {
            const message = `Dear Parent, we have received your payment for ${fee.student.name} successfully.\nThank you!\n- ${fee.student.school.name}`;

            const result = await sendWhatsAppNotification({
                schoolId,
                studentId: fee.student.id,
                studentName: fee.student.name,
                parentPhone: fee.student.parentPhone,
                message,
                type: "CONFIRMATION"
            });

            await (prisma as any).notification.create({
                data: {
                    schoolId,
                    studentId: fee.student.id,
                    parentPhone: fee.student.parentPhone,
                    messageContent: message,
                    providerUsed: result.providerUsed,
                    type: "CONFIRMATION",
                    status: result.status,
                    errorMessage: result.errorMessage,
                    campaignId: campaign.id
                }
            });

            if (result.status === "SENT") {
                sent++;
                await (prisma as any).feeRecord.update({
                    where: { id: fee.id },
                    data: { confirmationSent: true }
                });
            } else {
                failed++;
            }
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        await (prisma as any).campaign.update({
            where: { id: campaign.id },
            data: { sentCount: sent, failedCount: failed }
        });

        revalidatePath("/(school)/campaigns");
        return { success: true, count: sent };
    } catch (error) {
        return { success: false, error: "Failed to process confirmations" };
    }
}

export async function sendCustomAnnouncement(schoolId: string, message: string, target: string) {
    try {
        let students = [];
        if (target === "ALL") {
            students = await (prisma as any).student.findMany({
                where: { schoolId },
                include: { school: true }
            });
        } else if (target === "PENDING") {
            const pendingFees = await (prisma as any).feeRecord.findMany({
                where: {
                    student: { schoolId },
                    status: "PENDING"
                },
                include: { student: { include: { school: true } } }
            });
            students = pendingFees.map((f: any) => f.student);
        }

        if (students.length === 0) return { success: true, count: 0 };

        const campaign = await (prisma as any).campaign.create({
            data: {
                schoolId,
                campaignType: "CUSTOM",
                messageContent: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
                totalRecipients: students.length
            }
        });

        let sent = 0;
        let failed = 0;

        for (const student of students) {
            const finalMessage = `${message}\n- ${student.school.name}`;

            const result = await sendWhatsAppNotification({
                schoolId,
                studentId: student.id,
                studentName: student.name,
                parentPhone: student.parentPhone,
                message: finalMessage,
                type: "CUSTOM"
            });

            await (prisma as any).notification.create({
                data: {
                    schoolId,
                    studentId: student.id,
                    parentPhone: student.parentPhone,
                    messageContent: finalMessage,
                    providerUsed: result.providerUsed,
                    type: "CUSTOM",
                    status: result.status,
                    errorMessage: result.errorMessage,
                    campaignId: campaign.id
                }
            });

            if (result.status === "SENT") sent++; else failed++;
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        await (prisma as any).campaign.update({
            where: { id: campaign.id },
            data: { sentCount: sent, failedCount: failed }
        });

        revalidatePath("/(school)/campaigns");
        return { success: true, count: sent };
    } catch (error) {
        return { success: false, error: "Failed to broadcast announcement" };
    }
}
