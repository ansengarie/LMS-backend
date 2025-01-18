const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const { PrismaClient } = require("@prisma/client");
const registerRoutes = require("./src/routes/index");

dotenv.config();

const app = express();
const prismaClient = new PrismaClient();

app.use(bodyParser.json());
// Gunakan cors middleware
app.use(cors());

registerRoutes(app);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to LMS Backend!" });
});

module.exports = { app, prismaClient };
