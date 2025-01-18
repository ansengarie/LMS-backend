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

const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { name, email, profile_picture } = req.body;

    // Cek apakah admin yang mengakses atau user yang bersangkutan
    if (req.user.role === Role.ADMIN || req.user.id === id) {
        try {
            // Validasi data email jika ada perubahan
            if (email) {
                const emailExists = await prisma.user.findUnique({
                    where: { email },
                });
                if (emailExists) {
                    return res
                        .status(400)
                        .json({ message: "Email already in use" });
                }
            }

            // Update data pengguna
            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    name,
                    email,
                    profile_picture,
                },
            });

            return res.status(200).json({
                message: "User profile updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    } else {
        return res.status(403).json({
            message: "You do not have permission to update this profile",
        });
    }
};

module.exports = { getUserById, updateUserProfile };
