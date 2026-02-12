export interface WhatsAppArgs {
    schoolId: string;
    studentId: string;
    studentName: string;
    parentPhone: string;
    message: string;
    type: "CONFIRMATION" | "REMINDER" | "CUSTOM";
}

const PYTHON_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || "http://localhost:8000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "am-automation-studio-secret";

export async function sendWhatsAppNotification(args: WhatsAppArgs) {
    try {
        const response = await fetch(`${PYTHON_SERVICE_URL}/send-whatsapp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Internal-API-Key": INTERNAL_API_KEY
            },
            body: JSON.stringify({
                phone: args.parentPhone,
                message: args.message
            })
        });

        const result = await response.json();

        // Return structured result for Next.js to log to DB
        return {
            status: result.status === "SENT" ? "SENT" : "FAILED",
            providerUsed: result.provider || "unknown",
            errorMessage: result.status === "FAILED" ? (result.error || "Unknown error") : null,
            sentAt: new Date()
        };
    } catch (error: any) {
        console.error("[WhatsApp Client Error]:", error);
        return {
            status: "FAILED",
            providerUsed: "none",
            errorMessage: error.message,
            sentAt: new Date()
        };
    }
}
