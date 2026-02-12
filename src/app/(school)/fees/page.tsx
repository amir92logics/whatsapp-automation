import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, DollarSign, ArrowUpRight, Clock } from "lucide-react";
import { getCollectionStats } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function FeesPage() {
    const session = await auth();
    if (!session?.user?.schoolId) return redirect("/login");

    const stats = await getCollectionStats(session.user.schoolId);

    return (
        <div className="space-y-6 text-emerald-950">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Fee Management</h2>
                <p className="text-emerald-700/70 text-sm italic">Financial collection oversight and voucher tracking.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-emerald-100 shadow-sm overflow-hidden group transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-emerald-50/50">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-900">Active Vouchers</CardTitle>
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                            <Clock className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-4xl font-black text-emerald-950">{stats.pendingVouchers}</div>
                        <p className="text-xs text-emerald-700/60 mt-2 font-medium flex items-center gap-1">
                            Requires parent follow-up <ArrowUpRight className="w-3 h-3 text-rose-500" />
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 shadow-sm overflow-hidden group transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-emerald-50/50">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-900">Total Collection</CardTitle>
                        <div className="p-2 bg-emerald-600 rounded-lg text-white group-hover:scale-110 transition-transform shadow-lg shadow-emerald-100">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-4xl font-black text-emerald-950">
                            Rs. {stats.totalCollection.toLocaleString()}
                        </div>
                        <p className="text-xs text-emerald-700/60 mt-2 font-medium">
                            Total revenue collected from paid vouchers
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="p-8 border-2 border-dashed border-emerald-100 rounded-2xl flex flex-col items-center justify-center text-center bg-emerald-50/20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-emerald-50 mb-4">
                    <Receipt className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">Detailed Reports Coming Soon</h3>
                <p className="text-sm text-emerald-700/70 max-w-sm mt-2">
                    We are building advanced analytics to help you track individual student dues and historical collection patterns.
                </p>
            </div>
        </div>
    );
}
