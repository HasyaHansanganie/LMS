const db = require("../db.js");

const applyLeave = (req, res) => {
    const {formData, userEmail} = req.body;

    const add = `INSERT INTO leaves (email, leave_type, leave_method, from_date, to_date, reason, status) VALUES(?,?,?,?,?,?,?)`;
    const VALUES = [userEmail, formData.leaveType, formData.leaveMethod, formData.fromDate, formData.toDate, formData.reason, "Pending" ];

    db.query(add, VALUES, (err) => {
        if (err) {
            res.status(500).json({ message: "Internal server error" });
            console.log(err);
            return;
        }
        console.log("Added the leave details succesfully.");
        res.status(200).json({ message: "Added the leave type details succesfully." });
    });

};

const getUserApprovedLeaves = (req, res) => {
    const email = req.params.userEmail;
    const query = "SELECT * FROM leaves WHERE email = ? AND status = ?";

    db.query(query, [email, "Approved"], (err, results) => {
        if (err) {
            console.error("Error fetching approved leaves:", err);
            return res.status(500).json({ message: "Failed to fetch approved leaves" });
        }
        res.status(200).json(results);
    });

};

const getUserLeaves = (req, res) => {
    const email = req.params.userEmail;
    const query = "SELECT * FROM leaves WHERE email = ? ORDER BY id DESC";

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Error fetching leaves:", err);
            return res.status(500).json({ message: "Failed to fetch leaves" });
        }

        res.status(200).json(results);
    });
};

const deleteLeave = (req, res) => {
    const leaveId = req.params.id;  // Get the department ID from the URL

    // SQL query to delete the department by ID
    const query = "DELETE FROM leaves WHERE id = ?";
    
    db.query(query, [leaveId], (err, results) => {
        if (err) {
            console.error("Error deleting leave:", err);
            return res.status(500).json({ message: "Failed to delete leave" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Leave not found" });
        }

        res.status(200).json({ message: "Leave deleted successfully" });
    });
};

const updateLeave = (req, res) => {
    const leaveId = req.params.leaveId;
    const {leaveType, leaveMethod, fromDate, toDate, reason} = req.body;

    const query = `
        UPDATE leaves SET 
            leave_type = ?, 
            leave_method = ?, 
            from_date = ?, 
            to_date = ?, 
            reason = ?
        WHERE id = ?
    `;

    const values = [leaveType, leaveMethod, fromDate, toDate, reason, leaveId];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating leave:", err);
            return res.status(500).json({ message: "Failed to update leave" });
        }

        res.status(200).json({ message: "Leave updated successfully" });
    });
};

const getUserPendingLeaves = (req, res) => {
    const email = req.params.userEmail;
    const query = "SELECT * FROM leaves WHERE email = ? AND status = ?";

    db.query(query, [email, "Pending"], (err, results) => {
        if (err) {
            console.error("Error fetching pending leaves:", err);
            return res.status(500).json({ message: "Failed to fetch pending leaves" });
        }
        res.status(200).json(results);
    });

};

const getApprovedLeaves = (req, res) => {
    const query = "SELECT * FROM leaves WHERE status = ?";

    db.query(query, ["Approved"], (err, results) => {
        if (err) {
            console.error("Error fetching approved leaves:", err);
            return res.status(500).json({ message: "Failed to fetch approved leaves" });
        }
        res.status(200).json(results);
    });

};

const getPendingLeaves = (req, res) => {
    const query = "SELECT * FROM leaves WHERE status = ? ORDER BY id DESC";

    db.query(query, ["Pending"], (err, results) => {
        if (err) {
            console.error("Error fetching pending leaves:", err);
            return res.status(500).json({ message: "Failed to fetch pending leaves" });
        }
        res.status(200).json(results);
    });

};

const approveLeave = (req, res) => {
    const leaveId = req.params.leaveId;
    const query = `UPDATE leaves SET status = 'Approved' WHERE id = ?`;

    db.query(query, [leaveId], (err, result) => {
        if (err) {
            console.error("Error approving leave:", err);
            return res.status(500).json({ message: "Failed to approve leave" });
        }

        res.status(200).json({ message: "Leave approved successfully" });
    });
};

const rejectLeave = (req, res) => {
    const leaveId = req.params.leaveId;
    const query = `UPDATE leaves SET status = 'Rejected' WHERE id = ?`;

    db.query(query, [leaveId], (err, result) => {
        if (err) {
            console.error("Error rejecting leave:", err);
            return res.status(500).json({ message: "Failed to reject leave" });
        }

        res.status(200).json({ message: "Leave rejected successfully" });
    });
};

const getLeaves = (req, res) => {
    const query = "SELECT * FROM leaves ORDER BY id DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching leaves:", err);
            return res.status(500).json({ message: "Failed to fetch leaves" });
        }

        res.status(200).json(results);
    });
};


module.exports = {applyLeave, getUserApprovedLeaves, getUserLeaves, deleteLeave, updateLeave, getUserPendingLeaves, getApprovedLeaves, getPendingLeaves, approveLeave, rejectLeave, getLeaves};