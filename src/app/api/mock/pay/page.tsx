"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { useState, Suspense } from "react";

function MockPayContent() {
    const searchParams = useSearchParams();
    const feeId = searchParams.get("feeId");
    const provider = searchParams.get("provider");
    const merchantId = searchParams.get("merchantId");
    const storeId = searchParams.get("storeId");
    const amountAttr = searchParams.get("amount");
    const schoolName = searchParams.get("schoolName");

    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch("/api/fees/payment-webhook", {
                method: "POST",
                body: JSON.stringify({
                    feeId,
                    provider,
                    amount: amountAttr,
                    status: "success",
                    signature: "mock_sig"
                })
            });
            const data = await response.json();
            setResult(data.success ? "SUCCESS" : "FAILED");
        } catch (e) {
            setResult("ERROR");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="max-w-md w-full shadow-2xl border-emerald-100">
            <CardHeader className="text-center bg-emerald-50/50">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md text-emerald-600">
                        {provider === "JAZZCASH" ? <CreditCard className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                    </div>
                </div>
                <CardTitle className="text-2xl font-black text-emerald-950 uppercase tracking-tight">
                    {provider} SECURE GATEWAY
                </CardTitle>
                <CardDescription className="font-bold text-emerald-600/60 uppercase text-[10px] tracking-widest">
                    Mock Payment Environment
                </CardDescription>
                {schoolName && (
                    <div className="mt-2 text-sm font-medium text-emerald-800">
                        Paying to: <span className="font-bold">{schoolName}</span>
                    </div>
                )}
                <div className="mt-1 text-xs text-emerald-600/70 font-mono">
                    dMID: {merchantId} {storeId ? `| SID: ${storeId}` : ''}
                </div>
            </CardHeader>
            <CardContent className="pt-8 text-center space-y-6">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 italic text-emerald-800 text-sm">
                    This is a simulation. No real money will be charged.
                </div>

                {result ? (
                    <div className={`p-6 rounded-2xl font-black uppercase tracking-widest text-white ${result === "SUCCESS" ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                        {result}
                    </div>
                ) : (
                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full h-14 bg-emerald-950 hover:bg-black text-white font-black text-lg shadow-xl active:scale-95 transition-all"
                    >
                        {isProcessing ? <Loader2 className="animate-spin mr-2" /> : "PAY RS. 2,500 NOW"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default function MockPayPage() {
    return (
        <div className="min-h-screen bg-emerald-50/30 flex items-center justify-center p-4">
            <Suspense fallback={<Loader2 className="animate-spin text-emerald-600 w-12 h-12" />}>
                <MockPayContent />
            </Suspense>
        </div>
    );
}
