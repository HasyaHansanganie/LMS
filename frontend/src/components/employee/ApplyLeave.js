import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Header from "../Header";
import { getRemainingLeaves } from "../../utils/leaveUtils";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // default styling
import 'tippy.js/themes/light.css'; // optional theme

const ApplyLeave = ({ leaveId, leaveData, isEditMode, userEmail }) => {

    delete leaveData.leaveId;
    const initialFormData = {
        leaveType: 'Annual',
        leaveMethod: 'Full Day',
        fromDate: dayjs().format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD'),
        reason: '',
    };

    const [leaveTypes, setLeaveTypes] = useState([]);
    const [formData, setFormData] = useState({ leaveData });
    const [leaveSummary, setLeaveSummary] = useState({});
    const [approvedLeaves, setApprovedLeaves] = useState([]);

    const [editMode, setEditMode] = useState(isEditMode);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        delete leaveData.leaveId;
        setEditMode(isEditMode);
        setFormData(leaveData);
    }, [leaveData, isEditMode]);

    useEffect(() => {
        const fetchLeaveTypesAndSummary = async () => {
            try {
                const res = await axios.get("http://localhost:5000/auth/get_leave_types");
                setLeaveTypes(res.data);

                const leavesRes = await axios.get(`http://localhost:5000/auth/get_user_approved_leaves/${userEmail}`); // Update API path
                setApprovedLeaves(leavesRes.data);

                const summary = await getRemainingLeaves(leaveTypes, approvedLeaves);
                console.log(summary);
                setLeaveSummary(summary);
            } catch (err) {
                console.error("ApplyLeavePage - error fetching leave data", err);
            }
        };

        fetchLeaveTypesAndSummary();
    }, [leaveTypes, approvedLeaves]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "fromDate") {
            setFormData(prev => ({
                ...prev,
                fromDate: value,
                toDate: value // auto-update toDate
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editMode) {
                await axios.post(`http://localhost:5000/auth/update_leave/${leaveId}`, formData);
                setMessage("Leave updated successfully");
                setEditMode(false);
            } else {
                await axios.post("http://localhost:5000/auth/apply_leave", { formData, userEmail });
                setMessage("Applied Leave Succefully");
            }
            setMessageType("success");
            setFormData(initialFormData);

        } catch (error) {
            if (error.response) {
                console.log("Error Response:", error.response.data);
                setMessage(error.response.data);
            } else {
                console.log("Error:", error.message);
                setMessage(error.message);
            }
            setMessageType("error");
        }
    };

    const pastelColors = [
        "#fde2e4", // soft pink
        "#cdeac0", // light green
        "#a0ced9", // pastel blue
        "#fbe7c6", // soft peach
        "#dcd3ff", // lavender
        "#fff1c1", // soft yellow
    ];

    return (


        <div className="ps-3">
            <Header filePath="Employee / Leaves / " pageName={editMode ? "Update Leave" : "Apply Leave"} userEmail={userEmail} />

            <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                {editMode ? "Update Leave" : "Apply Leave"}
            </h3>

            <div className='d-flex justify-content-between'>
                <div className="p-5 shadow-lg mt-4 w-75 position-relative">

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

                    <form onSubmit={handleSubmit}>
                        <div className="d-flex gap-3 mb-3">
                            <div className="form-floating flex-fill">
                                <select
                                    className="form-select custom-padding"
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleChange}
                                    required

                                >
                                    {leaveTypes.map((type, index) => (
                                        <option key={index} value={type.leave_type}>{type.leave_type}</option>
                                    ))}

                                </select>
                                <label htmlFor="leaveType">Leave Type</label>
                            </div>
                            <div className="form-floating flex-fill">
                                <select
                                    className="form-select custom-padding"
                                    id="leaveMethod"
                                    name="leaveMethod"
                                    value={formData.leaveMethod}
                                    onChange={handleChange}
                                >
                                    <option>Full Day</option>
                                    <option>Half Day (1st half)</option>
                                    <option>Half Day (2nd half)</option>
                                </select>
                                <label htmlFor="leaveMethod">Leave Method</label>
                            </div>
                        </div>

                        {/* From & To Date */}
                        <div className="d-flex gap-3 mb-3">
                            <div className="form-floating flex-fill">
                                <input
                                    type="date"
                                    className="form-control custom-padding"
                                    id="fromDate"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                />
                                <label htmlFor="fromDate">From</label>
                            </div>
                            <div className="form-floating flex-fill">
                                <input
                                    type="date"
                                    className="form-control custom-padding"
                                    id="toDate"
                                    name="toDate"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                />
                                <label htmlFor="toDate">To</label>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="form-floating mb-3">
                            <textarea
                                className="form-control custom-padding"
                                placeholder="Reason (Optional)"
                                id="reason"
                                name="reason"
                                style={{ height: '100px' }}
                                value={formData.reason}
                                onChange={handleChange}
                            ></textarea>
                            <label htmlFor="reason">Reason (Optional)</label>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex gap-3">
                            <button type="submit" className="btn p-2 rounded-3 mt-2 text-white"
                                style={{ width: "100px", backgroundColor: "rgb(37, 79, 118)" }}>{editMode ? "Update" : "Apply"}</button>
                            <button type="button" className="btn p-2 px-4 rounded-3 mt-2 text-white btn-secondary"
                                onClick={() => {
                                    setFormData(initialFormData);
                                    setEditMode(false);
                                }}>Cancel</button>
                        </div>
                    </form>

                    <style>{`
                            .form-floating > .form-control.custom-padding,
                            .form-floating > .form-select.custom-padding,
                            .form-floating > textarea.custom-padding {
                                height: 4.2rem;
                                padding-top: 2rem;
                            }
                            .form-floating > label {
                                font-size: 0.875rem;
                                opacity: 0.85;
                            }
                        `}</style>
                </div>

                <div className="p-4 ms-3">
                    <p className="mb-4 fw-bold text-secondary mt-4 text-center">Remaining Leaves</p>
                    <ul className="list-group">
                        {Object.entries(leaveSummary).map(([type, data], index) => (
                            <li
                                key={type}
                                className="list-group-item border-0 d-flex justify-content-between align-items-center"
                            >
                                <div
                                    className="badge rounded-pill px-4 py-2 d-flex justify-content-between align-items-center w-100 text-dark position-relative me-3"
                                    style={{
                                        minWidth: "160px",
                                        backgroundColor: pastelColors[index % pastelColors.length],
                                    }}
                                >
                                    <span className="fw-semibold">{type}</span>
                                    <span className="fw-bold">{data.remaining} / {data.total}</span>
                                </div>
                                <Tippy
                                    content={
                                        <div className="p-2" style={{borderRadius: '20px' }}>
                                            {data.description.split('\n').map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                        </div>
                                    }
                                    placement="bottom-start"
                                    theme="light"
                                    arrow={true}
                                    interactive={true}
                                >
                                    <i
                                        className="fas fa-circle-info me-2 text-secondary"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Tippy>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default ApplyLeave;