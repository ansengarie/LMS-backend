const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set default role to "student" if no role is provided
        const userRole = role ? Role[role.toUpperCase()] : Role.STUDENT; // Default to "student"

        // Create new user
        const user = await prisma.user.create({
            data: {
                name, // Correct field name
                email,
                password: hashedPassword,
                role: userRole, // Set the role
            },
        });

        return res
            .status(201)
            .json({ message: "User registered successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const registerInstructor = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with role "instructor"
        const instructor = await prisma.user.create({
            data: {
                name, // Correct field name
                email,
                password: hashedPassword,
                role: Role.INSTRUCTOR, // Force role to "instructor"
            },
        });

        return res.status(201).json({
            message: "Instructor registered successfully",
            instructor,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cari pengguna berdasarkan email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Buat JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Kirimkan token dan data user
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_picture: user.profile_picture,
            },
        });
    } catch (error) {
        console.error("Login error:", error); // Log error ke console
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
};

module.exports = { register, registerInstructor, login };
