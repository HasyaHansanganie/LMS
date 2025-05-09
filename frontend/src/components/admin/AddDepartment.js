import React, { useState, useEffect } from "react";
import Header from "../Header";
import axios from "axios";

const AddDepartment = ({ id, name, shortName, code, isEditMode }) => {

    const [depName, setDepName] = useState(name);
    const [depShortName, setDepShortName] = useState(shortName);
    const [depCode, setDepCode] = useState(code);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [editMode, setEditMode] = useState(isEditMode);

    useEffect(() => {
        setEditMode(isEditMode);
        setDepName(name);
        setDepShortName(shortName);
        setDepCode(code);
    }, [name, shortName, code, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;
            if (editMode) {
                res = await axios.post(`http://localhost:5000/auth/update_department/${id}`, { depName, depShortName, depCode });
                setEditMode(false);
            } else {
                res = await axios.post("http://localhost:5000/auth/add_department", { depName, depShortName, depCode });
            }

            setMessage(res.data.message);
            setMessageType("success");

            setDepName(""); setDepShortName(""); setDepCode("");
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
            <Header filePath="Admin / Departments /" pageName="Add Department" />

            <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                {editMode ? "Update Department" : "Add Department"}
            </h3>

            {/* Form Box */}
            <div className="p-5  shadow-lg mt-4 w-75 position-relative">

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
                    {/* Department Name */}
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control border-0 border-bottom rounded-0 shadow-none"
                            placeholder="Enter department name"
                            value={depName} name="depName"
                            onChange={(e) => (setDepName(e.target.value))}
                            required
                        />
                    </div>

                    {/* Department Short Name */}
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control border-0 border-bottom rounded-0 shadow-none"
                            placeholder="Enter short name"
                            value={depShortName} name="depShortName"
                            onChange={(e) => (setDepShortName(e.target.value))}
                        />
                    </div>

                    {/* Department Code */}
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control border-0 border-bottom rounded-0 shadow-none"
                            placeholder="Enter code"
                            value={depCode} name="depCode"
                            onChange={(e) => (setDepCode(e.target.value))}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex gap-3 mt-5">
                        <button type="submit" className="btn p-2 rounded-3 mt-2 text-white"
                            style={{ width: "100px", backgroundColor: "rgb(37, 79, 118)" }}>{editMode ? "Update" : "Add"}</button>
                        <button type="button" className="btn p-2 px-4 rounded-3 mt-2 text-white btn-secondary"
                            onClick={() => {
                                setDepName(""); setDepShortName(""); setDepCode("");
                                setEditMode(false);
                            }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDepartment;