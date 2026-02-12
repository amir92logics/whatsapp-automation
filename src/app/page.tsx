import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function SchoolLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/30 p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.5)]"></div>
      <Card className="w-full max-w-md border-emerald-100 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-emerald-950">School Portal</CardTitle>
          <CardDescription className="text-emerald-700 font-medium italic">AM Automation Studio Institutional Access</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="p-3 mb-6 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-800 text-center font-black uppercase tracking-[0.1em]">
            ENTERPRISE GATEWAY • SECURE SESSION
          </div>
          <LoginForm variant="school" />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/super-admin/login" className="text-emerald-600/40 hover:text-emerald-600 text-[10px] font-bold uppercase tracking-widest transition-colors">
            Enterprise Platform Controller Access
          </Link>
        </CardFooter>
      </Card>
      <div className="fixed bottom-4 text-[11px] text-emerald-900/40 font-medium">
        © 2026 AM Automation Studio • Integrated SaaS Environment
      </div>
    </div>
  );
}
