"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updatePaymentSettings(settings: {
    jazzcashMerchantId?: string;
    jazzcashPassword?: string;
    jazzcashIntegritySalt?: string;
    easypaisaMerchantId?: string;
    easypaisaStoreId?: string;
    easypaisaHashKey?: string;
    paymentWebhookSecret?: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.schoolId) {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.school.update({
            where: { id: session.user.schoolId },
            data: {
                jazzcashMerchantId: settings.jazzcashMerchantId || null,
                jazzcashPassword: settings.jazzcashPassword || null,
                jazzcashIntegritySalt: settings.jazzcashIntegritySalt || null,
                easypaisaMerchantId: settings.easypaisaMerchantId || null,
                easypaisaStoreId: settings.easypaisaStoreId || null,
                easypaisaHashKey: settings.easypaisaHashKey || null,
                paymentWebhookSecret: settings.paymentWebhookSecret || null,
            },
        });

        revalidatePath("/(school)/settings/payment");
        return { success: true };
    } catch (error) {
        console.error("Failed to update payment settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

export async function getPaymentSettings() {
    try {
        const session = await auth();
        if (!session?.user?.schoolId) {
            return { success: false, error: "Unauthorized", settings: null };
        }

        const school = await prisma.school.findUnique({
            where: { id: session.user.schoolId },
            select: {
                jazzcashMerchantId: true,
                jazzcashPassword: true,
                jazzcashIntegritySalt: true,
                easypaisaMerchantId: true,
                easypaisaStoreId: true,
                easypaisaHashKey: true,
                paymentWebhookSecret: true,
            },
        });

        if (!school) {
            return { success: false, error: "School not found", settings: null };
        }

        // Mask secrets for display
        const maskSecret = (secret: string | null) =>
            secret ? "••••••••" + secret.slice(-4) : "";

        const maskedSettings = {
            jazzcashMerchantId: school.jazzcashMerchantId || "",
            jazzcashPassword: maskSecret(school.jazzcashPassword),
            jazzcashIntegritySalt: maskSecret(school.jazzcashIntegritySalt),
            easypaisaMerchantId: school.easypaisaMerchantId || "",
            easypaisaStoreId: school.easypaisaStoreId || "",
            easypaisaHashKey: maskSecret(school.easypaisaHashKey),
            paymentWebhookSecret: maskSecret(school.paymentWebhookSecret),
        };

        return { success: true, settings: maskedSettings };
    } catch (error) {
        console.error("Failed to fetch payment settings:", error);
        return { success: false, error: "Failed to fetch settings", settings: null };
    }
}
