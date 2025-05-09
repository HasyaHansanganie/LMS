const db = require("../db.js");
const nodemailer = require("nodemailer"); // For sending emails
const bcrypt = require("bcrypt");

const firstTimeLogin = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const tempPassword = Math.random().toString(36).slice(-8); // example: "a8kz19bf"
    const saltRounds = 10;

    bcrypt.hash(tempPassword, saltRounds, (err, hash) => {
        if (err) return res.status(500).json({ message: "Error hashing password" });

        // Update password in DB
        const updatePasswordQuery = `UPDATE users SET password = ? WHERE email = ?`;
        db.query(updatePasswordQuery, [hash, email], (err, result) => {
            if (err) return res.status(500).json({ message: "Database update error" });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "webdevtesthhk@gmail.com",
                    // pass: "webDevTest@1998",
                    pass: "jphicnnxongplnly",
                },
            });

            // Now send the new password via email
            const mailOptions = {
                from: "webdevtesthhk@gmail.com",
                to: email,
                subject: "Your Temporary Password",
                text: `
                Hello,

                Thank you for reaching out.

                Here is your temporary password to log in:

                🔐 Password: ${tempPassword}

                Please make sure to change your password after logging in for better security.

                If you didn’t request this, please ignore this email or contact IT support immediately.

                Best regards,  
                Web Development Team  
                IT Support
                    `,

                html: `
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                    <p>Hello,</p>
                    <p>Thank you for reaching out.</p>
                    <p><strong>Here is your temporary password to log in:</strong></p>
                    <p style="font-size: 16px; font-weight: bold; background-color: #f3f3f3; padding: 8px 12px; border-radius: 5px; display: inline-block;">
                        🔐 ${tempPassword}
                    </p>
                    <p>Please make sure to change your password after logging in for better security.</p>
                    <p>If you didn’t request this, please ignore this email or contact IT support immediately.</p>
                    <br>
                    <p>Best regards,<br>Web Development Team<br>IT Support</p>
                </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error sending email:", error);
                    return res.status(500).json({ message: "Failed to send email" });
                }
                res.status(200).json({ message: "Temporary password sent to your email" });
            });
        });
    });

};

const login = (req, res) => {
    const { email, password } = req.body;

    const getUserDetails = `SELECT * FROM users WHERE email = ?`;
    db.query(getUserDetails, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: "Error comparing passwords" });
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            res.status(200).json({ message: "Login successful", role: user.role });
        });

    });
};

module.exports = { firstTimeLogin, login };