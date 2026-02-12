import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, School, Settings, MoreVertical } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getSchools } from "@/lib/db";
import { School as SchoolType } from "@prisma/client";
import { AddSchoolModal } from "@/components/schools/add-school-modal";
import { SchoolActions } from "@/components/schools/school-actions";

export default async function SuperAdminSchoolsPage() {
    const schools: SchoolType[] = await getSchools();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-950">Registered Schools</h2>
                    <p className="text-emerald-700/70 text-sm italic">AM Automation Studio Platform Management</p>
                </div>
                <AddSchoolModal />
            </div>

            <div className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50">
                            <TableHead className="font-bold text-emerald-900 border-none">School Name</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">System ID</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Status</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Plan Limits</TableHead>
                            <TableHead className="text-right font-bold text-emerald-900 border-none">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-emerald-800 italic">
                                    No schools registered yet. Start by adding your first institution.
                                </TableCell>
                            </TableRow>
                        ) : (
                            schools.map((school) => (
                                <TableRow key={school.id} className="hover:bg-emerald-50/30 transition-colors">
                                    <TableCell className="font-medium flex items-center gap-2 text-emerald-950">
                                        <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <School className="w-4 h-4" />
                                        </div>
                                        {school.name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-emerald-700">{school.id}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${school.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                                            }`}>
                                            {school.isActive ? 'ACTIVE' : 'DISABLED'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-emerald-800 font-medium">
                                        {school.maxClasses} Cls / {school.maxStudents} Std
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <SchoolActions schoolId={school.id} isActive={school.isActive} />
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
