"use client";

import { useState } from "react";
import { Settings, MoreVertical, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateSchoolStatus, deleteSchool } from "@/app/actions/school";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SchoolActionsProps {
    schoolId: string;
    isActive: boolean;
}

export function SchoolActions({ schoolId, isActive }: SchoolActionsProps) {
    const [loading, setLoading] = useState(false);

    async function handleToggleStatus() {
        setLoading(true);
        await updateSchoolStatus(schoolId, !isActive);
        setLoading(false);
    }

    async function handleDelete() {
        if (confirm("Are you sure you want to delete this school? This action is irreversible.")) {
            setLoading(true);
            await deleteSchool(schoolId);
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-end gap-1">
            <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 transition-colors ${isActive ? 'text-emerald-600 hover:bg-emerald-100' : 'text-rose-600 hover:bg-rose-100'}`}
                onClick={handleToggleStatus}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-100">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-emerald-100">
                    <DropdownMenuLabel>Institutional Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-emerald-700 hover:bg-emerald-50 cursor-pointer">
                        Edit Limits
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete School
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
