// LeaveInfoModal.js
import React from "react";
import { Modal } from "react-bootstrap";

const LeaveInfoModal = ({ show, onHide, leave, staff }) => {
    if (!leave) return null;

    const employee = staff.find((person) => person.email === leave.email);

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return { backgroundColor: '#cdeac0', color: '#1a3c00' };
            case 'rejected':
                return { backgroundColor: '#FFC9DE', color: '#7b003f' };
            case 'pending':
                return { backgroundColor: '#A5D8FF', color: '#004075' };
            default:
                return { backgroundColor: '#e0e0e0', color: '#333' };
        }
    };

    return (
        <>
            <style>{`
                .custom-modal-dialog {
                    width: auto;
                    max-width: 55vw;
                    margin: auto;
                }
            `}</style>

            <Modal
                show={show}
                onHide={onHide}
                centered
                dialogClassName="custom-modal-dialog"
                contentClassName="border-0 rounded-4 shadow p-2"
            >
                <Modal.Header closeButton className="border-0 pb-2">
                    <Modal.Title className="fs-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                        Leave Details
                    </Modal.Title>
                </Modal.Header>

                <hr className="mt-0" />

                <Modal.Body className="pt-0">
                    <div className="container-fluid">

                        {/* Row 1 */}
                        <div className="row small py-2 border-bottom gx-5">
                            <div className="col">
                                <div className="text-muted">Employee Name</div>
                                <div className="fw-semibold">{employee.first_name + ' ' + employee.last_name}</div>
                            </div>
                            <div className="col">
                                <div className="text-muted">ID</div>
                                <div className="fw-semibold">{employee.employee_id}</div>
                            </div>
                            <div className="col">
                                <div className="text-muted">Role</div>
                                <div className="fw-semibold">{employee.role}</div>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="row small py-2 border-bottom gx-5">
                            <div className="col">
                                <div className="text-muted">Department</div>
                                <div className="fw-semibold">{employee.department}</div>
                            </div>
                            <div className="col">
                                <div className="text-muted">Email</div>
                                <div className="fw-semibold">{employee.email}</div>
                            </div>
                            <div className="col">
                                <div className="text-muted">Contact No.</div>
                                <div className="fw-semibold">{employee.mobile_number}</div>
                            </div>
                        </div>

                        {/* Row 3 - Always 3 columns (Leave Type, Method, and empty or duration) */}
                        <div className="row small py-3 border-bottom gx-5">
                            <div className="col">
                                <div className="text-muted">Leave Type</div>
                                <div className="fw-semibold">{leave.leave_type}</div>
                            </div>
                            <div className="col">
                                <div className="text-muted">Leave Method</div>
                                <div className="fw-semibold">{leave.leave_method}</div>
                            </div>
                            <div className="col">
                                {leave.from_date === leave.to_date ? (
                                    <>
                                        <div className="text-muted">Leave Date</div>
                                        <div className="fw-semibold">{leave.from_date}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-muted">Leave Duration</div>
                                        <div className="fw-semibold text-break">
                                            {leave.from_date} ➝ {leave.to_date}
                                        </div>
                                    </>

                                    // <div style={{ minHeight: '38px' }}></div>
                                )}
                            </div>
                        </div>

                    


                        {/* Row 5 */}
                        <div className="row small py-2 border-bottom align-items-start">
                            <div className="col">
                                <div className="text-muted">Leave Description</div>
                                <div className="fw-semibold">{leave.reason?.trim() ? leave.reason : '-'}</div>
                            </div>
                            <div className="col" />
                            <div className="col">
                                <div style={{ minHeight: '10px' }}></div>
                                <span
                                    className="fw-semibold px-3 py-1 rounded-pill ms-3 mt-3"
                                    style={{
                                        fontSize: '0.85rem',
                                        ...getStatusStyle(leave.status),
                                    }}
                                >
                                    {leave.status}
                                </span>
                            </div>
                        </div>


                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LeaveInfoModal;
