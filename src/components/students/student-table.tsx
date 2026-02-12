"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const initialStudents = [
    { id: "1", name: "Ahmed Khan", rollNo: "101", grade: "Grade 10-A", feeStatus: "PAID", phone: "+923001234567" },
    { id: "2", name: "Sara Ali", rollNo: "102", grade: "Grade 10-A", feeStatus: "PENDING", phone: "+923001234568" },
    { id: "3", name: "Zainab Fatima", rollNo: "103", grade: "Grade 10-B", feeStatus: "OVERDUE", phone: "+923001234569" },
    { id: "4", name: "Umar Farooq", rollNo: "104", grade: "Grade 10-B", feeStatus: "PAID", phone: "+923001234570" },
];

export function StudentTable() {
    const [selectedStudent, setSelectedStudent] = useState<typeof initialStudents[0] | null>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
            case "PENDING":
                return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full"><Clock className="w-3 h-3" /> Pending</span>;
            case "OVERDUE":
                return <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-1 rounded-full"><Clock className="w-3 h-3" /> Overdue</span>;
            default:
                return status;
        }
    };

    const voucherMessage = selectedStudent
        ? `Dear Parent, your child ${selectedStudent.name}'s fee for February 2026 is due. Click here to pay: https://pay.am-studio.com/${selectedStudent.id}`
        : "";

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-bold">Student Name</TableHead>
                        <TableHead className="font-bold">Roll No</TableHead>
                        <TableHead className="font-bold">Grade/Class</TableHead>
                        <TableHead className="font-bold">Fee Status</TableHead>
                        <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialStudents.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.rollNo}</TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell>{getStatusBadge(student.feeStatus)}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                                    onClick={() => setSelectedStudent(student)}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    WhatsApp Voucher
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>WhatsApp Message Preview</DialogTitle>
                        <DialogDescription>
                            Review the message before sending it to the parent.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-sm italic text-emerald-900 mb-4">
                        "{voucherMessage}"
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                                window.open(`https://wa.me/${selectedStudent?.phone}?text=${encodeURIComponent(voucherMessage)}`, "_blank");
                                setSelectedStudent(null);
                            }}
                        >
                            Open WhatsApp
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                navigator.clipboard.writeText(voucherMessage);
                                alert("Message copied to clipboard!");
                            }}
                        >
                            Copy Message
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
