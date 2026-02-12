"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSchool(formData: {
    name: string;
    phone: string;
    address: string;
    maxClasses: number;
    maxStudents: number;
}) {
    try {
        const school = await prisma.school.create({
            data: {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                maxClasses: formData.maxClasses,
                maxStudents: formData.maxStudents,
            },
        });

        revalidatePath("/super-admin/schools");
        return { success: true, data: school };
    } catch (error) {
        console.error("Failed to create school:", error);
        return { success: false, error: "Failed to create school" };
    }
}

export async function updateSchoolStatus(id: string, isActive: boolean) {
    try {
        await prisma.school.update({
            where: { id },
            data: { isActive },
        });
        revalidatePath("/super-admin/schools");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update school" };
    }
}

export async function deleteSchool(id: string) {
    try {
        await prisma.school.delete({
            where: { id },
        });
        revalidatePath("/super-admin/schools");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete school" };
    }
}
