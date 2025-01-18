const express = require("express");
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
} = require("../../controllers/courses/courseController");
const router = express.Router();
const {
    verifyToken,
    isAdminOrInstructor,
} = require("../../middleware/authMiddleware");

// router.get("/:id", verifyToken, getUserById);
// Daftar semua course
router.get("/", verifyToken, getCourses);

// Detail course tertentu
router.get("/:id", verifyToken, getCourseById);

// Membuat course baru
router.post("/", verifyToken, isAdminOrInstructor, createCourse);

// Memperbarui course tertentu
router.put("/:id", verifyToken, isAdminOrInstructor, updateCourse);

// Menghapus course tertentu
router.delete("/:id", verifyToken, isAdminOrInstructor, deleteCourse);

module.exports = router;
