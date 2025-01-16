const authRoutes = require("./auth/authRoutes");

const registerRoutes = (app) => {
    app.use("/api/auth", authRoutes);
};

module.exports = registerRoutes;
