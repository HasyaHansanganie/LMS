const db = require("../db.js");
const bcrypt = require("bcrypt");

const addLeaveType = (req, res) => {
    const { leaveType, description, leaveCount } = req.body;

    const add = `INSERT INTO leavetypes (leave_type, description, leave_count) VALUES (?,?,?)`;

    db.query(add, [leaveType, description, leaveCount], (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {  // MySQL duplicate entry error
                res.status(400).json({ message: "Leave Type already exists" });
            } else {
                res.status(500).json({ message: "Internal server error" });
                console.log(err);
            }
            return;
        }
        console.log("Added the leave type details succesfully.");
        res.status(200).json({ message: "Added the leave type details succesfully." });
    });

};

const getLeaveTypes = (req, res) => {
    const query = "SELECT * FROM leavetypes ORDER BY id ASC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching leave types:", err);
            return res.status(500).json({ message: "Failed to fetch leave types" });
        }

        res.status(200).json(results);
    });
};

const deleteLeaveType = (req, res) => {
    const leaveTypeId = req.params.id;  // Get the leave type ID from the URL

    // SQL query to delete the department by ID
    const query = "DELETE FROM leavetypes WHERE id = ?";
    
    db.query(query, [leaveTypeId], (err, results) => {
        if (err) {
            console.error("Error deleting leave type:", err);
            return res.status(500).json({ message: "Failed to delete leave type" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Leave type not found" });
        }

        res.status(200).json({ message: "Leave type deleted successfully" });
    });
};

const updateLeaveType = (req, res) => {
    const { leaveType, description, leaveCount } = req.body;
    const leaveTypeId = req.params.id;

    const query = `
        UPDATE leavetypes
        SET leave_type = ?, description = ?, leave_count =?
        WHERE id = ?`;

    db.query(query, [leaveType, description, leaveCount, leaveTypeId], (err, results) => {
        if (err) {
            console.error("Error updating leave type:", err);
            return res.status(500).json({ message: "Failed to update leave type" });
        }
        res.status(200).json({ message: "Leave type updated successfully", data: results });
    });
};

module.exports = { addLeaveType, getLeaveTypes, deleteLeaveType, updateLeaveType};