import React, { useState, useEffect } from "react";
import Header from "../Header";
import axios from "axios";

const AddLeaveType = ({ id, leaveTypeName, leaveDescription, noOfLeaves, isEditMode }) => {

    const [leaveType, setLeaveType] = useState(leaveTypeName);
    const [description, setDescription] = useState(leaveDescription);
    const [leaveCount, setLeaveCount] = useState(noOfLeaves);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [editMode, setEditMode] = useState(isEditMode);

    useEffect(() => {
        setEditMode(isEditMode);
        setLeaveType(leaveTypeName);
        setDescription(leaveDescription);
        setLeaveCount(noOfLeaves);
    }, [leaveTypeName, leaveDescription, noOfLeaves, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;
            if (editMode) {
                res = await axios.post(`http://localhost:5000/auth/update_leave_type/${id}`, { leaveType, description, leaveCount });
                setEditMode(false);
            } else {
                res = await axios.post("http://localhost:5000/auth/add_leave_type", { leaveType, description, leaveCount });
            }
            setMessage(res.data.message);
            setMessageType("success");
            setLeaveType(""); setDescription(""); setLeaveCount("");
        } catch (error) {
            if (error.response) {
                // The server responded with a status outside the 2xx range
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
            <Header filePath="Admin / Leave Types /" pageName="Add Leave Type" />

            <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                {editMode ? "Update Leave Type" : "Add Leave Type"}
            </h3>

            {/* Form Box */}
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
                    {/* Leave Type */}
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control border-0 border-bottom rounded-0 shadow-none"
                            placeholder="Enter Leave Type"
                            value={leaveType} name="leaveType"
                            onChange={(e) => (setLeaveType(e.target.value))}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <textarea
                            id="description"
                            rows="4" cols="30"
                            className="form-control rounded-0 shadow-none"
                            placeholder="Enter description"
                            value={description} name="description"
                            onChange={(e) => (setDescription(e.target.value))}
                        />
                    </div>

                    {/* Leave Counts */}
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control border-0 border-bottom rounded-0 shadow-none"
                            placeholder="Enter Leave Count"
                            value={leaveCount} name="leaveCount"
                            onChange={(e) => (setLeaveCount(e.target.value))}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex gap-3 mt-4">
                        <button type="submit" className="btn p-2 rounded-3 mt-2 text-white"
                            style={{ width: "100px", backgroundColor: "rgb(37, 79, 118)" }}>{editMode ? "Update" : "Add"}</button>
                        <button type="button" className="btn p-2 px-4 rounded-3 mt-2 text-white btn-secondary"
                            onClick={() => {
                                setLeaveType(""); setDescription(""); setLeaveCount("");
                                setEditMode(false);
                            }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLeaveType;