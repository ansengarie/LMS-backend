const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const seedAdmin = async () => {
    try {
        const email = "admin@gmail.com";
        const password = "admin123";

        // Periksa apakah admin sudah ada
        const existingAdmin = await prisma.user.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            console.log("Admin already exists. Skipping seeding...");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat admin baru
        await prisma.user.create({
            data: {
                name: "Admin",
                email,
                password: hashedPassword,
                role: Role.ADMIN, // Role admin
            },
        });

        console.log("Admin seeding completed successfully!");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
};

seedAdmin();
