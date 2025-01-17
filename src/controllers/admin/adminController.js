const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Halaman default 1
    const limit = parseInt(req.query.limit) || 10; // Limit default 10 per halaman
    const offset = (page - 1) * limit; // Hitung offset untuk paginasi

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profile_picture: true,
                created_at: true,
                updated_at: true,
            },
            skip: offset,
            take: limit,
        });

        const totalUsers = await prisma.user.count(); // Hitung total users

        // Menghitung total halaman
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
            pagination: {
                total: totalUsers,
                per_page: limit,
                current_page: page,
                total_pages: totalPages,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getAllUsers };
