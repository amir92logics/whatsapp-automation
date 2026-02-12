"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { triggerManualReminders, triggerManualConfirmations } from "@/app/actions/campaign";
import { toast } from "sonner";
import { Loader2, BellRing, CheckCircle2, MessageSquareQuote } from "lucide-react";
import { AnnouncementModal } from "./announcement-modal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FeeWhatsAppPreviewCard } from "@/components/fees/fee-whatsapp-preview-card";
import { Eye } from "lucide-react";

interface CampaignActionsProps {
    schoolId: string;
    pendingCount: number;
    paidWithoutConfirmation: number;
    sampleFeeAmount?: string;
    sampleMonth?: string;
}

export function CampaignActions({ schoolId, pendingCount, paidWithoutConfirmation, sampleFeeAmount, sampleMonth }: CampaignActionsProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleReminders = async () => {
        setLoading("reminders");
        const res = await triggerManualReminders(schoolId);
        setLoading(null);
        if (res.success) {
            toast.success(`Success! Sent ${res.count} reminders.`);
        } else {
            toast.error("Failed to send reminders.");
        }
    };

    const handleConfirmations = async () => {
        setLoading("confirmations");
        const res = await triggerManualConfirmations(schoolId);
        setLoading(null);
        if (res.success) {
            toast.success(`Success! Sent ${res.count} confirmations.`);
        } else {
            toast.error("Failed to send confirmations.");
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-2xl border border-emerald-100 bg-white shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BellRing className="w-16 h-16" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-900/40 mb-1">Fee Reminders</h3>
                <div className="text-2xl font-black text-emerald-950 mb-1">{pendingCount} Recipients</div>
                <p className="text-[10px] text-emerald-700/60 mb-6 font-medium italic">Targetsstudents with PENDING status</p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs uppercase tracking-widest py-6 rounded-xl"
                    >
                        <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button
                        disabled={!!loading || pendingCount === 0}
                        onClick={handleReminders}
                        className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest py-6 rounded-xl shadow-lg shadow-emerald-100"
                    >
                        {loading === "reminders" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Launch Campaign"}
                    </Button>
                </div>
            </div>

            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="sm:max-w-md border-emerald-100">
                    <DialogHeader>
                        <DialogTitle className="text-emerald-950">Campaign Message Preview</DialogTitle>
                        <DialogDescription>
                            This is how the message will appear to parents on WhatsApp.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex justify-center bg-gray-50/50 rounded-xl">
                        <FeeWhatsAppPreviewCard
                            studentName="Ali Raza"
                            month={sampleMonth || "Current Month"}
                            amount={sampleFeeAmount || "5,000"}
                            paymentLink="https://pay.am-studio.com/..."
                            schoolName="Your School Name"
                        />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 flex gap-2 items-start">
                        <MessageSquareQuote className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>Variables like <b>Student Name</b> and <b>Amount</b> will be automatically replaced for each recipient.</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setShowPreview(false)}>Close</Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => {
                                setShowPreview(false);
                                handleReminders();
                            }}
                        >
                            Launch Campaign
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="p-6 rounded-2xl border border-emerald-100 bg-white shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CheckCircle2 className="w-16 h-16" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-900/40 mb-1">Confirmations</h3>
                <div className="text-2xl font-black text-emerald-950 mb-1">{paidWithoutConfirmation} Recipients</div>
                <p className="text-[10px] text-emerald-700/60 mb-6 font-medium italic">Targets PAID without messages</p>
                <Button
                    disabled={!!loading || paidWithoutConfirmation === 0}
                    onClick={handleConfirmations}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-6 rounded-xl shadow-lg shadow-blue-100"
                >
                    {loading === "confirmations" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Receipts"}
                </Button>
            </div>

            <div className="p-6 rounded-2xl border border-emerald-100 bg-white shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MessageSquareQuote className="w-16 h-16" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-900/40 mb-1">Custom Broadcast</h3>
                <div className="text-2xl font-black text-emerald-950 mb-1">Announcements</div>
                <p className="text-[10px] text-emerald-700/60 mb-6 font-medium italic">Send manual alerts to parents</p>
                <AnnouncementModal schoolId={schoolId} />
            </div>
        </div>
    );
}
