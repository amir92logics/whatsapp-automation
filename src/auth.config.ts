import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/", // Set root as the default sign-in page
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.schoolId = user.schoolId;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token.role) {
                session.user.role = token.role;
                session.user.schoolId = token.schoolId;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const pathname = nextUrl.pathname;

            // Protected route groups
            const isSchoolAdminRoute =
                pathname.startsWith("/dashboard") ||
                pathname.startsWith("/students") ||
                pathname.startsWith("/classes") ||
                pathname.startsWith("/fees") ||
                pathname.startsWith("/settings") ||
                pathname.startsWith("/users") && !pathname.startsWith("/super-admin/users");

            const isSuperAdminRoute = pathname.startsWith("/super-admin") && pathname !== "/super-admin/login";

            if (isSchoolAdminRoute || isSuperAdminRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page (which is /)
            } else if (isLoggedIn && (pathname === "/" || pathname === "/super-admin/login")) {
                // If logged in and on a login page, redirect to appropriate home
                const role = (auth.user as any).role;
                if (role === "SUPER_ADMIN") {
                    return Response.redirect(new URL("/super-admin/dashboard", nextUrl));
                }
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
    providers: [], // Providers will be added in auth.ts
} satisfies NextAuthConfig;
