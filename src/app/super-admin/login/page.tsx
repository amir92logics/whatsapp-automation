import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function SuperAdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-950 p-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
            <Card className="w-full max-w-md border-white/10 shadow-2xl bg-emerald-900/40 backdrop-blur-xl text-white">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-emerald-950 transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                            <ShieldAlert className="w-8 h-8" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter">Super Admin</CardTitle>
                    <CardDescription className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                        Enterprise Control Gateway
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="p-3 mb-6 rounded-xl bg-white/5 border border-white/10 text-[9px] text-emerald-300 text-center font-bold uppercase tracking-[0.2em]">
                        AUTHORIZED PERSONNEL ONLY • ENCRYPTED SESSION
                    </div>
                    <LoginForm variant="super-admin" />
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Link href="/" className="text-emerald-400/50 hover:text-emerald-400 text-[10px] font-bold uppercase tracking-widest transition-colors">
                        Return to School Portal Login
                    </Link>
                </CardFooter>
            </Card>
            <div className="fixed bottom-4 text-[10px] text-emerald-600/60 font-black uppercase tracking-[0.3em]">
                AM Automation Studio • Platform Controller
            </div>
        </div>
    );
}
