const authRoutes = require("./auth/authRoutes");
const adminRoutes = require("./admin/adminRoutes");
const userRoutes = require("./user/userRoutes");

const registerRoutes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/users", userRoutes);
};

module.exports = registerRoutes;
