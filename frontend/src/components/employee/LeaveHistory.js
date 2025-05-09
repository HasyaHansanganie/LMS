import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from 'sweetalert2';

const LeaveHistory = ({ setSelectedPage, setLeaveData, setIsEditMode, userEmail }) => {

    const [leaves, setLeaves] = useState([]);

    const isEmployeeView = setSelectedPage && setLeaveData && setIsEditMode;

    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const filteredLeaves = leaves.filter((leave) => {
        const matchType = selectedLeaveType ? leave.leave_type === selectedLeaveType : true;
        const matchStatus = selectedStatus ? leave.status === selectedStatus : true;
        return matchType && matchStatus;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const totalRecords = filteredLeaves.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const visibleLaeves = filteredLeaves.slice(startIndex, endIndex);

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
            const res = await axios.get(`http://localhost:5000/auth/get_leaves/${userEmail}`);
            setLeaves(res.data);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        }
    };

    const handleEdit = (leave) => {
        // Navigate to Add Department page with query params
        setLeaveData({
            leaveId: leave.id,
            leaveType: leave.leave_type,
            leaveMethod: leave.leave_method,
            fromDate: new Date(leave.from_date).toISOString().slice(0, 10),
            toDate: new Date(leave.to_date).toISOString().slice(0, 10),
            reason: leave.reason
        });
        setIsEditMode(true);
        setSelectedPage("ApplyLeave");
    };

    const handleDelete = async (id) => {
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
                    await axios.delete(`http://localhost:5000/auth/delete_leave/${id}`);
                    fetchLeaves();
                    Swal.fire({
                        timer: 2000, showConfirmButton: false,
                        width: '350px', padding: '1em',
                        customClass: { popup: 'small-swal-popup', },
                        html: `
                          <div style="display: flex; align-items: center; gap: 12px; text-align: left;">
                            <i class="fas fa-check-circle" style="color: #28a745; font-size: 28px;"></i>
                            <div>
                              <div style="font-size: 16px; font-weight: 600;">Deleted!</div>
                              <div style="font-size: 14px;">Leave has been removed.</div>
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
            <Header filePath="Employee / Leaves /" pageName="Leave History" userEmail={userEmail} />

            <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                Leave History
            </h3>

            {/* Info Box */}
            <div className="p-4 shadow-lg mt-4">

                <div className="d-flex justify-content-end gap-4 mb-4">
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
                                <th>Sr.No</th>
                                <th>Leave Type</th>
                                <th>Leave Method</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Reason</th>
                                <th>Status</th>
                                {isEmployeeView && <th>Activity</th>}
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
                                            <td>{startIndex + index + 1}</td>
                                            <td>{leave.leave_type}</td>
                                            <td>{leave.leave_method}</td>
                                            <td>{leave.from_date.slice(0, 10)}</td>
                                            <td>{leave.to_date.slice(0, 10)}</td>
                                            <td>
                                                {leave.reason.split('\n').map((line, idx) => (
                                                    <div key={idx}>{line}</div>
                                                ))}
                                            </td>
                                            <td
                                                className={`fw-bold ${leave.status === "Approved" ? "text-success"
                                                    : leave.status === "Pending" ? "text-primary"
                                                        : leave.status === "Rejected" ? "text-danger"
                                                            : ""
                                                    }`}
                                            >{leave.status}</td>
                                            {isEmployeeView && (
                                                <td>
                                                    {leave.status === "Pending" ? (
                                                        <>
                                                            <FaEdit
                                                                title="Edit"
                                                                className="text-primary me-3 cursor-pointer"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleEdit(leave)}
                                                            />
                                                            <FaTrash
                                                                title="Delete"
                                                                className="text-danger cursor-pointer"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleDelete(leave.id)}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaEdit
                                                                title="Edit disabled"
                                                                className="text-muted me-3"
                                                                style={{ cursor: "not-allowed", opacity: 0.5 }}
                                                            />
                                                            <FaTrash
                                                                title="Delete disabled"
                                                                className="text-muted"
                                                                style={{ cursor: "not-allowed", opacity: 0.5 }}
                                                            />
                                                        </>
                                                    )}
                                                </td>
                                            )}

                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan="6">No Applied Leaves found</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
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
