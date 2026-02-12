"use client";

import { useState } from "react";
import { Settings, MoreVertical, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/app/actions/user";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserActionsProps {
    userId: string;
}

export function UserActions({ userId }: UserActionsProps) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (confirm("Are you sure you want to delete this user? This action is irreversible.")) {
            setLoading(true);
            await deleteUser(userId);
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-end gap-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-100">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-emerald-100">
                    <DropdownMenuLabel>Account Management</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-emerald-700 hover:bg-emerald-50 cursor-pointer">
                        Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
