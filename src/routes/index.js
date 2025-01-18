const authRoutes = require("./auth/authRoutes");
const adminRoutes = require("./admin/adminRoutes");
const userRoutes = require("./user/userRoutes");
const coursesRoutes = require("./course/courseRoutes");
const sessionsRoutes = require("./session/sessionRoutes");
const scoreRoutes = require("./score/scoreRoutes");
const messageRoutes = require("./message/messageRoutes");

const registerRoutes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/courses", coursesRoutes);
    app.use("/api/sessions", sessionsRoutes);
    app.use("/api/scores", scoreRoutes);
    app.use("/api/messages", messageRoutes);
};

module.exports = registerRoutes;
