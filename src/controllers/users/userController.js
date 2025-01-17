const { Role, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserById = async (req, res) => {
    const { id } = req.params;

    if (req.user.role === Role.ADMIN) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: id },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ user });
        } catch (error) {
            console.error("Error getting user by ID:", error); // Menambahkan log error
            return res
                .status(500)
                .json({ message: "Server error", error: error.message }); // Menyertakan pesan error
        }
    }

    // Jika pengguna bukan admin, hanya bisa melihat data mereka sendiri
    if (req.user.userId !== id) {
        return res
            .status(403)
            .json({ message: "You can only access your own data" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error getting user by ID:", error); // Menambahkan log error
        return res
            .status(500)
            .json({ message: "Server error", error: error.message }); // Menyertakan pesan error
    }
};

module.exports = { getUserById };
