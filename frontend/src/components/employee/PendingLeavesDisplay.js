import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from 'sweetalert2';

const PendingLeavesDisplay = ({ setSelectedPage, setLeaveData, setIsEditMode, leaveTypes, userEmail }) => {

    const [selectedLeaveType, setSelectedLeaveType] = useState("");
    const [pendingLeaves, setPendingLeaves] = useState([]);

    const filteredLeaves = pendingLeaves.filter((leave) => {
        const matchType = selectedLeaveType ? leave.leave_type === selectedLeaveType : true;
        return matchType;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3;
    const totalRecords = filteredLeaves.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const visibleLaeves = filteredLeaves.slice(startIndex, endIndex);

    useEffect(() => {
        fetchPendingLeaves();
    }, []);

    const fetchPendingLeaves = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/auth/get_user_pending_leaves/${userEmail}`);
            setPendingLeaves(res.data);
        } catch (error) {
            console.error("Error fetching pending leaves:", error);
        }
    };

    const handleEdit = (leave) => {

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
                    fetchPendingLeaves();
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

        <div className='shadow-lg w-55 rounded-2 mt-0 me-4 p-3 ps-4 d-flex flex-column h-auto'>

            <div className='d-flex justify-content-between align-items-center'>
                <span className="fw-bold text-secondary">Pending Leave Requests</span>
                <select
                    className="form-select border rounded-0 shadow-none form-select-sm"
                    style={{ maxWidth: "150px", fontSize: 13 }}
                    value={selectedLeaveType}
                    onChange={(e) => setSelectedLeaveType(e.target.value)}
                >
                    <option value="">All Leave Types</option>
                    {leaveTypes.map((type, index) => (
                        <option key={index} value={type.leave_type}>{type.leave_type}</option>
                    ))}
                </select>
            </div>

            {/* Scrollable Table */}
            <div className="table-responsive mt-4">
                <table className="table table-hover">
                    <thead style={{ fontSize: '0.8rem' }}>
                        <tr>
                            <th>Sr.No</th>
                            <th>Type</th>
                            <th>Method</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                            <th>Activity</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.8rem' }}>
                        {visibleLaeves.length > 0 ? (
                            visibleLaeves.map((leave, index) => (
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
                                        <span className="badge rounded-pill text-dark px-3 py-2" style={{ fontSize: '0.75rem', fontWeight: 'normal', backgroundColor: 'rgb(250, 177, 143)', }}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td>
                                        <FaEdit
                                            title="Edit"
                                            className="text-primary me-3"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleEdit(leave)}
                                        />
                                        <FaTrash
                                            title="Delete"
                                            className="text-danger"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleDelete(leave.id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="text-center" colSpan="7">No Applied Leaves found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-between align-items-center " style={{ fontSize: 13 }}>
                <small>
                    Showing {totalRecords === 0 ? 0 : startIndex + 1} to{" "}
                    {endIndex > totalRecords ? totalRecords : endIndex} of {totalRecords} entries
                </small>
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-outline-secondary me-2"
                        style={{ padding: "2px 6px", fontSize: "0.7rem" }}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                    </button>

                    <button
                        className="btn btn-outline-secondary ms-2"
                        style={{ padding: "2px 6px", fontSize: "0.7rem" }}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>

    );
};

export default PendingLeavesDisplay;

