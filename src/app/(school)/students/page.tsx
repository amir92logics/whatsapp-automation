import { Plus, Search } from "lucide-react";
import { getStudentsBySchool, getClassesBySchool } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddStudentModal } from "@/components/students/add-student-modal";
import { StudentTable } from "./student-table";
import { Input } from "@/components/ui/input";

export default async function StudentListPage() {
    const session = await auth();
    if (!session?.user?.schoolId) return redirect("/login");

    const [studentsData, classes] = await Promise.all([
        getStudentsBySchool(session.user.schoolId),
        getClassesBySchool(session.user.schoolId)
    ]);

    // Serialize Decimals for Client Components to prevent Next.js serialization errors
    const students = studentsData.map(student => ({
        ...student,
        feeRecords: student.feeRecords.map(record => ({
            ...record,
            amount: record.amount.toString()
        }))
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-950">Student Records</h2>
                    <p className="text-emerald-700/70 text-sm italic font-medium">Enterprise Management System • {session.user.name}</p>
                </div>
                <AddStudentModal schoolId={session.user.schoolId} classes={classes} />
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-emerald-600/50" />
                    <Input
                        placeholder="Filter by name or roll number..."
                        className="pl-8 border-emerald-100 focus-visible:ring-emerald-600 font-medium h-10 rounded-xl"
                    />
                </div>
            </div>

            <StudentTable students={students} />

            <div className="text-[10px] italic text-emerald-700/50 text-center font-bold uppercase tracking-widest">
                © 2026 AM Automation Studio • Operational Management Layer
            </div>
        </div>
    );
}
