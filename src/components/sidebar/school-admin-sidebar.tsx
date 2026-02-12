"use client";

import { LayoutDashboard, Users, GraduationCap, Receipt, Settings, LogOut, MessageSquare, Megaphone } from "lucide-react";
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
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Students",
        url: "/students",
        icon: Users,
    },
    {
        title: "Classes",
        url: "/classes",
        icon: GraduationCap,
    },
    {
        title: "Fee Management",
        url: "/fees",
        icon: Receipt,
    },
    {
        title: "Notifications",
        url: "/notifications",
        icon: MessageSquare,
    },
    {
        title: "Campaigns (Optional)",
        url: "/campaigns",
        icon: Megaphone,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

interface SchoolAdminSidebarProps {
    schoolName: string;
}

export function SchoolAdminSidebar({ schoolName }: SchoolAdminSidebarProps) {
    const pathname = usePathname();

    return (
        <Sidebar className="border-emerald-100 bg-white">
            <SidebarHeader className="p-4 border-b border-emerald-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-emerald-200 shadow-lg text-white">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-emerald-950 truncate max-w-[150px]">{schoolName}</span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">School Portal</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu className="gap-1">
                    {items.map((item) => {
                        const isActive = pathname === item.url;
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                                    <Link
                                        href={item.url}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg transition-all group",
                                            isActive
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
                                                : "hover:bg-emerald-50 text-emerald-900 hover:translate-x-1"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-transform group-hover:scale-110",
                                            isActive ? "text-white" : "text-emerald-600"
                                        )} />
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-emerald-50 flex flex-col gap-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="w-full justify-start gap-3 text-rose-600 hover:text-white hover:bg-rose-500 rounded-lg p-3 font-semibold transition-all"
                            onClick={() => signOut()}
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Authorization Exit</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="flex flex-col items-center gap-1">
                    <div className="text-[9px] text-emerald-900/40 font-bold uppercase tracking-[0.2em]">
                        Developed By
                    </div>
                    <div className="text-[10px] font-black text-emerald-900/60 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
                        AM Automation Studio
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
