const db = require("../db.js");
const bcrypt = require("bcrypt");

const addNotification = (req, res) => {
    const { email, message } = req.body;

    const add = `INSERT INTO notifications (email, message) VALUES (?,?)`;

    db.query(add, [email, message], (err) => {
        if (err) {
            res.status(500).json({ message: "Internal server error" });
            console.log(err);
            return;
        }
        console.log("Added the notification details succesfully.");
        res.status(200).json({ message: "Added the notification details succesfully." });
    });

};

const getNotifications = (req, res) => {
    const email = req.params.userEmail;
    const query = "SELECT * FROM notifications WHERE email = ? AND isRead = ? ORDER BY id DESC";

    db.query(query, [email, 0], (err, results) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json({ message: "Failed to fetch notifications" });
        }
        res.status(200).json(results);
    });

};

const markRead = (req, res) => {
    const notId = req.params.id;

    const query = `
        UPDATE notifications SET 
            isRead = ?
        WHERE id = ?
    `;

    db.query(query, [1, notId], (err, result) => {
        if (err) {
            console.error("Error updating notification:", err);
            return res.status(500).json({ message: "Failed to update notification" });
        }

        res.status(200).json({ message: "Notification updated successfully" });
    });
};

module.exports = { addNotification, getNotifications, markRead};