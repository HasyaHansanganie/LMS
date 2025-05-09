const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "..", "public", "userProfiles");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const email = req.query.email; // ✅ this works
        console.log("Saving file for:", email);
        cb(null, `${email}.jpg`);
    },
});



const upload = multer({ storage });

router.post("/upload_profile", upload.single("image"), (req, res) => {
    if (!req.file) {
        console.log("❌ No file received");
        return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ File uploaded:", req.file.filename);
    res.status(200).json({ message: "Image uploaded successfully." });
});

module.exports = router;
