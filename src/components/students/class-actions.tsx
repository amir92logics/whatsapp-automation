"use client";

import { useState } from "react";
import { MoreVertical, Loader2, Trash2, Edit, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteClass, generateClassFees } from "@/app/actions/class";
import { EditClassModal } from "./edit-class-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClassActionsProps {
    classId: string;
    name: string;
    section?: string | null;
    monthlyFee?: number;
}

export function ClassActions({ classId, name, section, monthlyFee }: ClassActionsProps) {
    const [loading, setLoading] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    async function handleDelete() {
        if (confirm("Are you sure you want to delete this class? This will fail if students are still enrolled.")) {
            setLoading(true);
            const result = await deleteClass(classId);
            setLoading(false);
            if (!result.success) alert(result.error);
        }
    }

    async function handleGenerateFees() {
        const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        if (confirm(`Generate fees for ${month} for all students in ${name}? This will create pending fee records.`)) {
            setLoading(true);
            const result = await generateClassFees(classId, month);
            setLoading(false);

            if (result.success) {
                alert(`Successfully generated ${result.count} fee records.`);
            } else {
                alert(result.error);
            }
        }
    }

    return (
        <div className="flex justify-end">
            <EditClassModal
                classId={classId}
                currentName={name}
                currentSection={section}
                currentMonthlyFee={monthlyFee}
                open={showEdit}
                onOpenChange={setShowEdit}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-100">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-emerald-100 w-56">
                    <DropdownMenuLabel>Class Operations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-emerald-700 hover:bg-emerald-50 cursor-pointer flex items-center gap-2"
                        onClick={() => setShowEdit(true)}
                    >
                        <Edit className="w-4 h-4" />
                        Edit Group
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-emerald-700 hover:bg-emerald-50 cursor-pointer flex items-center gap-2"
                        onClick={handleGenerateFees}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                        Generate Monthly Fees
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete Class
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
