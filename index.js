const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const { PrismaClient } = require("@prisma/client");
const registerRoutes = require("./src/routes/index");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/openapi.json");

dotenv.config();

const app = express();
const prismaClient = new PrismaClient();

app.use(bodyParser.json());
// Gunakan cors middleware
app.use(cors());
// Middleware Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

registerRoutes(app);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to LMS Backend!" });
});

module.exports = { app, prismaClient };
