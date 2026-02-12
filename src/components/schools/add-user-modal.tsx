"use client";

import { useState } from "react";
import { Plus, UserPlus, Loader2 } from "lucide-react";
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
import { createUser } from "@/app/actions/user";

interface AddUserModalProps {
    schools: { id: string; name: string }[];
}

export function AddUserModal({ schools }: AddUserModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<"SUPER_ADMIN" | "SCHOOL_ADMIN">("SCHOOL_ADMIN");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            role: role,
            schoolId: role === "SCHOOL_ADMIN" ? formData.get("schoolId") as string : undefined,
            password: "password123", // Default for simplicity in this demo
        };

        const result = await createUser(data);
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
                    Add Platform User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-emerald-100">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 mx-auto">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center text-emerald-950">Add User</DialogTitle>
                        <DialogDescription className="text-center text-emerald-700/70">
                            Create a new administrative account for the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-emerald-900 font-semibold">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Admin Name"
                                required
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-emerald-900 font-semibold">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@example.com"
                                required
                                className="border-emerald-100 focus-visible:ring-emerald-600"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-emerald-900 font-semibold">Role</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="SCHOOL_ADMIN"
                                        checked={role === "SCHOOL_ADMIN"}
                                        onChange={() => setRole("SCHOOL_ADMIN")}
                                        className="text-emerald-600 focus:ring-emerald-600"
                                    />
                                    <span className="text-sm text-emerald-800">School Admin</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="SUPER_ADMIN"
                                        checked={role === "SUPER_ADMIN"}
                                        onChange={() => setRole("SUPER_ADMIN")}
                                        className="text-emerald-600 focus:ring-emerald-600"
                                    />
                                    <span className="text-sm text-emerald-800">Super Admin</span>
                                </label>
                            </div>
                        </div>
                        {role === "SCHOOL_ADMIN" && (
                            <div className="grid gap-2">
                                <Label htmlFor="schoolId" className="text-emerald-900 font-semibold">Assign School</Label>
                                <select
                                    id="schoolId"
                                    name="schoolId"
                                    required={role === "SCHOOL_ADMIN"}
                                    className="flex h-10 w-full rounded-md border border-emerald-100 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="" disabled selected>Select a school...</option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="text-[10px] text-emerald-600 italic">
                            * Default password: password123
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
                                    Creating User...
                                </>
                            ) : (
                                "Create User Account"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
