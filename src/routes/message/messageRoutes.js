const express = require("express");
const {
    getMessages,
    sendMessage,
} = require("../../controllers/messages/messageController");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");

router.get("/", verifyToken, getMessages);
router.post("/", verifyToken, sendMessage);

module.exports = router;
