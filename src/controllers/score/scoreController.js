const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getScores = async (req, res) => {
    const { course_id } = req.query;

    // Validasi input
    if (!course_id) {
        return res.status(400).json({ message: "Course ID is required" });
    }

    try {
        // Periksa apakah kursus ada
        const courseExists = await prisma.course.findUnique({
            where: { id: course_id },
        });
        if (!courseExists) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Ambil daftar skor
        const scores = await prisma.score.findMany({
            where: { course_id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: "Scores retrieved successfully",
            data: scores,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const getScoreById = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari skor berdasarkan ID
        const score = await prisma.score.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        if (!score) {
            return res.status(404).json({ message: "Score not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Score retrieved successfully",
            data: score,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const addScore = async (req, res) => {
    const { user_id, course_id, points } = req.body;

    // Validasi input
    if (!user_id || !course_id || typeof points !== "number") {
        return res
            .status(400)
            .json({ message: "User ID, Course ID, and points are required" });
    }

    try {
        // Periksa apakah kursus ada
        const courseExists = await prisma.course.findUnique({
            where: { id: course_id },
        });
        if (!courseExists) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Periksa apakah user ada
        const userExists = await prisma.user.findUnique({
            where: { id: user_id },
        });
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Tambahkan skor
        const score = await prisma.score.create({
            data: {
                user_id,
                course_id,
                points,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Score added successfully",
            data: score,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getScores, getScoreById, addScore };
