const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCourses = async (req, res) => {
    const { page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;

    try {
        const courses = await prisma.course.findMany({
            skip,
            take: parseInt(perPage),
            orderBy: { created_at: "desc" },
        });

        const totalCourses = await prisma.course.count();
        const totalPages = Math.ceil(totalCourses / perPage);

        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            data: courses,
            pagination: {
                total: totalCourses,
                per_page: perPage,
                current_page: page,
                total_pages: totalPages,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({ success: true, data: course });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const createCourse = async (req, res) => {
    const { title, description, status } = req.body;

    // Validasi status: hanya menerima nilai 'ACTIVE' atau 'INACTIVE'
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
        return res.status(400).json({
            message: "Invalid status. Must be 'ACTIVE' or 'INACTIVE'.",
        });
    }

    try {
        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                status,
                created_by: req.user.userId,
            },
        });
        return res
            .status(201)
            .json({ message: "Course created successfully", data: newCourse });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const course = await prisma.course.findUnique({ where: { id } });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (
            req.user.role !== "ADMIN" &&
            req.user.created_by !== course.instructorId
        ) {
            return res.status(403).json({
                message: "You are not authorized to update this course",
            });
        }

        const updatedCourse = await prisma.course.update({
            where: { id },
            data: { title, description, status },
        });

        return res.status(200).json({
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await prisma.course.findUnique({ where: { id } });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (
            req.user.role !== "ADMIN" &&
            req.user.created_by !== course.instructorId
        ) {
            return res.status(403).json({
                message: "You are not authorized to update this course",
            });
        }

        await prisma.course.delete({ where: { id } });
        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
