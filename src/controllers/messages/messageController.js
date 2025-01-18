const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendMessage = async (req, res) => {
    const { receiver_id, content } = req.body;

    // Validasi input
    if (!receiver_id || !content) {
        return res
            .status(400)
            .json({ message: "Receiver ID and content are required" });
    }

    // Validasi apakah receiver_id adalah user yang valid
    const receiver = await prisma.user.findUnique({
        where: { id: receiver_id },
    });
    if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
    }

    try {
        console.log("User from token:", req.user);

        // Pastikan req.user.id sudah ada di middleware (user yang login)
        const sender_id = req.user.userId;

        // Simpan pesan ke dalam database
        const message = await prisma.message.create({
            data: {
                sender_id, // Pastikan sender_id ada di sini
                receiver_id,
                content,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message,
        });
    } catch (error) {
        console.error("Error sending message: ", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            where: { receiver_id: req.user.id }, // Ambil pesan yang diterima user
            orderBy: { created_at: "desc" },
        });

        return res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: messages,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    getMessages,
    sendMessage,
};
