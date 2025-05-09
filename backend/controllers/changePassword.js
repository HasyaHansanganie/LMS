const db = require("../db.js");
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {

    const { userEmail, newPassword } = req.body;

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
        db.query(updateQuery, [hashedPassword, userEmail], (err, result) => {
            if (err) {
                console.error("Error updating password:", err);
                return res.status(500).json({ message: "Failed to update password." });
            }

            return res.status(200).json({ message: "Password updated successfully." });
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        return res.status(500).json({ message: "Server error." });
    }

};

module.exports = { changePassword };