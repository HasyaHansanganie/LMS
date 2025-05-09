const db = require("../db.js");
const bcrypt = require("bcrypt");

const addDepartment = (req, res) => {
    const { depName, depShortName, depCode } = req.body;

    const add = `INSERT INTO departments (dep_name, short_name, code) VALUES (?,?,?)`;

    db.query(add, [depName, depShortName, depCode], (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {  // MySQL duplicate entry error
                res.status(400).json({ message: "Department already exists" });
            } else {
                res.status(500).json({ message: "Internal server error" });
                console.log(err);
            }
            return;
        }
        console.log("Added the department details succesfully.");
        res.status(200).json({ message: "Added the department details succesfully." });
    });

};

const getDepartments = (req, res) => {
    const query = "SELECT * FROM departments ORDER BY id DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching departments:", err);
            return res.status(500).json({ message: "Failed to fetch departments" });
        }

        res.status(200).json(results);
    });
};

const deleteDepartment = (req, res) => {
    const deptId = req.params.id;  // Get the department ID from the URL

    // SQL query to delete the department by ID
    const query = "DELETE FROM departments WHERE id = ?";
    
    db.query(query, [deptId], (err, results) => {
        if (err) {
            console.error("Error deleting department:", err);
            return res.status(500).json({ message: "Failed to delete department" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Department deleted successfully" });
    });
};

const updateDepartment = (req, res) => {
    const { depName, depShortName, depCode } = req.body;
    const departmentId = req.params.id;

    const query = `
        UPDATE departments
        SET dep_name = ?, short_name = ?, code = ?
        WHERE id = ?`;

    db.query(query, [depName, depShortName, depCode, departmentId], (err, results) => {
        if (err) {
            console.error("Error updating department:", err);
            return res.status(500).json({ message: "Failed to update department" });
        }
        res.status(200).json({ message: "Department updated successfully", data: results });
    });
};

module.exports = { addDepartment, getDepartments, deleteDepartment, updateDepartment};