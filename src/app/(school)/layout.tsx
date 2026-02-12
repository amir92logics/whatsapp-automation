import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SchoolAdminSidebar } from "@/components/sidebar/school-admin-sidebar";
import { Search, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSchoolById } from "@/lib/db";

export default async function SchoolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user?.schoolId) return redirect("/login");

    const school = await getSchoolById(session.user.schoolId);
    const schoolName = school?.name || "Greenwood High School";

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <SchoolAdminSidebar schoolName={schoolName} />
                <SidebarInset className="flex flex-col flex-1">
                    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                            <div className="relative w-64 hidden md:block">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-emerald-600/30" />
                                <Input
                                    type="search"
                                    placeholder="Search students..."
                                    className="pl-8 bg-emerald-50/50 border-emerald-100/50 h-9 focus-visible:ring-emerald-600"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-sm font-bold text-emerald-950">{session.user.name || "Administrator"}</span>
                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">{schoolName}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border-2 border-white shadow-sm overflow-hidden">
                                <UserCircle className="w-8 h-8" />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                    <footer className="w-full p-4 border-t text-center text-[10px] text-emerald-900/30 font-bold uppercase tracking-widest">
                        © 2026 AM Automation Studio • Enterprise SaaS Environment
                    </footer>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
