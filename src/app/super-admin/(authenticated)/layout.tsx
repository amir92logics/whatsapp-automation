import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/sidebar/super-admin-sidebar";
import { Search, Bell, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") return redirect("/");

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-emerald-50/20 font-sans">
                <SuperAdminSidebar />
                <SidebarInset className="flex flex-col flex-1">
                    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white/80 backdrop-blur-md px-6 gap-4 sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="text-emerald-950" />
                            <div className="relative w-72 hidden lg:block">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-900/30" />
                                <Input
                                    type="search"
                                    placeholder="Global school search..."
                                    className="pl-9 bg-emerald-50/50 border-emerald-100/50 h-10 rounded-full focus-visible:ring-emerald-600 transition-all border-none shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="text-emerald-900/50 hover:text-emerald-900 hover:bg-emerald-50 rounded-full">
                                <Bell className="w-5 h-5" />
                            </Button>
                            <div className="h-8 w-px bg-emerald-100 mx-2"></div>
                            <div className="flex items-center gap-3 pl-2">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-emerald-950 leading-none">{session.user.name || "Platform Admin"}</span>
                                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight mt-1 truncate max-w-[100px]">Role: Super Admin</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-white font-bold border-2 border-white shadow-md overflow-hidden">
                                    <UserCircle className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-8 bg-zinc-50/30">
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {children}
                        </div>
                    </main>
                    <footer className="w-full py-4 border-t bg-white px-8 flex justify-between items-center text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">
                        <div>AM Automation Studio Enterprise</div>
                        <div>Built for Professional Growth</div>
                    </footer>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
