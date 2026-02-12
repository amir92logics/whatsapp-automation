"use server";

import { prisma } from "@/lib/prisma";

export async function sendWhatsAppMessage(
    schoolId: string,
    phone: string,
    message: string
) {
    try {
        // Fetch school's WhatsApp configuration
        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            select: {
                whatsappProvider: true,
                whatsappPhoneNumberId: true,
                whatsappAccessToken: true,
            },
        });

        if (!school) {
            return { success: false, error: "School not found" };
        }

        const provider = school.whatsappProvider || "pywhatkit";

        // Prepare request payload
        const payload: any = {
            phone,
            message,
            provider,
        };

        // Add Cloud API credentials if using cloud_api
        if (provider === "cloud_api") {
            if (!school.whatsappPhoneNumberId || !school.whatsappAccessToken) {
                return {
                    success: false,
                    error: "Cloud API credentials not configured for this school",
                };
            }
            payload.phone_number_id = school.whatsappPhoneNumberId;
            payload.access_token = school.whatsappAccessToken;
        }

        // Call Python WhatsApp service
        const response = await fetch("http://localhost:8000/send-whatsapp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Internal-API-Key": process.env.INTERNAL_WHATSAPP_API_KEY || "",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.status === "SENT") {
            return { success: true, provider, data: result };
        } else {
            return { success: false, error: result.error, provider };
        }
    } catch (error) {
        console.error("WhatsApp send error:", error);
        return { success: false, error: "Failed to send WhatsApp message" };
    }
}

export async function testWhatsAppConnection(schoolId: string) {
    try {
        const testMessage = "🔔 Test message from AM Automation Studio";
        const testPhone = "+923001234567"; // You can make this configurable

        const result = await sendWhatsAppMessage(schoolId, testPhone, testMessage);
        return result;
    } catch (error) {
        return { success: false, error: "Connection test failed" };
    }
}
