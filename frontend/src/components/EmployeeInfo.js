import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import bcrypt from 'bcryptjs';

const EmployeeInfo = ({ empId, empData, isEditMode, source }) => {

    const initialFormData = {
        employeeCode: "", startDate: "", firstName: "", lastName: "", email: "",
        gender: "", birthday: "", department: "", address: "", role: "", mobile: ""
    };

    delete empData.empId;

    const [formData, setFormData] = useState({ empData });
    const [departments, setDepartments] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [editMode, setEditMode] = useState(isEditMode);

    useEffect(() => {
        delete empData.empId;
        setEditMode(isEditMode);
        setFormData(empData);
    }, [empData, isEditMode]);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/get_departments")
            .then(res => setDepartments(res.data))
            .catch(err => console.error("Error fetching departments:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.post(`http://localhost:5000/auth/update_employee/${empId}`, formData);
                setMessage("Employee updated successfully");
                setEditMode(false);
            } else {
                await axios.post("http://localhost:5000/auth/add_employee", formData);
                setMessage("Employee added successfully");
            }
            setMessageType("success");
            setFormData(initialFormData);

        } catch (error) {
            if (error.response) {
                console.log("Error Response:", error.response.data);
                setMessage(error.response.data.message); // Show actual backend error
            } else {
                console.log("Error:", error.message);
                setMessage("An error occurred");
            }
            setMessageType("error");
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000); // hide after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [message]);


    return (
        <div className="ps-3">
            <Header filePath={
                source === "EmployeePage" ? "Employee /" : "Admin / Employees /"}
                pageName={source === "EmployeePage" ? "My profile" : editMode ? "Update Employee" : "Add Employee"}
                userEmail={empData.email}
            />
            <div className="position-relative">
                <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                    {source === "EmployeePage" ? "My Profile" : editMode ? "Update Employee" : "Add Employee"}
                </h3>
                {/* Conditional alert message shown at top-right corner */}
            {message && (
                    <div
                        className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} fade show position-absolute top-0 end-0 mt-3 me-3 shadow`}
                        role="alert"
                        style={{ zIndex: 1050, width: "fit-content", maxWidth: "80%" }}
                    >
                        {message}
                    </div>
                )}
            </div>

            


            <div className="p-4 shadow-lg mt-4">
                <form onSubmit={handleSubmit} className="text-secondary">
                    <div className="row">

                        {/* Left Column */}
                        <div className="col-md-6">

                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="empCode" placeholder="Employee Code" disabled={source === "EmployeePage"}
                                    name="employeeCode" value={formData.employeeCode} onChange={handleChange} required />
                                <label htmlFor="employeeCode">Employee Code</label>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="firstName" placeholder="First Name"
                                            name="firstName" value={formData.firstName} onChange={handleChange} />
                                        <label htmlFor="firstName">First Name</label>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="lastName" placeholder="Last Name"
                                            name="lastName" value={formData.lastName} onChange={handleChange} />
                                        <label htmlFor="lastName">Last Name</label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" placeholder="Email" disabled={source === "EmployeePage"}
                                    name="email" value={formData.email} onChange={handleChange} required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="address" placeholder="Address"
                                    name="address" value={formData.address} onChange={handleChange} />
                                <label htmlFor="address">Address</label>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-md-6">

                            <div className="row">
                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="role" placeholder="Job Title"
                                            name="role" value={formData.role} onChange={handleChange} required disabled={source === "EmployeePage"} />
                                        <label htmlFor="role">Job Title</label>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="date"
                                            className="form-control" disabled={source === "EmployeePage"}
                                            id="startDate" name="startDate"
                                            value={formData.startDate} onChange={handleChange}
                                        />
                                        <label htmlFor="startDate">Date Joined</label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-floating mb-3">
                                <select className="form-select" id="department" name="department" value={formData.department} onChange={handleChange} disabled={source === "EmployeePage"}>
                                    <option value="" disabled hidden></option>
                                    {departments.map(dep => (
                                        <option key={dep.id} value={dep.short_name}>{dep.dep_name}</option>
                                    ))}
                                </select>
                                <label htmlFor="department">Department</label>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <select className="form-select" id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                            <option value="" disabled hidden></option> {/* Empty default placeholder */}
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <label htmlFor="gender">Gender</label>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="form-floating mb-3">
                                        <input type="date" className="form-control no-placeholder" id="birthday"
                                            name="birthday" value={formData.birthday} onChange={handleChange} />
                                        <label htmlFor="birthday">Birthday</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="mobile" placeholder="Mobile Number"
                                            name="mobile" value={formData.mobile} onChange={handleChange} />
                                        <label htmlFor="mobile">Mobile Number</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <button type="submit" className="btn px-4 rounded-3 mt-2 text-white"
                                            style={{ width: "150px", backgroundColor: "rgb(37, 79, 118)" }}>{editMode ? "Update" : "Add"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeInfo;
