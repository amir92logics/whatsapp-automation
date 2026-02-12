"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, LogIn, Loader2 } from "lucide-react";
import { authenticate } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

interface LoginFormProps {
    variant?: "school" | "super-admin";
}

export function LoginForm({ variant = "school" }: LoginFormProps) {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined
    );

    const isSuperAdmin = variant === "super-admin";

    return (
        <form action={dispatch} className="grid gap-6 mt-2">
            <div className="grid gap-2">
                <Label
                    htmlFor="email"
                    className={cn(
                        "font-semibold ml-1",
                        isSuperAdmin ? "text-emerald-100" : "text-emerald-900"
                    )}
                >
                    {isSuperAdmin ? "Control Email" : "Official Email"}
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={isSuperAdmin ? "admin@am-studio.com" : "admin@school.com"}
                    required
                    className={cn(
                        "border-none transition-all",
                        isSuperAdmin
                            ? "bg-white/10 text-white placeholder:text-emerald-400/50 focus-visible:ring-emerald-400"
                            : "border-emerald-200 focus-visible:ring-emerald-600 bg-white"
                    )}
                />
            </div>
            <div className="grid gap-2">
                <Label
                    htmlFor="password"
                    className={cn(
                        "font-semibold ml-1",
                        isSuperAdmin ? "text-emerald-100" : "text-emerald-900"
                    )}
                >
                    Access Key
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={cn(
                        "border-none transition-all",
                        isSuperAdmin
                            ? "bg-white/10 text-white placeholder:text-emerald-400/50 focus-visible:ring-emerald-400"
                            : "border-emerald-200 focus-visible:ring-emerald-600 bg-white"
                    )}
                />
            </div>

            {errorMessage && (
                <div className={cn(
                    "p-3 rounded-lg border text-xs text-center font-bold",
                    isSuperAdmin
                        ? "bg-rose-500/20 border-rose-500/30 text-rose-200"
                        : "bg-rose-50/ border-rose-100 text-rose-800"
                )}>
                    {errorMessage}
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className={cn(
                    "w-full font-bold h-11 shadow-lg transition-all active:scale-[0.98]",
                    isSuperAdmin
                        ? "bg-white text-emerald-950 hover:bg-emerald-50"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isSuperAdmin ? "Verifying Protocols..." : "Authorizing..."}
                    </>
                ) : (
                    <>
                        {isSuperAdmin ? "Secure Login" : "Authorize Access"} <LogIn className="ml-2 w-4 h-4" />
                    </>
                )}
            </Button>
        </form>
    );
}
