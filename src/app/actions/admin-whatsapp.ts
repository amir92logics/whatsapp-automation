"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSchoolWhatsAppSettings(
    schoolId: string,
    settings: {
        whatsappProvider: string;
        whatsappPhoneNumberId?: string;
        whatsappAccessToken?: string;
        whatsappBusinessId?: string;
    }
) {
    try {
        await prisma.school.update({
            where: { id: schoolId },
            data: {
                whatsappProvider: settings.whatsappProvider,
                whatsappPhoneNumberId: settings.whatsappPhoneNumberId || null,
                whatsappAccessToken: settings.whatsappAccessToken || null,
                whatsappBusinessId: settings.whatsappBusinessId || null,
            },
        });

        revalidatePath("/(super-admin)/settings/whatsapp");
        return { success: true };
    } catch (error) {
        console.error("Failed to update WhatsApp settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

export async function getAllSchoolsWhatsAppSettings() {
    try {
        const schools = await prisma.school.findMany({
            select: {
                id: true,
                name: true,
                isActive: true,
                whatsappProvider: true,
                whatsappPhoneNumberId: true,
                whatsappBusinessId: true,
                // Don't select full token for security, just check if it exists
                whatsappAccessToken: true,
            },
            orderBy: { name: "asc" },
        });

        // Mask token for display
        const maskedSchools = schools.map((school) => ({
            ...school,
            whatsappAccessToken: school.whatsappAccessToken
                ? "••••••••" + school.whatsappAccessToken.slice(-4)
                : null,
        }));

        return { success: true, schools: maskedSchools };
    } catch (error) {
        console.error("Failed to fetch schools:", error);
        return { success: false, error: "Failed to fetch schools", schools: [] };
    }
}

export async function testSchoolWhatsAppConnection(schoolId: string) {
    try {
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

        // Test message
        const testMessage = "✅ Test message from AM Automation Studio WhatsApp Integration";
        const testPhone = "+923001234567"; // This should ideally be fetched from school settings

        // Call the WhatsApp service
        const payload: any = {
            phone: testPhone,
            message: testMessage,
            provider: school.whatsappProvider,
        };

        if (school.whatsappProvider === "cloud_api") {
            if (!school.whatsappPhoneNumberId || !school.whatsappAccessToken) {
                return { success: false, error: "Cloud API credentials missing" };
            }
            payload.phone_number_id = school.whatsappPhoneNumberId;
            payload.access_token = school.whatsappAccessToken;
        }

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
            return { success: true, message: "Test message sent successfully!" };
        } else {
            return { success: false, error: result.error || "Failed to send test message" };
        }
    } catch (error: any) {
        return { success: false, error: error.message || "Connection test failed" };
    }
}
