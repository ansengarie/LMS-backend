const express = require("express");

const {
    getSessionsByCourse,
    createSession,
    getSessionById,
    updateSession,
    deleteSession,
} = require("../../controllers/sessions/sessionController");
const router = express.Router();
const {
    verifyToken,
    isAdminOrInstructor,
} = require("../../middleware/authMiddleware");

router.get("/", verifyToken, getSessionsByCourse);
router.get("/:id", verifyToken, getSessionById);
router.post("/", verifyToken, isAdminOrInstructor, createSession);
router.put("/:id", verifyToken, isAdminOrInstructor, updateSession);
router.delete("/:id", verifyToken, isAdminOrInstructor, deleteSession);

module.exports = router;
