const jwt = require("jsonwebtoken");
const { Role } = require("@prisma/client");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const tokenWithoutBearer = token.split(" ")[1]; // Mengambil token setelah 'Bearer'
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data user di request

        // Log untuk memastikan token didekode dengan benar
        console.log("Decoded token:", decoded);

        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== Role.ADMIN) {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};

const isInstructor = (req, res, next) => {
    if (req.user.role !== Role.INSTRUCTOR) {
        return res.status(403).json({ message: "Instructor access only" });
    }
    next();
};

module.exports = { verifyToken, isAdmin, isInstructor };
