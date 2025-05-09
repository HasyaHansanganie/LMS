const db = require("../db.js");
const bcrypt = require("bcrypt");

const addEmployee = (req, res) => {
    const {
        employeeCode, startDate, firstName, lastName, email, gender, birthday, department, address, role, mobile
    } = req.body;

    const add = `
            INSERT INTO users 
            (employee_id, date_of_join, first_name, last_name, email, gender, date_of_birth, department, password, address, role, mobile_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
        employeeCode, startDate, firstName, lastName, email, gender, birthday, department, "password", address, role, mobile
    ];

    db.query(add, values, (err) => {

        if (err) {
            console.error("Database error:", err); // log full error
            if (err.code === "ER_DUP_ENTRY") {
                res.status(400).json({ message: "Employee already exists" });
            } else {
                res.status(500).json({ message: err.message }); // return actual error message
            }
            return;
        }
        res.status(200).json({ message: "Added the employee details succesfully." });
    });
};

const getEmployees = (req, res) => {
    const query = "SELECT * FROM users WHERE role != 'Admin' ORDER BY id DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching employees:", err);
            return res.status(500).json({ message: "Failed to fetch employees" });
        }

        res.status(200).json(results);
    });
};

const getEmployee = (req, res) => {
    const email = req.params.userEmail;

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Error fetching employee:", err);
            return res.status(500).json({ message: "Failed to fetch employee" });
        }
        res.status(200).json(results);
    });
};

const deleteEmployee = (req, res) => {
    const empId = req.params.id;  // Get the employee ID from the URL

    // SQL query to delete the department by ID
    const query = "DELETE FROM users WHERE id = ?";
    
    db.query(query, [empId], (err, results) => {
        if (err) {
            console.error("Error deleting employee:", err);
            return res.status(500).json({ message: "Failed to delete employee" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee deleted successfully" });
    });
};

const updateEmployee = (req, res) => {
    const empId = req.params.empId;
    const {
        employeeCode, startDate, firstName, lastName, email, gender,
        birthday, department, address, role, mobile
    } = req.body;

    const query = `
        UPDATE users SET 
            employee_id = ?, 
            date_of_join = ?, 
            first_name = ?, 
            last_name = ?, 
            email = ?,
            gender = ?, 
            date_of_birth = ?, 
            department = ?, 
            address = ?, 
            role = ?, 
            mobile_number = ?
        WHERE id = ?
    `;

    const values = [
        employeeCode, startDate, firstName, lastName, email, gender, birthday, department, address, role, mobile, empId
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating employee:", err);
            return res.status(500).json({ message: "Failed to update employee" });
        }

        res.status(200).json({ message: "Employee updated successfully" });
    });
};


module.exports = { addEmployee, getEmployees, getEmployee, deleteEmployee, updateEmployee};