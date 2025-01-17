const express = require("express");
const { getUserById } = require("../../controllers/users/userController");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");

router.get("/:id", verifyToken, getUserById);

module.exports = router;
