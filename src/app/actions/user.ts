"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createUser(formData: {
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "SCHOOL_ADMIN";
    schoolId?: string;
    password?: string;
}) {
    try {
        // Note: In a production app, you would hash the password here using bcrypt
        const user = await prisma.user.create({
            data: {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                schoolId: formData.schoolId || null,
                password: formData.password || "password123", // Default for dev
            },
        });

        revalidatePath("/super-admin/users");
        return { success: true, data: user };
    } catch (error: any) {
        console.error("Failed to create user:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "A user with this email already exists." };
        }
        return { success: false, error: "Failed to create user" };
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id },
        });
        revalidatePath("/super-admin/users");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete user" };
    }
}
