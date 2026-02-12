"use client";

import { useState } from "react";
import { Plus, School, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSchool } from "@/app/actions/school";

export function AddSchoolModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
            maxClasses: parseInt(formData.get("maxClasses") as string) || 10,
            maxStudents: parseInt(formData.get("maxStudents") as string) || 100,
        };

        const result = await createSchool(data);
        setLoading(false);

        if (result.success) {
            setOpen(false);
        } else {
            alert(result.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 shadow-lg transition-all hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4" />
                    Register New School
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-emerald-100">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 mx-auto">
                            <School className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center text-emerald-950">Register School</DialogTitle>
                        <DialogDescription className="text-center text-emerald-700/70">
                            Onboard a new institution into the AM Automation network.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-emerald-900 font-semibold">School Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Greenwood High School"
                                required
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-emerald-900 font-semibold">Contact Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+92..."
                                    className="border-emerald-100 focus-visible:ring-emerald-600"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="maxClasses" className="text-emerald-900 font-semibold">Max Classes</Label>
                                <Input
                                    id="maxClasses"
                                    name="maxClasses"
                                    type="number"
                                    defaultValue={10}
                                    className="border-emerald-100 focus-visible:ring-emerald-600"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="maxStudents" className="text-emerald-900 font-semibold">Max Students</Label>
                            <Input
                                id="maxStudents"
                                name="maxStudents"
                                type="number"
                                defaultValue={100}
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address" className="text-emerald-900 font-semibold">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Main Campus, West Side..."
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl transition-all shadow-lg shadow-emerald-100"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                "Complete Registration"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
