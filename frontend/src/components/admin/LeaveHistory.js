import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import defaultProfile from '../../default_logo.svg';
import LeaveDetailsModal from './LeaveDetailsModal';

const LeaveHistory = () => {

    const [leaves, setLeaves] = useState([]);

    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filterText, setFilterText] = useState("");
    const [staff, setStaff] = useState([]);

    const filteredLeaves = leaves.filter((leave) => {
        const matchType = selectedLeaveType ? leave.leave_type === selectedLeaveType : true;
        const matchStatus = selectedStatus ? leave.status === selectedStatus : true;
        const employee = staff.find((person) => person.email === leave.email);
        const fullName = employee ? (employee.first_name + " " + employee.last_name).toLowerCase() : "";
        const matchName = fullName.includes(filterText.toLowerCase());
        return matchType && matchStatus && matchName;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const totalRecords = filteredLeaves.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const visibleLaeves = filteredLeaves.slice(startIndex, endIndex);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/get_employees")
            .then(res => setStaff(res.data))
            .catch(err => console.error(err));
    }, []);

    // Fetch departments from backend
    useEffect(() => {
        fetchLeaves();
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/auth/get_leave_types");
            setLeaveTypes(res.data);
        } catch (error) {
            console.error("Error fetching leave types:", error);
        }
    };

    const fetchLeaves = async () => {
        try {
            const res = await axios.get("http://localhost:5000/auth/get_leaves");
            setLeaves(res.data);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        }
    };

    const getEmployeeDetails = (email) => {
        const employee = staff.find((person) => person.email === email);
        return {
            name: employee ? employee.first_name + " " + employee.last_name : 'Unknown',
            imageUrl: `http://localhost:5000/userProfiles/${email}.jpg`
        };
    };

    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewDetails = (leave) => {
        setSelectedLeave(leave);
        setShowModal(true);
    };

    return (
        <div className="ps-3">
            <Header filePath="Admin / " pageName="Leave History" />

            <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                Leave History
            </h3>

            {/* Info Box */}
            <div className="p-4 shadow-lg mt-4">

                <div className="d-flex justify-content-end gap-4 mb-4">

                    <input
                        type="text"
                        className="form-control border-0 border-bottom rounded-0 shadow-none"
                        placeholder="Filter by Name"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        style={{ maxWidth: "200px", fontSize: "0.8rem" }}
                    />

                    {/* Leave Type Filter */}
                    <select
                        className="form-select border-0 border-bottom rounded-0 shadow-none form-select-sm"
                        style={{ maxWidth: "150px" }}
                        value={selectedLeaveType}
                        onChange={(e) => setSelectedLeaveType(e.target.value)}
                    >
                        <option value="">All Leave Types</option>
                        {leaveTypes.map((type, index) => (
                            <option key={index} value={type.leave_type}>{type.leave_type}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        className="form-select border-0 border-bottom rounded-0 shadow-none form-select-sm"
                        style={{ maxWidth: "180px" }}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Waiting for Approval">Waiting for Approval</option>
                    </select>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead style={{ fontSize: '0.9rem' }}>
                            <tr>
                                <th>Employee</th>
                                <th>Leave Type</th>
                                <th>Leave Method</th>
                                <th>Leave Duration</th>
                                <th>Status</th>
                                <th>Activity</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '0.9rem' }}>
                            {visibleLaeves.length > 0 ? (
                                visibleLaeves
                                    // .filter((leave) =>
                                    //     leave.short_name.toLowerCase().includes(filterText.toLowerCase())
                                    // )
                                    .map((leave, index) => (
                                        <tr
                                            key={leave._id}
                                            style={{ transition: "background 0.2s ease-in-out" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2f2f2")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                        >
                                            <td className="d-flex align-items-center">
                                                {(() => {
                                                    const { name, imageUrl } = getEmployeeDetails(leave.email);
                                                    return (
                                                        <>
                                                            <img
                                                                src={imageUrl}
                                                                alt={name}
                                                                className="rounded-circle me-2"
                                                                style={{ width: "35px", height: "35px", objectFit: "cover", border: "1px solid #ccc" }}
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = defaultProfile; // fallback image
                                                                }}
                                                            />
                                                            <span>{name}</span>
                                                        </>
                                                    );
                                                })()}
                                            </td>
                                            <td>{leave.leave_type}</td>
                                            <td>{leave.leave_method}</td>
                                            <td>
                                                {leave.from_date.slice(0, 10) === leave.to_date.slice(0, 10)
                                                    ? leave.from_date.slice(0, 10)
                                                    : `${leave.from_date.slice(0, 10)} -  ${leave.to_date.slice(0, 10)}`}
                                            </td>
                                            <td
                                                className={`fw-bold ${leave.status === "Approved" ? "text-success"
                                                    : leave.status === "Pending" ? "text-primary"
                                                        : leave.status === "Rejected" ? "text-danger"
                                                            : ""
                                                    }`}
                                            >{leave.status}</td>

                                            <td>
                                                <button
                                                    className="btn btn-sm fw-semibold"
                                                    style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#A5D8FF', }}
                                                    onClick={() => handleViewDetails(leave)}
                                                >
                                                    View Details
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan="6">No Applied Leaves found</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                    <LeaveDetailsModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        leave={selectedLeave}
                        staff={staff}
                    />
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <small>
                        Showing {totalRecords === 0 ? 0 : startIndex + 1} to{" "}
                        {endIndex > totalRecords ? totalRecords : endIndex} of {totalRecords} entries
                    </small>
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FaChevronLeft />
                        </button>

                        <div
                            className="px-3 py-1 border rounded text-white"
                            style={{ minWidth: "40px", textAlign: "center", backgroundColor: "rgb(37, 73, 106)" }}
                        >
                            {currentPage}
                        </div>

                        <button
                            className="btn btn-sm btn-outline-secondary ms-2"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveHistory;
