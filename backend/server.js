const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
const studentRoutes = require("./routes/student.js");
const router = require("./routes/routes.js");

require("dotenv").config();
const connectToMongo = require("./db.js");
connectToMongo();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// Routes
app.use("/", router); 
app.use("/auth", authRoutes);
app.use("/student", studentRoutes);

// Start server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server started at http://localhost:${port}`);
}).on("error", (err) => {
    console.error("Error starting server:", err);
});
