const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const path = require("path");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json()); // To parse JSON data

app.get("/", (req, res) => {
    res.send("Employee Leave Management System is running!");
});

app.use("/auth", authRoutes);

app.use(express.static("public")); // Important to serve profile images
app.use("/profile", profileRoutes); // Add this line

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});