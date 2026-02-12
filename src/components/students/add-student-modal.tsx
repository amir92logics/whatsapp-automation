"use client";

import { useState } from "react";
import { Plus, Users, Loader2 } from "lucide-react";
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
import { enrollStudent } from "@/app/actions/student";

interface AddStudentModalProps {
    schoolId: string;
    classes: { id: string; name: string; section: string | null }[];
}

export function AddStudentModal({ schoolId, classes }: AddStudentModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            rollNo: formData.get("rollNo") as string,
            grade: formData.get("grade") as string,
            parentPhone: formData.get("parentPhone") as string,
            schoolId,
            classId: formData.get("classId") as string,
        };

        const result = await enrollStudent(data);
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
                    Enroll New Student
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-emerald-100">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 mx-auto">
                            <Users className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center text-emerald-950">Student Enrollment</DialogTitle>
                        <DialogDescription className="text-center text-emerald-700/70">
                            Create a new student profile and link to a class.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-emerald-900 font-semibold">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Student Full Name"
                                required
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="rollNo" className="text-emerald-900 font-semibold">Roll Number</Label>
                                <Input
                                    id="rollNo"
                                    name="rollNo"
                                    placeholder="R-101"
                                    required
                                    className="border-emerald-100 focus-visible:ring-emerald-600"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="grade" className="text-emerald-900 font-semibold">Grade/Year</Label>
                                <Input
                                    id="grade"
                                    name="grade"
                                    placeholder="10th"
                                    required
                                    className="border-emerald-100 focus-visible:ring-emerald-600"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="classId" className="text-emerald-900 font-semibold">Assign Class</Label>
                            <select
                                id="classId"
                                name="classId"
                                required
                                className="flex h-10 w-full rounded-md border border-emerald-100 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="" disabled selected>Select a class...</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name} {cls.section && `(${cls.section})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="parentPhone" className="text-emerald-900 font-semibold">Parent Phone (WhatsApp)</Label>
                            <Input
                                id="parentPhone"
                                name="parentPhone"
                                placeholder="923001234567"
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
                                    Enrolling...
                                </>
                            ) : (
                                "Complete Enrollment"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
