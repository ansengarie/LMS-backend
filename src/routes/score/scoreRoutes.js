const express = require("express");
const {
    getScores,
    addScore,
    getScoreById,
} = require("../../controllers/score/scoreController");
const router = express.Router();
const {
    verifyToken,
    isAdminOrInstructor,
} = require("../../middleware/authMiddleware");

router.get("/", verifyToken, isAdminOrInstructor, getScores);
router.get("/:id", verifyToken, isAdminOrInstructor, getScoreById);
router.post("/", verifyToken, isAdminOrInstructor, addScore);

module.exports = router;
