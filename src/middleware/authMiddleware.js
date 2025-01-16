const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data user di request
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};

const isInstructor = (req, res, next) => {
    if (req.user.role !== "instructor") {
        return res.status(403).json({ message: "Instructor access only" });
    }
    next();
};


module.exports = { verifyToken, isAdmin, isInstructor };
