import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Send, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NotificationsPage() {
    const session = await auth();
    if (!session?.user?.schoolId) return redirect("/login");

    const notifications = await (prisma as any).notification.findMany({
        where: { schoolId: session.user.schoolId },
        include: { student: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-emerald-950 uppercase tracking-tight flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-emerald-600" />
                    Notification Intelligence
                </h2>
                <p className="text-emerald-700/60 font-medium">Tracking institutional communication and delivery status.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-emerald-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-900/40">Total Sent</CardTitle>
                        <Send className="w-4 h-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-emerald-950">{notifications.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-900/40">Delivered</CardTitle>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-emerald-950">
                            {notifications.filter((n: any) => n.status === "SENT").length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-900/40">Failures</CardTitle>
                        <XCircle className="w-4 h-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-emerald-950">
                            {notifications.filter((n: any) => n.status === "FAILED").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 border-emerald-100">
                            <TableHead className="font-bold text-emerald-900 uppercase text-[10px] tracking-widest border-none">Student</TableHead>
                            <TableHead className="font-bold text-emerald-900 uppercase text-[10px] tracking-widest border-none">Phone</TableHead>
                            <TableHead className="font-bold text-emerald-900 uppercase text-[10px] tracking-widest border-none">Type</TableHead>
                            <TableHead className="font-bold text-emerald-900 uppercase text-[10px] tracking-widest border-none">Status</TableHead>
                            <TableHead className="font-bold text-emerald-900 uppercase text-[10px] tracking-widest border-none">Provider</TableHead>
                            <TableHead className="font-bold text-emerald-900 uppercase text-[10px] tracking-widest border-none">Date/Time</TableHead>
                            <TableHead className="text-right font-bold text-emerald-900 uppercase text-[10px] tracking-widest border-none">Intelligence</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {notifications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-emerald-800/40 italic font-medium">
                                    No notification logs found for this school.
                                </TableCell>
                            </TableRow>
                        ) : (
                            notifications.map((notif: any) => (
                                <TableRow key={notif.id} className="hover:bg-emerald-50/30 transition-colors border-emerald-50">
                                    <TableCell className="font-bold text-emerald-950 text-sm">{notif.student.name}</TableCell>
                                    <TableCell className="text-emerald-700 font-medium text-xs font-mono">{notif.parentPhone}</TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-50 p-1 rounded">
                                            {notif.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {notif.status === "SENT" ? (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                                                    <CheckCircle2 className="w-3 h-3" /> SENT
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-black">
                                                    <XCircle className="w-3 h-3" /> FAILED
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">
                                            {notif.providerUsed}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-emerald-950">{new Date(notif.sentAt).toLocaleDateString()}</span>
                                            <span className="text-[10px] font-medium text-emerald-600/60 uppercase">{new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 border-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-[10px] uppercase tracking-tighter"
                                        >
                                            Resend
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-8 pt-8 border-t border-emerald-50 text-center">
                <p className="text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.3em] italic">
                    All notifications are subject to platform rate limits and security auditing.
                </p>
            </div>
        </div>
    );
}
