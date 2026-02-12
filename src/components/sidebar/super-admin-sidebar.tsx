"use client";

import { LayoutDashboard, School, Users, Settings, LogOut, ShieldAlert, MessageSquare } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
    {
        title: "Global Dashboard",
        url: "/super-admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Register Schools",
        url: "/super-admin/schools",
        icon: School,
    },
    {
        title: "Platform Admins",
        url: "/super-admin/users",
        icon: Users,
    },
    {
        title: "WhatsApp Settings",
        url: "/super-admin/settings/whatsapp",
        icon: MessageSquare,
    },
    {
        title: "System Settings",
        url: "/super-admin/settings",
        icon: Settings,
    },
];

export function SuperAdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="border-emerald-200 bg-emerald-950 text-white">
            <SidebarHeader className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg text-emerald-950">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-white text-lg tracking-tighter leading-none">AM Studio</span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Super Admin</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarMenu className="gap-2">
                    {items.map((item) => {
                        const isActive = pathname === item.url;
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                                    <Link
                                        href={item.url}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg transition-all",
                                            isActive
                                                ? "bg-white text-emerald-950 hover:bg-emerald-50"
                                                : "text-emerald-100 hover:bg-white/10"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5",
                                            isActive ? "text-emerald-700" : "text-emerald-400"
                                        )} />
                                        <span className="font-semibold">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-6 border-t border-white/10 flex flex-col gap-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="w-full justify-start gap-3 text-emerald-400 hover:text-white hover:bg-emerald-900 rounded-lg p-3 font-bold transition-all"
                            onClick={() => signOut()}
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Exit System</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="text-[10px] text-center text-emerald-500/50 font-medium uppercase tracking-widest leading-relaxed">
                    © 2026 AM Automation Studio<br />Enterprise Platform
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
