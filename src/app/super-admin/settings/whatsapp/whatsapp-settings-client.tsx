"use client";

import { useState } from "react";
import {
    updateSchoolWhatsAppSettings,
    testSchoolWhatsAppConnection,
} from "@/app/actions/admin-whatsapp";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Edit, TestTube2, Loader2, CheckCircle2, XCircle, Cloud, Chrome } from "lucide-react";

interface School {
    id: string;
    name: string;
    isActive: boolean;
    whatsappProvider: string;
    whatsappPhoneNumberId?: string | null;
    whatsappAccessToken?: string | null;
    whatsappBusinessId?: string | null;
}

interface WhatsAppSettingsClientProps {
    schools: School[];
}

export function WhatsAppSettingsClient({ schools }: WhatsAppSettingsClientProps) {
    const [editingSchool, setEditingSchool] = useState<School | null>(null);
    const [loading, setLoading] = useState(false);
    const [testingSchoolId, setTestingSchoolId] = useState<string | null>(null);
    const [testResult, setTestResult] = useState<{ success: boolean; message?: string } | null>(null);

    const [formData, setFormData] = useState({
        provider: "pywhatkit",
        phoneNumberId: "",
        accessToken: "",
        businessId: "",
    });

    const handleEdit = (school: School) => {
        setEditingSchool(school);
        setFormData({
            provider: school.whatsappProvider || "pywhatkit",
            phoneNumberId: school.whatsappPhoneNumberId || "",
            accessToken: "",
            // Don't show masked token
            businessId: school.whatsappBusinessId || "",
        });
    };

    const handleSave = async () => {
        if (!editingSchool) return;

        setLoading(true);
        const result = await updateSchoolWhatsAppSettings(editingSchool.id, {
            whatsappProvider: formData.provider,
            whatsappPhoneNumberId: formData.phoneNumberId,
            whatsappAccessToken: formData.accessToken || undefined,
            whatsappBusinessId: formData.businessId,
        });

        setLoading(false);
        if (result.success) {
            setEditingSchool(null);
            window.location.reload(); // Refresh to show updated data
        } else {
            alert("Failed to update settings");
        }
    };

    const handleTest = async (schoolId: string) => {
        setTestingSchoolId(schoolId);
        setTestResult(null);

        const result = await testSchoolWhatsAppConnection(schoolId);
        setTestResult(result);
        setTestingSchoolId(null);

        // Auto-hide result after 5 seconds
        setTimeout(() => setTestResult(null), 5000);
    };

    const getProviderBadge = (provider: string) => {
        if (provider === "cloud_api") {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    <Cloud className="w-3 h-3" /> Cloud API
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                <Chrome className="w-3 h-3" /> PyWhatKit
            </span>
        );
    };

    return (
        <>
            <div className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 border-emerald-100">
                            <TableHead className="font-bold text-emerald-900">School Name</TableHead>
                            <TableHead className="font-bold text-emerald-900">Provider</TableHead>
                            <TableHead className="font-bold text-emerald-900">Phone Number ID</TableHead>
                            <TableHead className="font-bold text-emerald-900">Status</TableHead>
                            <TableHead className="text-right font-bold text-emerald-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools.map((school) => (
                            <TableRow key={school.id} className="hover:bg-emerald-50/30">
                                <TableCell className="font-semibold text-emerald-950">
                                    {school.name}
                                </TableCell>
                                <TableCell>{getProviderBadge(school.whatsappProvider)}</TableCell>
                                <TableCell className="text-sm text-emerald-700">
                                    {school.whatsappPhoneNumberId || <span className="text-gray-400 italic">Not configured</span>}
                                </TableCell>
                                <TableCell>
                                    {school.isActive ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                            <XCircle className="w-3 h-3" /> Inactive
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                            onClick={() => handleEdit(school)}
                                        >
                                            <Edit className="w-3.5 h-3.5 mr-1" />
                                            Configure
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                            onClick={() => handleTest(school.id)}
                                            disabled={testingSchoolId === school.id}
                                        >
                                            {testingSchoolId === school.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <TestTube2 className="w-3.5 h-3.5 mr-1" />
                                            )}
                                            Test
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {testResult && (
                <div
                    className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg border ${testResult.success
                        ? "bg-green-50 border-green-200 text-green-900"
                        : "bg-red-50 border-red-200 text-red-900"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        {testResult.success ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <XCircle className="w-5 h-5" />
                        )}
                        <span className="font-bold text-sm">
                            {testResult.success ? "Test Passed!" : "Test Failed"}
                        </span>
                    </div>
                    {testResult.message && (
                        <p className="text-xs mt-1">{testResult.message}</p>
                    )}
                </div>
            )}

            <Dialog open={!!editingSchool} onOpenChange={() => setEditingSchool(null)}>
                <DialogContent className="sm:max-w-[500px] border-emerald-100">
                    <DialogHeader>
                        <DialogTitle className="text-emerald-950">
                            Configure WhatsApp Provider: {editingSchool?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Choose the messaging provider and configure credentials.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="provider" className="text-emerald-900 font-semibold">
                                Provider
                            </Label>
                            <Select
                                value={formData.provider}
                                onValueChange={(value) => setFormData({ ...formData, provider: value })}
                            >
                                <SelectTrigger className="border-emerald-100 focus:ring-emerald-600">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pywhatkit">PyWhatKit (Browser-based)</SelectItem>
                                    <SelectItem value="cloud_api">Cloud API (Meta Official)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.provider === "cloud_api" && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="phoneNumberId" className="text-emerald-900 font-semibold">
                                        Phone Number ID *
                                    </Label>
                                    <Input
                                        id="phoneNumberId"
                                        value={formData.phoneNumberId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phoneNumberId: e.target.value })
                                        }
                                        placeholder="1234567890123456"
                                        className="border-emerald-100 focus-visible:ring-emerald-600"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="accessToken" className="text-emerald-900 font-semibold">
                                        Access Token *
                                    </Label>
                                    <Input
                                        id="accessToken"
                                        type="password"
                                        value={formData.accessToken}
                                        onChange={(e) =>
                                            setFormData({ ...formData, accessToken: e.target.value })
                                        }
                                        placeholder="Enter new token or leave blank to keep existing"
                                        className="border-emerald-100 focus-visible:ring-emerald-600"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="businessId" className="text-emerald-900 font-semibold">
                                        Business ID (Optional)
                                    </Label>
                                    <Input
                                        id="businessId"
                                        value={formData.businessId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, businessId: e.target.value })
                                        }
                                        placeholder="1234567890123456"
                                        className="border-emerald-100 focus-visible:ring-emerald-600"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setEditingSchool(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Settings"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
