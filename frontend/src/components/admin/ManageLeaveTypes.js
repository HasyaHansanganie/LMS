import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from 'sweetalert2';

const ManageLeaveTypes = ({ setSelectedPage, setLeaveTypeData, setIsEditMode }) => {

    const [leaveTypes, setLeaveTypes] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3;
    const totalRecords = leaveTypes.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const visibleLeaveTypes = leaveTypes.slice(startIndex, endIndex);

    const [filterText, setFilterText] = useState("");

    // Fetch departments from backend
    useEffect(() => {
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

    const handleEdit = (leaveType) => {
        // Navigate to Add Department page with query params
        setLeaveTypeData({
            id: leaveType.id,
            leaveType: leaveType.leave_type,
            description: leaveType.description,
            leaveCount: leaveType.leave_count,
        });
        setIsEditMode(true);
        setSelectedPage("AddLeaveType");
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
                    await axios.delete(`http://localhost:5000/auth/delete_leave_type/${id}`);
                    fetchLeaveTypes();
                    Swal.fire({
                        timer: 2000, showConfirmButton: false,
                        width: '350px', padding: '1em',
                        customClass: { popup: 'small-swal-popup', },
                        html: `
                          <div style="display: flex; align-items: center; gap: 12px; text-align: left;">
                            <i class="fas fa-check-circle" style="color: #28a745; font-size: 28px;"></i>
                            <div>
                              <div style="font-size: 16px; font-weight: 600;">Deleted!</div>
                              <div style="font-size: 14px;">Leave Type has been removed.</div>
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
            <Header filePath="Admin / Leave Types /" pageName="Manage Leave Types" />

            <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                Manage Leave Types
            </h3>

            {/* Info Box */}
            <div className="p-4 shadow-lg mt-4">
                <h6 className="fw-bold text-secondary">Leave Types Info</h6>

                <div className="d-flex justify-content-end mb-3">
                    <input
                        type="text"
                        className="form-control border-0 border-bottom rounded-0 shadow-none"
                        placeholder="Search records"
                        style={{ maxWidth: "250px", fontSize: "0.9rem" }}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead style={{ fontSize: '0.9rem' }}>
                            <tr>
                                <th>Sr.No</th>
                                <th>Leave Type</th>
                                <th>Description</th>
                                <th>Leave Count</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '0.9rem' }}>
                            {visibleLeaveTypes.length > 0 ? (
                                visibleLeaveTypes
                                    .filter((leaveType) =>
                                        leaveType.leave_type.toLowerCase().includes(filterText.toLowerCase())
                                    )
                                    .map((leaveType, index) => (
                                        <tr
                                            key={leaveType._id}
                                            style={{ transition: "background 0.2s ease-in-out" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f2f2f2")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                        >
                                            <td>{startIndex + index + 1}</td>
                                            <td>{leaveType.leave_type}</td>
                                            <td>
                                                {leaveType.description.split('\n').map((line, idx) => (
                                                    <div key={idx}>{line}</div>
                                                ))}
                                            </td>
                                            <td>{leaveType.leave_count}</td>
                                            <td>
                                                <FaEdit
                                                    title="Edit"
                                                    className="text-primary me-3 cursor-pointer"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleEdit(leaveType)}
                                                />
                                                <FaTrash
                                                    title="Delete"
                                                    className="text-danger cursor-pointer"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleDelete(leaveType.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan="6">No Leave Types Found</td>
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

export default ManageLeaveTypes;
