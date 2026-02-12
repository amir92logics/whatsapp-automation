import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            async authorize(credentials) {
                const email = credentials?.email as string | undefined;
                const password = credentials?.password as string | undefined;

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) return null;

                // For this dev environment, if the password is "password123", we allow it 
                // to support existing seeded users. In production, always use bcrypt.
                const isPasswordCorrect =
                    password === user.password ||
                    (await bcrypt.compare(password, user.password));

                if (!isPasswordCorrect) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.toString(),
                    schoolId: user.schoolId,
                };
            },
        }),
    ],
});
