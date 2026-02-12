"use client";

import { useState } from "react";
import { updatePaymentSettings } from "@/app/actions/payment-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, Shield, Smartphone } from "lucide-react";

interface PaymentSettingsClientProps {
    initialSettings: {
        jazzcashMerchantId: string;
        jazzcashPassword: string;
        jazzcashIntegritySalt: string;
        easypaisaMerchantId: string;
        easypaisaStoreId: string;
        easypaisaHashKey: string;
        paymentWebhookSecret: string; // Keep this for now, even if moved to individual cards
    } | null;
}

export function PaymentSettingsClient({ initialSettings }: PaymentSettingsClientProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        jazzcashMerchantId: initialSettings?.jazzcashMerchantId || "",
        jazzcashPassword: initialSettings?.jazzcashPassword || "",
        jazzcashIntegritySalt: initialSettings?.jazzcashIntegritySalt || "",
        easypaisaMerchantId: initialSettings?.easypaisaMerchantId || "",
        easypaisaStoreId: initialSettings?.easypaisaStoreId || "",
        easypaisaHashKey: initialSettings?.easypaisaHashKey || "",
        paymentWebhookSecret: initialSettings?.paymentWebhookSecret || "",
    });

    const handleSave = async () => {
        setLoading(true);
        setSuccess(false);

        // Only send fields that have values (or clear them by sending empty string if intended)
        // For masked fields, if they are still masked (contain ••••), we don't send them to avoid overwriting with dots
        const payload: any = { ...formData };

        // Helper to check if value is masked
        const isMasked = (val: string) => val.includes("••••");

        if (isMasked(formData.jazzcashPassword)) delete payload.jazzcashPassword;
        if (isMasked(formData.jazzcashIntegritySalt)) delete payload.jazzcashIntegritySalt;
        if (isMasked(formData.easypaisaHashKey)) delete payload.easypaisaHashKey;
        if (isMasked(formData.paymentWebhookSecret)) delete payload.paymentWebhookSecret;

        const result = await updatePaymentSettings(payload);

        setLoading(false);
        if (result.success) {
            setSuccess(true);
            // We don't clear the form data here for UX reasons, keep displaying the (now saved) masked values
            // Ideally we'd re-fetch to get the fresh masked values but this works for now
            setTimeout(() => setSuccess(false), 3000);
        } else {
            alert("Failed to update settings");
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-emerald-100">
                <CardHeader className="bg-blue-50/50 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-emerald-950">JazzCash Configuration</CardTitle>
                            <CardDescription>Configure your JazzCash merchant account</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="jazzcashMerchantId" className="text-emerald-900 font-semibold">
                            Merchant ID
                        </Label>
                        <Input
                            id="jazzcashMerchantId"
                            value={formData.jazzcashMerchantId}
                            onChange={(e) =>
                                setFormData({ ...formData, jazzcashMerchantId: e.target.value })
                            }
                            placeholder="Enter JazzCash Merchant ID"
                            className="border-emerald-100 focus-visible:ring-emerald-600"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="jazzcashPassword" className="text-emerald-900 font-semibold">
                            Password
                        </Label>
                        <Input
                            id="jazzcashPassword"
                            type="password"
                            value={formData.jazzcashPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, jazzcashPassword: e.target.value })
                            }
                            placeholder="Enter Password"
                            className="border-emerald-100 focus-visible:ring-emerald-600"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="jazzcashIntegritySalt" className="text-emerald-900 font-semibold">
                            Integrity Salt
                        </Label>
                        <Input
                            id="jazzcashIntegritySalt"
                            type="password"
                            value={formData.jazzcashIntegritySalt}
                            onChange={(e) =>
                                setFormData({ ...formData, jazzcashIntegritySalt: e.target.value })
                            }
                            placeholder="Enter Integrity Salt"
                            className="border-emerald-100 focus-visible:ring-emerald-600"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                        <p className="font-bold mb-1">How to get keys:</p>
                        <ol className="list-decimal ml-4 space-y-0.5">
                            <li>Login to JazzCash Merchant Portal</li>
                            <li>Navigate to Settings → API Credentials</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-emerald-100">
                <CardHeader className="bg-green-50/50 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-emerald-950">EasyPaisa Configuration</CardTitle>
                            <CardDescription>Configure your EasyPaisa merchant account</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="easypaisaMerchantId" className="text-emerald-900 font-semibold">
                            Merchant ID
                        </Label>
                        <Input
                            id="easypaisaMerchantId"
                            value={formData.easypaisaMerchantId}
                            onChange={(e) =>
                                setFormData({ ...formData, easypaisaMerchantId: e.target.value })
                            }
                            placeholder="Enter Merchant ID"
                            className="border-emerald-100 focus-visible:ring-emerald-600"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="easypaisaStoreId" className="text-emerald-900 font-semibold">
                            Store ID
                        </Label>
                        <Input
                            id="easypaisaStoreId"
                            value={formData.easypaisaStoreId}
                            onChange={(e) =>
                                setFormData({ ...formData, easypaisaStoreId: e.target.value })
                            }
                            placeholder="Enter Store ID"
                            className="border-emerald-100 focus-visible:ring-emerald-600"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="easypaisaHashKey" className="text-emerald-900 font-semibold">
                            Hash Key
                        </Label>
                        <Input
                            id="easypaisaHashKey"
                            type="password"
                            value={formData.easypaisaHashKey}
                            onChange={(e) =>
                                setFormData({ ...formData, easypaisaHashKey: e.target.value })
                            }
                            placeholder="Enter Hash Key"
                            className="border-emerald-100 focus-visible:ring-emerald-600"
                        />
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-900">
                        <p className="font-bold mb-1">How to get keys:</p>
                        <ol className="list-decimal ml-4 space-y-0.5">
                            <li>Login to EasyPaisa Merchant Portal</li>
                            <li>Navigate to Settings → Integration to find Store ID and Hash Key</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 border-emerald-100">
                <CardHeader className="bg-red-50/50 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-emerald-950">Webhook Security</CardTitle>
                            <CardDescription>
                                Shared secret for verifying payment notifications
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="paymentWebhookSecret" className="text-emerald-900 font-semibold">
                            Webhook Secret
                        </Label>
                        <Input
                            id="paymentWebhookSecret"
                            type="password"
                            value={formData.paymentWebhookSecret}
                            onChange={(e) =>
                                setFormData({ ...formData, paymentWebhookSecret: e.target.value })
                            }
                            placeholder="Enter new secret or leave blank/masked to keep existing"
                            className="border-emerald-100 focus-visible:ring-emerald-600"
                        />
                        <p className="text-xs text-emerald-700/60 italic">
                            Used to verify that payment notifications are genuinely from your payment gateway
                        </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-900">
                        <p className="font-bold mb-1">🔒 Security Best Practices:</p>
                        <ul className="list-disc ml-4 space-y-0.5">
                            <li>Use a strong, random secret (minimum 32 characters)</li>
                            <li>Never share this secret publicly or with third parties</li>
                            <li>Change this secret if you suspect it has been compromised</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-2 flex justify-end gap-3">
                {success && (
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        Settings saved successfully!
                    </div>
                )}
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Payment Settings"
                    )}
                </Button>
            </div>
        </div>
    );
}
