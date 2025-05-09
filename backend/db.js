const { response } = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
    host: "localhost",
    user: "YOUR_USER_NAME",
    password: "YOUR_PASSWORD",
    dateStrings: true
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL");

    db.query(`CREATE DATABASE IF NOT EXISTS employee_leave_system`, (err) => {
        if (err) {
            console.error("Error creating database: ", err);
            return;
        }
        console.log("Database checked/created successfully");

        db.changeUser({ database: "employee_leave_system" }, (err) => {
            if (err) {
                console.error("Error switching database: ", err);
                return;
            }
            createTables();
        });
    });
});

const createTables = () => {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255),
            employee_id VARCHAR(255) UNIQUE,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            role VARCHAR(255),
            department VARCHAR(255),
            date_of_join DATE,
            mobile_number VARCHAR(15),   
            gender VARCHAR(255),  
            date_of_birth DATE,
            address VARCHAR(255)
        );
    `;
    db.query(createUsersTable, (err) => {
        if (err) {
            console.error("Error creating HR table: ", err);
            return;
        }
        console.log("Users table checked/created successfully");
        insertDefaultHR();
    });

    const createDepartmentsTable = `
        CREATE TABLE IF NOT EXISTS departments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            dep_name VARCHAR(255) NOT NULL UNIQUE,
            short_name VARCHAR(255),
            code VARCHAR(255)
        );
    `;
    db.query(createDepartmentsTable, (err) => {
        if (err) {
            console.error("Error creating Departments table: ", err);
            return;
        }
        console.log("Departments table checked/created successfully");
    });

    const createLeaveTypesTable = `
        CREATE TABLE IF NOT EXISTS leavetypes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            leave_type VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            leave_count INT
        );
    `;
    db.query(createLeaveTypesTable, (err) => {
        if (err) {
            console.error("Error creating Leave Types table: ", err);
            return;
        }
        console.log("Leave Types table checked/created successfully");
    });

    const createLeavesTable = `
        CREATE TABLE IF NOT EXISTS leaves (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255),
            leave_type VARCHAR(255),
            leave_method VARCHAR(255),
            from_date DATE,
            to_date DATE,
            reason VARCHAR(255),
            status VARCHAR(255),
            applied_date DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.query(createLeavesTable, (err) => {
        if (err) {
            console.error("Error creating Leaves table: ", err);
            return;
        }
        console.log("Leaves table checked/created successfully");
    });

    const createNotificationTable = `
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            isRead BOOLEAN DEFAULT FALSE,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.query(createNotificationTable, (err) => {
        if (err) {
            console.error("Error creating notifications table: ", err);
            return;
        }
        console.log("Notifications table checked/created successfully");
    });

};

const insertDefaultHR = () => {
    const email = "admin@gmail.com"; // Default HR Email
    const password = "admin@1234"; // Default Temporary Password
    const role = "Admin";
    const saltRounds = 10; // Strength of hashing

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password: ", err);
            return;
        }

        const getDefaultHRDetails = `SELECT * FROM users WHERE email = ?`;
        db.query(getDefaultHRDetails, [email], (err, results) => {
            if (err) {
                console.error("Error checking HR record: ", err);
                return;
            }
            if (results.length === 0) {
                const insertdefaultHRDetails = `INSERT INTO users (email, password, role) VALUES (?,?,?)`;
                db.query(insertdefaultHRDetails, [email, hashedPassword, role], (err) => {
                    if (err) {
                        console.error("Error inserting default HR: ", err);
                        return;
                    }
                    console.log("Default HR account created with temporary password.");
                });
            } else {
                console.log("HR admin already exists.");
            }
        });
    });
};

// Export connection to use in other files
module.exports = db;