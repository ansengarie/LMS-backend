const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSessionsByCourse = async (req, res) => {
    const { course_id } = req.query;

    if (!course_id) {
        return res.status(400).json({ message: "Course ID is required" });
    }

    try {
        const sessions = await prisma.session.findMany({
            where: { course_id },
            orderBy: { created_at: "asc" }, // Urutkan berdasarkan waktu pembuatan
        });

        if (sessions.length === 0) {
            return res
                .status(404)
                .json({ message: "No sessions found for this course" });
        }

        return res.status(200).json({
            success: true,
            message: "Sessions retrieved successfully",
            data: sessions,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const getSessionById = async (req, res) => {
    const { id } = req.params;

    try {
        const session = await prisma.session.findUnique({
            where: { id },
            include: { course: true }, // Sertakan informasi course terkait
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Session retrieved successfully",
            data: session,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const createSession = async (req, res) => {
    const { course_id, title, description } = req.body;

    if (!course_id || !title) {
        return res
            .status(400)
            .json({ message: "Course ID and Title are required" });
    }

    try {
        const session = await prisma.session.create({
            data: {
                course_id,
                title,
                description,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Session created successfully",
            data: session,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const updateSession = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const session = await prisma.session.update({
            where: { id },
            data: {
                title,
                description,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Session updated successfully",
            data: session,
        });
    } catch (error) {
        if (error.code === "P2025") {
            // Error jika session tidak ditemukan
            return res.status(404).json({ message: "Session not found" });
        }
        return res.status(500).json({ message: "Server error", error });
    }
};

const deleteSession = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.session.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Session deleted successfully",
        });
    } catch (error) {
        if (error.code === "P2025") {
            // Error jika session tidak ditemukan
            return res.status(404).json({ message: "Session not found" });
        }
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    getSessionsByCourse,
    createSession,
    getSessionById,
    updateSession,
    deleteSession,
};
