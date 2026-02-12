"use client";

import { useState } from "react";
import { Loader2, Edit, User } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStudent } from "@/app/actions/student";

interface EditStudentModalProps {
    student: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditStudentModal({ student, open, onOpenChange }: EditStudentModalProps) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            rollNo: formData.get("rollNo") as string,
            parentPhone: formData.get("parentPhone") as string,
            // We are not editing class/grade here for simplicity, but could be added
        };

        const result = await updateStudent(student.id, data);
        setLoading(false);

        if (result.success) {
            onOpenChange(false);
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
                            <User className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center text-emerald-950">Edit Student</DialogTitle>
                        <DialogDescription className="text-center text-emerald-700/70">
                            Update student profile information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-emerald-900 font-semibold">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={student.name}
                                required
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rollNo" className="text-emerald-900 font-semibold">Roll Number</Label>
                            <Input
                                id="rollNo"
                                name="rollNo"
                                defaultValue={student.rollNo}
                                required
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="parentPhone" className="text-emerald-900 font-semibold">Parent Phone (WhatsApp)</Label>
                            <Input
                                id="parentPhone"
                                name="parentPhone"
                                defaultValue={student.parentPhone}
                                required
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
