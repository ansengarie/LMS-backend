const express = require("express");
const {
    register,
    registerInstructor,
    login,
} = require("../../controllers/auth/authController");
const router = express.Router();

router.post("/register", register);
router.post("/register-instructor", registerInstructor);
router.post("/login", login);

module.exports = router;
