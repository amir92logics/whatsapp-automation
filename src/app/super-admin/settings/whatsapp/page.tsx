import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllSchoolsWhatsAppSettings } from "@/app/actions/admin-whatsapp";
import { MessageSquare, Settings, Shield } from "lucide-react";
import { WhatsAppSettingsClient } from "./whatsapp-settings-client";

export default async function WhatsAppSettingsPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        return redirect("/");
    }

    const { schools } = await getAllSchoolsWhatsAppSettings();

    return (
        <div className="space-y-6">
            <div className="border-b border-emerald-100 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-emerald-950 uppercase tracking-tight">
                            WhatsApp Provider Settings
                        </h1>
                        <p className="text-emerald-700/70 font-medium italic">
                            Manage WhatsApp integration providers for all schools
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                    <p className="font-bold mb-1">Provider Options:</p>
                    <ul className="space-y-1 ml-4 list-disc">
                        <li>
                            <strong>pywhatkit</strong>: Browser-based automation (default, free, requires WhatsApp Web session)
                        </li>
                        <li>
                            <strong>Cloud API</strong>: Meta's official HTTP API (paid, requires business verification, instant delivery)
                        </li>
                    </ul>
                </div>
            </div>

            <WhatsAppSettingsClient schools={schools} />
        </div>
    );
}
