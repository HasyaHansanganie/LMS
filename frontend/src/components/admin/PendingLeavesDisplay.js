import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import defaultProfile from '../../default_logo.svg';
import LeaveDetailsModal from './LeaveDetailsModal';

const PendingLeavesDisplay = ({ pendingLeaves, staff, onApprove, onReject }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3;
    const totalRecords = pendingLeaves.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const visibleLaeves = pendingLeaves.slice(startIndex, endIndex);

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

        <div className='shadow-lg rounded-4 mt-3 p-3 ps-4'>

            <p className="fw-bold text-secondary">New Leave Applications</p>

            {/* Scrollable Table */}
            <div className="table-responsive mt-4">
                <table className="table table-hover">
                    <thead style={{ fontSize: '0.8rem' }}>
                        <tr>
                            <th>Employee</th>
                            <th>Leave Type</th>
                            <th>Leave Method</th>
                            <th>Leave Duration</th>
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

                                    <td>
                                        <button
                                            className="btn btn-sm me-2 fw-semibold"
                                            style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#cdeac0', }}
                                            onClick={() => onApprove(leave)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-sm me-2 fw-semibold"
                                            style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#FFC9DE', }}
                                            onClick={() => onReject(leave)}
                                        >
                                            Reject
                                        </button>
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
                                <td className="text-center" colSpan="7">No Pending Leaves</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <LeaveDetailsModal
                show={showModal}
                onHide={() => setShowModal(false)}
                leave={selectedLeave}
                staff={staff}
            />

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

