"use client";

import { useState } from "react";
import { Loader2, Edit, GraduationCap } from "lucide-react";
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
import { updateClass } from "@/app/actions/class";

interface EditClassModalProps {
    classId: string;
    currentName: string;
    currentSection?: string | null;
    currentMonthlyFee?: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditClassModal({
    classId,
    currentName,
    currentSection,
    currentMonthlyFee,
    open,
    onOpenChange
}: EditClassModalProps) {
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
        };

        const result = await updateClass(classId, data);
        setLoading(false);

        if (result.success) {
            onOpenChange(false);
        } else if (result.errors) {
            setErrors(result.errors);
        } else {
            alert(result.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-emerald-100">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 mx-auto">
                            <Edit className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center text-emerald-950">Edit Class</DialogTitle>
                        <DialogDescription className="text-center text-emerald-700/70">
                            Update class details and fee structure.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-emerald-900 font-semibold">Class Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={currentName}
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
                                defaultValue={currentSection || ""}
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="monthlyFee" className="text-emerald-900 font-semibold">Standard Monthly Fee (Rs.) *</Label>
                            <Input
                                id="monthlyFee"
                                name="monthlyFee"
                                type="number"
                                defaultValue={currentMonthlyFee || 0}
                                required
                                min="1"
                                className={`border-emerald-100 focus-visible:ring-emerald-600 ${errors.monthlyFee ? 'border-red-500' : ''}`}
                            />
                            {errors.monthlyFee && <p className="text-red-500 text-xs mt-1">{errors.monthlyFee}</p>}
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
                                    Updating...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
