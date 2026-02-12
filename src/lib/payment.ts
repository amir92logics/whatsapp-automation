import { prisma } from "./prisma";

export async function generatePaymentLink(feeId: string, provider: "EASYPAISA" | "JAZZCASH") {
    // 1. Fetch Fee Record with School Details to get credentials
    const feeRecord = await prisma.feeRecord.findUnique({
        where: { id: feeId },
        include: {
            student: {
                include: {
                    school: true
                }
            }
        }
    });

    if (!feeRecord) {
        throw new Error("Fee record not found");
    }

    const school = feeRecord.student.school;

    // 2. Determine credentials based on provider
    let merchantId = "";
    let storeId = ""; // Specific to EasyPaisa

    if (provider === "JAZZCASH") {
        if (!school.jazzcashMerchantId) {
            throw new Error("JazzCash Merchant ID not configured for this school");
        }
        merchantId = school.jazzcashMerchantId;
        // In a real generic integration, we'd sign the request using jazzcashPassword and jazzcashIntegritySalt here
    } else if (provider === "EASYPAISA") {
        if (!school.easypaisaMerchantId) {
            throw new Error("EasyPaisa Merchant ID not configured for this school");
        }
        merchantId = school.easypaisaMerchantId;
        storeId = school.easypaisaStoreId || "";
        // In a real integration, we'd sign using easypaisaHashKey here
    }

    // 3. Generate Mock Link with School Credentials
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Append credentials to URL so the mock page can display/use them
    const params = new URLSearchParams({
        feeId,
        provider,
        merchantId,
        storeId,
        amount: feeRecord.amount.toString(),
        schoolName: school.name
    });

    const paymentLink = `${baseUrl}/api/mock/pay?${params.toString()}`;

    await prisma.feeRecord.update({
        where: { id: feeId },
        data: { paymentLink }
    });

    return paymentLink;
}

export async function verifyWebhookSignature(payload: any, signature: string, secret: string) {
    // Mock verification for Pakistan's payment gateways
    // Real implementation would involve crypto.createHmac
    return true;
}
