"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquareQuote, Loader2 } from "lucide-react";
import { sendCustomAnnouncement } from "@/app/actions/campaign";
import { toast } from "sonner";

export function AnnouncementModal({ schoolId }: { schoolId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [target, setTarget] = useState("ALL");

    const handleSend = async () => {
        if (!message) return toast.error("Please enter a message");
        setLoading(true);
        const res = await sendCustomAnnouncement(schoolId, message, target);
        setLoading(false);
        if (res.success) {
            toast.success(`Message broadcast to ${res.count} parents!`);
            setOpen(false);
            setMessage("");
        } else {
            toast.error(res.error || "Failed to send announcement");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest py-6 rounded-xl shadow-lg shadow-rose-100">
                    <MessageSquareQuote className="w-4 h-4 mr-2" />
                    New Message
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-emerald-100">
                <DialogHeader>
                    <DialogTitle className="text-emerald-950 font-black uppercase text-sm tracking-tight">Manual Custom Broadcast</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Recipient Group</label>
                        <Select value={target} onValueChange={setTarget}>
                            <SelectTrigger className="border-emerald-100 focus:ring-emerald-600">
                                <SelectValue placeholder="Select target group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Parents</SelectItem>
                                <SelectItem value="PENDING">Only Pending Fee Parents</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Message Content</label>
                        <Textarea
                            placeholder="Type your announcement here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[120px] border-emerald-100 focus-visible:ring-emerald-600"
                        />
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={loading}
                        className="w-full bg-emerald-950 hover:bg-black text-white font-black text-xs uppercase tracking-widest py-6"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Broadcast Now"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
