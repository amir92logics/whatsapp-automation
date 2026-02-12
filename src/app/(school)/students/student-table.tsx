"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentActions } from "@/components/students/student-actions";
import { VoucherModal } from "./voucher-modal";

interface StudentTableProps {
    students: any[];
}

export function StudentTable({ students }: StudentTableProps) {
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [voucherOpen, setVoucherOpen] = useState(false);

    const handleViewVoucher = (student: any) => {
        setSelectedStudent(student);
        setVoucherOpen(true);
    };

    return (
        <>
            <div className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 border-emerald-100">
                            <TableHead className="font-bold text-emerald-900 border-none">Student Name</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Roll No</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Class/Grade</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Latest Fee Status</TableHead>
                            <TableHead className="text-right font-bold text-emerald-900 border-none">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-emerald-800 italic">
                                    No students enrolled in this school database.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id} className="hover:bg-emerald-50/30 transition-colors border-emerald-50">
                                    <TableCell className="font-semibold text-emerald-950">{student.name}</TableCell>
                                    <TableCell className="text-emerald-700 text-sm">{student.rollNo}</TableCell>
                                    <TableCell className="text-emerald-800 font-medium">
                                        {student.class.name} {student.class.section && `(${student.class.section})`}
                                    </TableCell>
                                    <TableCell>
                                        {student.feeRecords[0] ? (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tight ${student.feeRecords[0].status === 'PAID' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                                                }`}>
                                                {student.feeRecords[0].status} ({student.feeRecords[0].month})
                                            </span>
                                        ) : (
                                            <span className="text-xs text-emerald-600/40 italic font-medium">No records</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <StudentActions
                                            student={student}
                                            onViewVoucher={() => handleViewVoucher(student)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <VoucherModal
                student={selectedStudent}
                open={voucherOpen}
                onOpenChange={setVoucherOpen}
            />
        </>
    );
}
