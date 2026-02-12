import { prisma } from "@/lib/prisma";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    SCHOOL_ADMIN = "SCHOOL_ADMIN",
}

export async function getSchools() {
    return await prisma.school.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getSchoolsForSelection() {
    return await prisma.school.findMany({
        select: { id: true, name: true },
        where: { isActive: true },
    });
}

export async function getUsers() {
    return await prisma.user.findMany({
        include: { school: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getSchoolById(id: string) {
    return await prisma.school.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    classes: true,
                    students: true,
                },
            },
        },
    });
}

export async function getStudentsBySchool(schoolId: string) {
    return await prisma.student.findMany({
        where: { schoolId },
        include: {
            class: true,
            school: true,
            feeRecords: {
                orderBy: { dueDate: "desc" },
                take: 1,
            },
        },
    });
}

export async function getClassesBySchool(schoolId: string) {
    return await prisma.class.findMany({
        where: { schoolId },
        include: {
            _count: {
                select: { students: true },
            },
        },
    });
}

export async function getDashboardStats(schoolId: string) {
    const [studentCount, classCount, pendingFees] = await Promise.all([
        prisma.student.count({ where: { schoolId } }),
        prisma.class.count({ where: { schoolId } }),
        prisma.feeRecord.count({
            where: {
                student: { schoolId },
                status: { in: ["PENDING", "OVERDUE", "PARTIAL"] }
            }
        }),
    ]);

    return {
        studentCount,
        classCount,
        pendingFees,
    };
}

export async function getCollectionStats(schoolId: string) {
    const [totalPending, totalCollected] = await Promise.all([
        prisma.feeRecord.count({
            where: {
                student: { schoolId },
                status: { in: ["PENDING", "OVERDUE", "PARTIAL"] }
            }
        }),
        prisma.feeRecord.aggregate({
            where: {
                student: { schoolId },
                status: "PAID"
            },
            _sum: {
                amount: true
            }
        })
    ]);

    return {
        pendingVouchers: totalPending,
        totalCollection: totalCollected._sum.amount || 0,
    };
}

export async function getGlobalStats() {
    const [schoolCount, studentCount, adminCount, globalCollection] = await Promise.all([
        prisma.school.count(),
        prisma.student.count(),
        prisma.user.count({ where: { role: "SCHOOL_ADMIN" } }),
        prisma.feeRecord.aggregate({
            where: { status: "PAID" },
            _sum: { amount: true }
        })
    ]);

    return {
        schoolCount,
        studentCount,
        adminCount,
        globalCollection: globalCollection._sum.amount || 0,
    };
}

export async function getRecentSchools(limit = 5) {
    return await prisma.school.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
            _count: {
                select: { students: true }
            }
        }
    });
}

export async function getAutomationStats() {
    const paymentSuccessCount = await (prisma as any).paymentLog.count({ where: { status: "SUCCESS" } });

    return {
        paymentSuccessCount,
    };
}


export async function getRecentPaymentLogs(limit = 10) {
    return await (prisma as any).paymentLog.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}
