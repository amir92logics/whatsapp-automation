import { PrismaClient } from "../src/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding AM Automation Studio...");

    // 1. Create Super Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@am-studio.com" },
        update: {
            password: "password123",
        },
        create: {
            email: "admin@am-studio.com",
            name: "Super Admin",
            password: "password123", // Default dev password
            role: "SUPER_ADMIN",
        },
    });

    // 2. Create a Sample School
    const school = await prisma.school.upsert({
        where: { id: "school-1" },
        update: {},
        create: {
            id: "school-1",
            name: "Greenwood High School",
            phone: "+923001234567",
            maxClasses: 15,
            maxStudents: 500,
        },
    });

    // 3. Create a School Admin
    await prisma.user.upsert({
        where: { email: "admin@greenwood.com" },
        update: {
            password: "password123",
        },
        create: {
            email: "admin@greenwood.com",
            name: "John Doe",
            password: "password123", // Default dev password
            role: "SCHOOL_ADMIN",
            schoolId: school.id,
        },
    });

    // 4. Create Sample Classes
    const classA = await prisma.class.upsert({
        where: { name_section_schoolId: { name: "Grade 10", section: "A", schoolId: school.id } },
        update: {},
        create: {
            name: "Grade 10",
            section: "A",
            schoolId: school.id,
        },
    });

    // 5. Create Sample Students
    await prisma.student.upsert({
        where: { rollNo_schoolId: { rollNo: "1001", schoolId: school.id } },
        update: {},
        create: {
            name: "Alice Johnson",
            rollNo: "1001",
            grade: "10",
            schoolId: school.id,
            classId: classA.id,
            parentPhone: "923001234567",
        },
    });

    console.log("✅ Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
