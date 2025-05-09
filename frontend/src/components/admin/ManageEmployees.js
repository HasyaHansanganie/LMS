import React, { useEffect, useState } from "react";
import Header from "../Header";
import { FaEllipsisV, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import defaultProfile from '../../default_logo.svg';
import Swal from 'sweetalert2';

const ManageEmployees = ({setSelectedPage, setEmpData, setIsEditMode, setEmpEmail}) => {

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        department: "",
        role: "",
    });

    useEffect(() => {
        // Fetch employee data
        axios.get("http://localhost:5000/auth/get_employees")
            .then(res => setEmployees(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/get_departments")
            .then(res => setDepartments(res.data))
            .catch(err => console.error("Error fetching departments:", err));
    }, []);

    const filteredEmployees = employees.filter(emp => {
        return (
            emp.first_name.toLowerCase().includes(filters.name.toLowerCase()) &&
            (filters.department === "" || emp.department === filters.department) &&
            (filters.role === "" || emp.role === filters.role)
        );
    });

    const handleEdit = (emp) => {
        const formattedBirthday = emp.date_of_birth?.split('T')[0] || '';
        const formattedJoinedDate = emp.date_of_join?.split('T')[0] || '';
        // Navigate to Add Employee page with query params
        setEmpData({
            empId: emp.id, employeeCode: emp.employee_id, startDate: formattedJoinedDate, firstName: emp.first_name, lastName: emp.last_name, email: emp.email, password: "", confirmPassword: "",
            gender: emp.gender, birthday: formattedBirthday, department: emp.department, address: emp.address, role: emp.role, mobile: emp.mobile_number
        });
        setIsEditMode(true);
        setSelectedPage("AddEmployee");
    };

    const handleRemove = async (id) => {
        Swal.fire({
            showCancelButton: true, showCloseButton: true, focusConfirm: false,
            confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it',
            cancelButtonColor: '#3085d6', cancelButtonText: 'Cancel',
            width: '350px', padding: '1em',
            customClass: {
                popup: 'small-swal-popup',
                confirmButton: 'px-3 py-1',
                cancelButton: 'px-3 py-1',
            },
            html: `
                <div style="display: flex; align-items: center; gap: 30px; text-align: left;">
                    <div><i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #f39c12;"></i></div>
                    <div>
                        <div style="font-size: 16px; font-weight: bold;">Are you sure?</div>
                        <div style="font-size: 14px; margin-top: 4px;">This action cannot be undone.</div>
                    </div>
                </div>
            `,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/auth/delete_employee/${id}`);
                    setEmployees((prev) => prev.filter(emp => emp.id !== id));
                    Swal.fire({
                        timer: 2000, showConfirmButton: false,
                        width: '350px', padding: '1em',
                        customClass: { popup: 'small-swal-popup', },
                        html: `
                          <div style="display: flex; align-items: center; gap: 12px; text-align: left;">
                            <i class="fas fa-check-circle" style="color: #28a745; font-size: 28px;"></i>
                            <div>
                              <div style="font-size: 16px; font-weight: 600;">Deleted!</div>
                              <div style="font-size: 14px;">Employee has been removed.</div>
                            </div>
                          </div>
                        `
                    });

                } catch (error) {
                    Swal.fire({
                        confirmButtonText: 'OK', width: '350px', padding: '1em',
                        customClass: {popup: 'small-swal-popup',},
                        html: `
                          <div style="display: flex; align-items: center; gap: 12px; text-align: left;">
                             <i class="fas fa-times-circle" style="color: #dc3545; font-size: 28px;"></i>
                            <div>
                              <div style="font-size: 16px; font-weight: 600;">Error!</div>
                              <div style="font-size: 14px;">Something went wrong while deleting.</div>
                            </div>
                          </div>
                        `
                    });
                }
            }
        });
    };

    return (
        <div className="ps-3">
            <Header filePath="Admin / Employees /" pageName="Manage Employees" />

            <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                Manage Employees
            </h3>

            <div className="d-flex justify-content-end gap-3 mb-4">
                <input
                    type="text"
                    className="form-control border-0 border-bottom rounded-0 shadow-none"
                    placeholder="Filter by Name"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    style={{ maxWidth: "200px", fontSize: "0.8rem" }}
                />

                <select
                    className="form-select border-0 border-bottom rounded-0 shadow-none"
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    style={{ maxWidth: "200px", fontSize: "0.8rem" }}
                >
                    <option value="">All Departments</option>
                    {departments.map(dep => (
                        <option key={dep.id} value={dep.short_name}>{dep.short_name}</option>
                    ))}
                    {/* Add more as needed */}
                </select>

            </div>


            <div className="row mt-5">
                {filteredEmployees.map((emp, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card shadow-lg p-3 bg-light position-relative" style={{ minHeight: "250px", border: "none", borderRadius: "1rem" }}>

                            {/* Top section */}
                            <div className="d-flex justify-content-between align-items-start">
                                <img
                                    src={`http://localhost:5000/userProfiles/${emp.email}.jpg`}
                                    onError={(e) => { e.target.onerror = null; e.target.src = defaultProfile; }}
                                    alt="Profile"
                                    className="rounded-circle"
                                    width="60"
                                    height="60"
                                />
                                <div className="dropdown">
                                    <button
                                        className="btn btn-link text-dark"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <FaEllipsisV />
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a className="dropdown-item" href="#" onClick={() => handleEdit(emp)}>Profile</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={() => {setEmpEmail(emp.email); setSelectedPage("EmpLeaveHistory"); }}>Leave History</a></li>
                                        <li><a className="dropdown-item text-danger" href="#" onClick={() => handleRemove(emp.id)}>Remove</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Name & Role */}
                            <div className="mt-2">
                                <h6 className="mb-0">{emp.first_name} {emp.last_name}</h6>
                                <small className="text-muted">{emp.role}</small>
                            </div>

                            {/* Department & Joined Date Box */}
                            <div className="info-box mt-3 p-3 shadow-sm bg-white" style={{ borderRadius: "1rem" }}>
                                <div className="mb-3 d-flex justify-content-between" style={{ fontSize: "0.9rem" }}>
                                    <div>
                                        <small className="text-muted">Department</small><br />
                                        <small><b>{emp.department}</b></small>
                                    </div>
                                    <div className="text-end">
                                        <small className="text-muted">Joined Date</small><br />
                                        <small><b>{new Date(emp.date_of_join).toLocaleDateString()}</b></small>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center mb-2">
                                    <FaEnvelope className="me-2 text-secondary" />
                                    <small>{emp.email}</small>
                                </div>
                                <div className="d-flex align-items-center">
                                    <FaPhone className="me-2 text-secondary" />
                                    <small>{emp.mobile_number}</small>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default ManageEmployees;