"use client";

import { useState } from "react";
import { Plus, GraduationCap, Loader2 } from "lucide-react";
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
import { createClass } from "@/app/actions/class";

interface AddClassModalProps {
    schoolId: string;
}

export function AddClassModal({ schoolId }: AddClassModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            section: formData.get("section") as string,
            monthlyFee: parseFloat(formData.get("monthlyFee") as string) || 0,
            schoolId,
        };

        const result = await createClass(data);
        setLoading(false);

        if (result.success) {
            setOpen(false);
            setErrors({});
        } else if (result.errors) {
            setErrors(result.errors);
        } else {
            alert(result.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 shadow-lg transition-all hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4" />
                    Add New Class
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-emerald-100">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 mx-auto">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center text-emerald-950">Create Class</DialogTitle>
                        <DialogDescription className="text-center text-emerald-700/70">
                            Define a new educational group or section.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-emerald-900 font-semibold">Class Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Grade 10"
                                required
                                className={`border-emerald-100 focus-visible:ring-emerald-600 ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="section" className="text-emerald-900 font-semibold">Section (Optional)</Label>
                            <Input
                                id="section"
                                name="section"
                                placeholder="e.g., A, Blue, Morning"
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="monthlyFee" className="text-emerald-900 font-semibold">Standard Monthly Fee (Rs.) *</Label>
                        <Input
                            id="monthlyFee"
                            name="monthlyFee"
                            type="number"
                            placeholder="e.g., 5000"
                            required
                            min="1"
                            className={`border-emerald-100 focus-visible:ring-emerald-600 ${errors.monthlyFee ? 'border-red-500' : ''}`}
                        />
                        {errors.monthlyFee && <p className="text-red-500 text-xs mt-1">{errors.monthlyFee}</p>}
                        <p className="text-[10px] text-emerald-600/60 italic">Used for automated fee generation.</p>
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
                                "Define Class Group"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
