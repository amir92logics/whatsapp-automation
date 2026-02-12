import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, GraduationCap, DollarSign, ArrowUpRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { getGlobalStats, getRecentSchools, getAutomationStats, getRecentPaymentLogs } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface PaymentLog {
    id: string;
    provider: string;
    amount: { toString: () => string }; // Handling Decimal loosely
    status: string;
    createdAt: Date | string;
}

export default async function SuperAdminDashboardPage() {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") return redirect("/");

    const [stats, recentSchools, autoStats, rawPaymentLogs] = await Promise.all([
        getGlobalStats(),
        getRecentSchools(5),
        getAutomationStats(),
        getRecentPaymentLogs(5)
    ]);

    const paymentLogs = rawPaymentLogs as unknown as PaymentLog[];

    const statCards = [
        {
            title: "Total Schools",
            value: stats.schoolCount.toString(),
            icon: School,
            description: "Registered institutions",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Global Students",
            value: stats.studentCount.toLocaleString(),
            icon: GraduationCap,
            description: "Across all schools",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Global Collection",
            value: `Rs. ${stats.globalCollection.toLocaleString()}`,
            icon: DollarSign,
            description: "Gross platform revenue",
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            <div>
                <h2 className="text-4xl font-black tracking-tight text-emerald-950">Platform Intelligence</h2>
                <p className="text-emerald-700/60 font-medium italic mt-1">Global oversight and institutional performance metrics.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-xl transition-all hover:-translate-y-1 border-emerald-100 overflow-hidden group">
                        <div className={`h-1 w-full ${stat.color.replace('text', 'bg')}`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-900/40">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-emerald-950">{stat.value}</div>
                            <p className="text-xs text-emerald-700/50 font-bold mt-1 uppercase tracking-tighter">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-emerald-100 shadow-xl bg-white/50 backdrop-blur-md overflow-hidden">
                    <CardHeader className="border-b border-emerald-50 bg-emerald-50/30">
                        <CardTitle className="text-emerald-900 flex items-center gap-2">
                            <School className="w-5 h-5 text-emerald-600" />
                            Recent Onboardings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-emerald-50">
                            {recentSchools.length === 0 ? (
                                <div className="p-8 text-center text-emerald-800/40 italic font-medium">No recent registrations.</div>
                            ) : (
                                recentSchools.map((school) => (
                                    <div key={school.id} className="p-4 flex items-center justify-between hover:bg-emerald-50/50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-emerald-950">{school.name}</span>
                                            <span className="text-xs text-emerald-600/60 font-medium whitespace-nowrap">Onboarded {new Date(school.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm font-black text-emerald-900">{school._count.students}</div>
                                                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Students</div>
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-emerald-100 shadow-xl bg-emerald-950 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldAlert className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-100">
                            Platform Integrity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-emerald-400">
                                Global Occupancy
                                <span>{Math.round((stats.studentCount / (stats.schoolCount * 500)) * 100) || 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-emerald-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000"
                                    style={{ width: `${Math.round((stats.studentCount / (stats.schoolCount * 500)) * 100) || 0}%` }}
                                />
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-emerald-100/70 font-medium leading-relaxed italic">
                                "The platform is currently hosting **{stats.schoolCount} institutions** with a total throughput of **{stats.adminCount} administrators**. Automation health: **Active**."
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <Card className="border-emerald-100 shadow-xl overflow-hidden">
                    <CardHeader className="bg-emerald-900 text-emerald-50">
                        <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest font-black">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Autonomous Payment Verifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-emerald-50">
                            {paymentLogs.length === 0 ? (
                                <div className="p-12 text-center text-emerald-800/30 italic font-bold">Waiting for payment webhooks...</div>
                            ) : (
                                paymentLogs.map((log) => (
                                    <div key={log.id} className="p-4 hover:bg-emerald-50/30 transition-colors flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${log.status === "SUCCESS" ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {log.provider === "EASYPAISA" ? "EP" : "JC"}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-emerald-950">Rs. {log.amount.toString()}</span>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${log.status === "SUCCESS" ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{log.status}</span>
                                            </div>
                                            <div className="text-[10px] text-emerald-600/60 font-medium">Verified at {new Date(log.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
