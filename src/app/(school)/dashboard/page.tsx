import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SchoolDashboard() {
    const session = await auth();

    if (!session?.user?.schoolId) {
        return redirect("/login");
    }

    const stats = await getDashboardStats(session.user.schoolId);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight text-emerald-950">School Overview</h2>
                <p className="text-emerald-700/70 text-sm">Real-time indicators for your institution.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-emerald-100 shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-emerald-900">Total Students</CardTitle>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Users className="h-4 w-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-950">{stats.studentCount}</div>
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" /> Real Data
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-emerald-900">Total Classes</CardTitle>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <BookOpen className="h-4 w-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-950">{stats.classCount}</div>
                        <p className="text-xs text-emerald-700/60 mt-1">Active sections</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-emerald-900">Pending Fees</CardTitle>
                        <div className="p-2 bg-rose-50 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-rose-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-950">{stats.pendingFees}</div>
                        <p className="text-xs text-rose-600 font-medium mt-1 italic">Vouchers pending sending</p>
                    </CardContent>
                </Card>

                <Card className="emerald-gradient border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-white/90">Platform Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-white tracking-tight">AM Automation Studio</div>
                        <p className="text-xs text-emerald-50 mt-1 opacity-80 italic">Enterprise Edition</p>
                    </CardContent>
                </Card>
            </div>

            {stats.studentCount === 0 && (
                <div className="mt-8 p-12 border-2 border-dashed border-emerald-100 rounded-2xl flex flex-col items-center justify-center bg-emerald-50/20 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-950">Ready to start?</h3>
                    <p className="text-emerald-800 max-w-sm mt-2">
                        Your database is connected. Add students to see analytics and manage fees.
                    </p>
                </div>
            )}
        </div>
    );
}
