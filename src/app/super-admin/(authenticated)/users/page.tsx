import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Shield, MoreHorizontal } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getUsers, getSchoolsForSelection } from "@/lib/db";
import { AddUserModal } from "@/components/schools/add-user-modal";
import { UserActions } from "@/components/schools/user-actions";

export default async function SuperAdminUsersPage() {
    const [users, schools] = await Promise.all([
        getUsers(),
        getSchoolsForSelection()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-950">Platform Users</h2>
                    <p className="text-emerald-700/70 text-sm italic">Manage administrative access across the platform.</p>
                </div>
                <AddUserModal schools={schools} />
            </div>

            <div className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50">
                            <TableHead className="font-bold text-emerald-900 border-none">Name</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Email</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Role</TableHead>
                            <TableHead className="font-bold text-emerald-900 border-none">Affiliation</TableHead>
                            <TableHead className="text-right font-bold text-emerald-900 border-none">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-emerald-800 italic">
                                    No administrative users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-emerald-50/30 transition-colors">
                                    <TableCell className="font-medium text-emerald-950">{user.name}</TableCell>
                                    <TableCell className="text-emerald-700 text-sm">{user.email}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.role === 'SUPER_ADMIN' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            }`}>
                                            {user.role === 'SUPER_ADMIN' ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-emerald-800">
                                        {user.school?.name || "Platform Central"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserActions userId={user.id} />
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
