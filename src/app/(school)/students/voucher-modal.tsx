"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, ShieldCheck, CreditCard, Wallet, Loader2 } from "lucide-react";
import { createFeeRecord } from "@/app/actions/fee";
import { FeeWhatsAppPreviewCard } from "@/components/fees/fee-whatsapp-preview-card";

interface VoucherModalProps {
    student: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VoucherModal({ student, open, onOpenChange }: VoucherModalProps) {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState<"EASYPAISA" | "JAZZCASH">("EASYPAISA");

    if (!student) return null;

    const currentFee = student.feeRecords?.[0];
    const feeMonth = currentFee?.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const amount = currentFee?.amount || student.class?.monthlyFee || "0";
    const paymentLink = currentFee?.paymentLink || "[Generating...]";

    // Construct links safely
    let baseUrl = "/api/mock/pay";
    let params = `feeId=${currentFee?.id || ""}&amount=${amount}`;

    if (paymentLink && paymentLink !== "[Generating...]") {
        const split = paymentLink.split('?');
        if (split[0]) {
            baseUrl = split[0];
            if (baseUrl.includes("localhost") && typeof window !== "undefined") {
                baseUrl = `${window.location.origin}/api/mock/pay`;
            }
        }
        if (split[1]) params = split[1];
    } else if (typeof window !== "undefined") {
        baseUrl = `${window.location.origin}/api/mock/pay`;
    }

    // Ensure baseUrl is absolute for copying
    if (baseUrl.startsWith("/") && typeof window !== "undefined") {
        baseUrl = `${window.location.origin}${baseUrl}`;
    }

    const epLink = `${baseUrl}?${params}&provider=EASYPAISA`;
    const jcLink = `${baseUrl}?${params}&provider=JAZZCASH`;

    const message = `Dear Parent,\n\nThis is a notification from ${student.school?.name || 'the School'} regarding the fee voucher for ${student.name} (Roll No: ${student.rollNo}) for ${feeMonth}.\n\nPending Amount: Rs. ${amount}\n\nPlease click a link below to pay securely:\n\nPay via EasyPaisa:\n${epLink}\n\nPay via JazzCash:\n${jcLink}\n\nThank you,\nAM Automation Studio`;

    const handleGenerate = async () => {
        setLoading(true);
        // If no fee record exists for this month, create one
        if (!currentFee) {
            await createFeeRecord(student.id, feeMonth, Number(amount), new Date());
        }
        setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${student.parentPhone}?text=${encoded}`, "_blank");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-emerald-100 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <DialogTitle className="text-emerald-950 font-black uppercase tracking-tight">Institutional Voucher</DialogTitle>
                    </div>
                    <DialogDescription className="text-emerald-800/70 font-medium">
                        Automated fee notification for **{student.name}**.
                    </DialogDescription>
                </DialogHeader>

                {!currentFee ? (
                    <div className="p-6 text-center space-y-4">
                        <p className="text-sm text-emerald-900 font-bold italic">No active fee record found for {feeMonth}.</p>
                        <Button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : "GENERATE VOUCHER"}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-2 p-1 bg-emerald-50 rounded-xl border border-emerald-100 mb-4">
                            <Button
                                variant={provider === "EASYPAISA" ? "default" : "ghost"}
                                size="sm"
                                className={`flex-1 gap-2 font-bold text-[10px] uppercase tracking-widest ${provider === "EASYPAISA" ? 'bg-emerald-600 shadow-md' : 'text-emerald-600'}`}
                                onClick={() => setProvider("EASYPAISA")}
                            >
                                <Wallet className="w-3 h-3" /> Easypaisa
                            </Button>
                            <Button
                                variant={provider === "JAZZCASH" ? "default" : "ghost"}
                                size="sm"
                                className={`flex-1 gap-2 font-bold text-[10px] uppercase tracking-widest ${provider === "JAZZCASH" ? 'bg-emerald-600 shadow-md' : 'text-emerald-600'}`}
                                onClick={() => setProvider("JAZZCASH")}
                            >
                                <CreditCard className="w-3 h-3" /> JazzCash
                            </Button>
                        </div>


                        <div className="mt-4 mb-6">
                            <FeeWhatsAppPreviewCard
                                studentName={student.name}
                                month={feeMonth}
                                amount={amount.toString()}
                                paymentLink={paymentLink}
                                schoolName={student.school?.name || "School Name"}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="border-gray-200 text-gray-700 hover:bg-gray-50 font-bold"
                                onClick={() => onOpenChange(false)}
                            >
                                ❌ Cancel
                            </Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                                onClick={handleWhatsApp}
                            >
                                ✅ Send Now
                            </Button>
                        </div>
                    </>
                )}

                <div className="text-[9px] text-center text-emerald-700/40 mt-4 font-black uppercase tracking-[0.2em] border-t border-emerald-50 pt-4">
                    © 2026 AM Automation Studio • Integrated SaaS
                </div>
            </DialogContent>
        </Dialog >
    );
}
