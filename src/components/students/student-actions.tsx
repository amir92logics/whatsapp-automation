"use client";

import { useState } from "react";
import { MoreVertical, Loader2, Trash2, Edit, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteStudent } from "@/app/actions/student";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditStudentModal } from "./edit-student-modal";

interface StudentActionsProps {
    student: any;
    onViewVoucher: () => void;
}

export function StudentActions({ student, onViewVoucher }: StudentActionsProps) {
    const [loading, setLoading] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    async function handleDelete() {
        if (confirm("Are you sure you want to delete this student record? This action is irreversible.")) {
            setLoading(true);
            const result = await deleteStudent(student.id);
            setLoading(false);
            if (!result.success) alert(result.error);
        }
    }

    return (
        <div className="flex justify-end gap-2">
            <EditStudentModal
                student={student}
                open={showEdit}
                onOpenChange={setShowEdit}
            />

            <Button
                variant="outline"
                size="sm"
                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all font-medium h-8"
                onClick={onViewVoucher}
            >
                <MessageSquare className="w-3.5 h-3.5" />
                Voucher
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-100">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-emerald-100">
                    <DropdownMenuLabel>Student Management</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-emerald-700 hover:bg-emerald-50 cursor-pointer flex items-center gap-2"
                        onClick={() => setShowEdit(true)}
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete Student
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
