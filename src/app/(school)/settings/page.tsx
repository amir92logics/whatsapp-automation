import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSchoolById } from "@/lib/db";
import { Settings, ShieldCheck, Info } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.schoolId) return redirect("/login");

    const school = await getSchoolById(session.user.schoolId);
    if (!school) return <div>School not found.</div>;

    return (
        <div className="space-y-6 text-emerald-950">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Institutional Settings</h2>
                <p className="text-emerald-700/70 text-sm">Manage your school profile and system preferences.</p>
            </div>

            <Separator className="bg-emerald-100" />

            <div className="grid gap-6">
                <Card className="border-emerald-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-emerald-50/50 border-b border-emerald-50">
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-emerald-600" />
                            <CardTitle className="text-lg">School Profile</CardTitle>
                        </div>
                        <CardDescription className="text-emerald-700/60 font-medium">Update institutional information shown in the portal and reports.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="school-name" className="text-emerald-900 font-bold">School Name</Label>
                                <Input
                                    id="school-name"
                                    defaultValue={school.name}
                                    className="border-emerald-200 focus-visible:ring-emerald-600"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="school-phone" className="text-emerald-900 font-bold">Official Phone</Label>
                                <Input
                                    id="school-phone"
                                    defaultValue={school.phone || "Not Set"}
                                    className="border-emerald-200 focus-visible:ring-emerald-600"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="school-address" className="text-emerald-900 font-bold">Campus Address</Label>
                            <Input
                                id="school-address"
                                defaultValue={school.address || "Main Campus"}
                                className="border-emerald-200 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-50 px-8 font-bold">
                            Save Profile Changes
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 shadow-sm overflow-hidden opacity-80 grayscale-[0.5]">
                    <CardHeader className="bg-emerald-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                <CardTitle className="text-lg">White-Label Branding</CardTitle>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-black border border-emerald-200 tracking-wider">
                                ENTERPRISE ONLY
                            </span>
                        </div>
                        <CardDescription className="text-emerald-700/60 font-medium">Customize the appearance of your dedicated portal.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl bg-emerald-50/30">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-emerald-950 uppercase tracking-widest">Portal Branding</p>
                                <p className="text-sm text-emerald-800 font-medium">AM Automation Studio Native Layout</p>
                            </div>
                            <Button variant="outline" size="sm" disabled className="border-emerald-200 text-emerald-600 font-black text-[10px]">
                                UPGRADE PLAN
                            </Button>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium italic">
                            Custom logo uploads and color systems are available in the Professional and Enterprise tiers.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
