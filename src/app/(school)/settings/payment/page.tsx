import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPaymentSettings } from "@/app/actions/payment-settings";
import { CreditCard } from "lucide-react";
import { PaymentSettingsClient } from "./payment-settings-client";

export default async function PaymentSettingsPage() {
    const session = await auth();

    if (!session?.user?.schoolId) {
        return redirect("/login");
    }

    const { settings } = await getPaymentSettings();

    return (
        <div className="space-y-6">
            <div className="border-b border-emerald-100 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-emerald-950 uppercase tracking-tight">
                            Payment Gateway Settings
                        </h1>
                        <p className="text-emerald-700/70 font-medium italic">
                            Configure your JazzCash and EasyPaisa merchant accounts
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
                <p className="font-bold mb-1">⚠️ Important Security Information</p>
                <ul className="space-y-1 ml-4 list-disc">
                    <li>Your merchant IDs and webhook secrets are encrypted and stored securely</li>
                    <li>Only authorized school admins can view or update these credentials</li>
                    <li>Never share your webhook secret with anyone</li>
                    <li>Contact your payment gateway provider to obtain these credentials</li>
                </ul>
            </div>

            <PaymentSettingsClient initialSettings={settings} />
        </div>
    );
}
