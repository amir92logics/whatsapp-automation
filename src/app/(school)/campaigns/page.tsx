import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Send, CheckCircle2, XCircle, Clock, BellRing, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignActions } from "./campaign-actions";

export default async function CampaignsPage() {
    const session = await (auth as any)();
    if (!session?.user?.schoolId) return redirect("/login");

    const campaigns = await (prisma as any).campaign.findMany({
        where: { schoolId: session.user.schoolId },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    const pendingCount = await (prisma as any).feeRecord.count({
        where: {
            student: { schoolId: session.user.schoolId },
            status: "PENDING"
        }
    });

    const paidWithoutConfirmation = await (prisma as any).feeRecord.count({
        where: {
            student: { schoolId: session.user.schoolId },
            status: "PAID",
            confirmationSent: false
        }
    });

    // Fetch a sample pending fee to show realistic preview
    const sampleFee = await (prisma as any).feeRecord.findFirst({
        where: {
            student: { schoolId: session.user.schoolId },
            status: "PENDING"
        },
        include: {
            student: true
        }
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            <div>
                <h2 className="text-3xl font-black text-emerald-950 uppercase tracking-tight flex items-center gap-3">
                    <Megaphone className="w-8 h-8 text-emerald-600" />
                    Campaigns & Outreach
                </h2>
                <p className="text-emerald-700/60 font-medium italic">Operational manual outreach tools for {session.user.name}.</p>
            </div>

            <CampaignActions
                schoolId={session.user.schoolId}
                pendingCount={pendingCount}
                paidWithoutConfirmation={paidWithoutConfirmation}
                sampleFeeAmount={sampleFee ? sampleFee.amount.toString() : undefined}
                sampleMonth={sampleFee?.month}
            />

            <div className="space-y-4">
                <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">Recent Campaigns</h3>
                <div className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                    <div className="divide-y divide-emerald-50">
                        {campaigns.length === 0 ? (
                            <div className="p-8 text-center text-emerald-800/40 italic font-medium">No campaign history found.</div>
                        ) : (
                            campaigns.map((c: any) => (
                                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-emerald-50/30 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-white bg-emerald-950 px-2 py-0.5 rounded uppercase tracking-tighter">{c.campaignType}</span>
                                            <span className="font-bold text-emerald-950 text-sm">{c.messageContent}</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-600 font-medium uppercase">{new Date(c.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-xs font-black text-emerald-950">{c.totalRecipients}</div>
                                            <div className="text-[9px] text-emerald-700/40 font-bold uppercase tracking-tighter">Target</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-emerald-600">{c.sentCount}</div>
                                            <div className="text-[9px] text-emerald-700/40 font-bold uppercase tracking-tighter">Sent</div>
                                        </div>
                                        <div className="text-center w-12 h-12 rounded-full border border-emerald-100 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-emerald-950 rounded-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Megaphone className="w-32 h-32" />
                </div>
                <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-[0.2em] mb-2">Automated Oversight</h4>
                <p className="text-xs text-emerald-100/70 leading-relaxed font-medium">
                    Manual campaigns do not affect background automation. Payment webhooks will continue to trigger real-time messages 24/7. These tools are for institutional resending and custom alerts.
                </p>
            </div>

            <div className="text-center italic opacity-30 text-[9px] font-bold uppercase tracking-[0.3em] mt-12">
                © 2026 AM Automation Studio • Operational Management Layer
            </div>
        </div>
    );
}
