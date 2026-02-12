import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SuperAdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Global Settings</h2>
                <p className="text-muted-foreground">Manage platform-level configurations and branding.</p>
            </div>
            <Separator />
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Branding</CardTitle>
                        <CardDescription>Configure the main identity of AM Automation Studio.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="brand-name">Brand Name</Label>
                            <Input id="brand-name" defaultValue="AM Automation Studio" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="copyright-text">Default Copyright Text</Label>
                            <Input id="copyright-text" defaultValue="© 2026 AM Automation Studio. All Rights Reserved." />
                        </div>
                        <Button className="bg-primary">Update Platform Brand</Button>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 bg-emerald-50/30">
                    <CardHeader>
                        <CardTitle className="text-emerald-900">Subscription Defaults</CardTitle>
                        <CardDescription className="text-emerald-700">Set default limits for newly registered schools.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="def-classes">Default Max Classes</Label>
                                <Input id="def-classes" type="number" defaultValue="10" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="def-students">Default Max Students</Label>
                                <Input id="def-students" type="number" defaultValue="100" />
                            </div>
                        </div>
                        <Button variant="outline" className="border-emerald-200 text-emerald-700">Apply to All Schools</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
