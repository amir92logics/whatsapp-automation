import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppNotification } from "@/lib/whatsapp-client";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const { feeId, provider, amount, status } = payload;

        // 1. Log the raw payment payload
        const paymentLog = await (prisma as any).paymentLog.create({
            data: {
                provider,
                payload,
                feeRecordId: feeId,
                amount: parseFloat(amount),
                status: status === "success" ? "SUCCESS" : "FAILURE",
                verified: true
            }
        });

        if (status !== "success") {
            return NextResponse.json({ message: "Payment failed logged" }, { status: 200 });
        }

        // 2. Update FeeRecord
        const feeRecord = await (prisma as any).feeRecord.update({
            where: { id: feeId },
            data: {
                status: "PAID",
                paidAt: new Date(),
                confirmationSent: true,
            },
            include: {
                student: {
                    include: { school: true }
                }
            }
        });

        // 3. Trigger Automated WhatsApp Notification
        if (feeRecord.student.parentPhone) {
            const messageContent = `Dear Parent, your payment for [${feeRecord.student.name}] has been received. Fee Status: PAID. Thank you! - AM Automation Studio`;

            const waResult = await sendWhatsAppNotification({
                schoolId: feeRecord.student.schoolId,
                studentId: feeRecord.student.id,
                studentName: feeRecord.student.name,
                parentPhone: feeRecord.student.parentPhone,
                message: messageContent,
                type: "CONFIRMATION"
            });

            // 4. Log the Notification in Database
            await (prisma as any).notification.create({
                data: {
                    schoolId: feeRecord.student.schoolId,
                    studentId: feeRecord.student.id,
                    parentPhone: feeRecord.student.parentPhone,
                    messageContent: messageContent,
                    providerUsed: waResult.providerUsed,
                    type: "CONFIRMATION",
                    status: waResult.status,
                    errorMessage: waResult.errorMessage,
                    sentAt: waResult.sentAt
                }
            });
            // Mark as sent for automated confirmation
        }

        return NextResponse.json({
            success: true,
            message: "Fee updated and notification processing triggered",
            logId: paymentLog.id
        });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
