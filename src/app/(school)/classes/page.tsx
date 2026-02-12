import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getClassesBySchool } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddClassModal } from "@/components/students/add-class-modal";
import { ClassActions } from "@/components/students/class-actions";

export default async function ClassesPage() {
    const session = await auth();
    if (!session?.user?.schoolId) return redirect("/login");

    const classes = await getClassesBySchool(session.user.schoolId);

    return (
        <div className="space-y-6 text-emerald-950">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Classes & Sections</h2>
                    <p className="text-emerald-700/70 text-sm italic">Define and manage institutional academic groups.</p>
                </div>
                <AddClassModal schoolId={session.user.schoolId} />
            </div>

            <div className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 border-emerald-100">
                            <TableHead className="font-bold text-emerald-900 border-none">Class Name</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Section</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Enrollment</TableHead>
                            <TableHead className="text-right font-bold text-emerald-900 border-none">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center text-emerald-800 italic">
                                    No academic groups defined yet. Start by defining your first class.
                                </TableCell>
                            </TableRow>
                        ) : (
                            classes.map((cls) => (
                                <TableRow key={cls.id} className="hover:bg-emerald-50/30 transition-colors border-emerald-50">
                                    <TableCell className="font-semibold text-emerald-950">{cls.name}</TableCell>
                                    <TableCell className="text-emerald-700">{cls.section || "—"}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            {cls._count.students} Active Students
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ClassActions
                                            classId={cls.id}
                                            name={cls.name}
                                            section={cls.section}
                                            monthlyFee={cls.monthlyFee ? Number(cls.monthlyFee) : 0}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
