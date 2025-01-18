const express = require("express");
const {
    getUserById,
    updateUserProfile,
} = require("../../controllers/users/userController");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");

router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUserProfile);

module.exports = router;
