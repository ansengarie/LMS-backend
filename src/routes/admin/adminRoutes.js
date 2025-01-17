const express = require("express");
const { getAllUsers } = require("../../controllers/admin/adminController");
const { verifyToken, isAdmin } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/users", verifyToken, isAdmin, getAllUsers);

module.exports = router;
