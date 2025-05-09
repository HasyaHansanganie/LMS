import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = ({ userEmail, userPassword }) => {

    const initialFormData = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    }

    const [formData, setFormData] = useState({ initialFormData });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { currentPassword, newPassword, confirmPassword } = formData;

        if (currentPassword !== userPassword) {
            setMessage("The current password you entered is incorrect. Please try again.");
            setMessageType("error");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("New password and confirm password do not match.");
            setMessageType("error");
            return;
        }

        try {
            await axios.post("http://localhost:5000/auth/change_password", { userEmail, newPassword });
            setMessage("Password updated successfully!");
            setMessageType("success");
            setFormData(initialFormData);

        } catch (error) {
            if (error.response) {
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
            <Header filePath="Admin / " pageName="Change Password" userEmail={userEmail} />

            <div className="position-relative">
                <h3 className="mt-5 fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                    Change Password
                </h3>
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
            </div>

            <div className="p-5 shadow-lg mt-4 w-75">
                <form onSubmit={handleSubmit} className="text-secondary">
                    {/* Current Password */}
                    <div className="form-floating mb-3 position-relative">
                        <input
                            type={showPassword.current ? "text" : "password"}
                            className="form-control border-0 border-bottom rounded-0 shadow-none"
                            name="currentPassword"
                            placeholder="Current Password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="currentPassword">Current Password</label>
                        <span
                            onClick={() => toggleVisibility("current")}
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            style={{ cursor: "pointer" }}
                        >
                            {showPassword.current ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </span>
                    </div>

                    {/* New Password */}
                    <div className="form-floating mb-1 position-relative">
                        <input
                            type={showPassword.new ? "text" : "password"}
                            className="form-control border-0 border-bottom rounded-0 shadow-none"
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="newPassword">New Password</label>
                        <span
                            onClick={() => toggleVisibility("new")}
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            style={{ cursor: "pointer" }}
                        >
                            {showPassword.new ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-floating mb-4 position-relative">
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            className="form-control border-0 border-bottom rounded-0 shadow-none"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <span
                            onClick={() => toggleVisibility("confirm")}
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            style={{ cursor: "pointer" }}
                        >
                            {showPassword.confirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </span>
                    </div>

                    

                    {/* Submit Button */}
                    <div className="d-flex gap-3 mt-4">
                        <button type="submit" className="btn p-2 rounded-3 mt-2 text-white"
                            style={{ width: "100px", backgroundColor: "rgb(37, 79, 118)" }}>Update</button>
                        <button type="button" className="btn p-2 px-4 rounded-3 mt-2 text-white btn-secondary"
                            onClick={() => {
                                setFormData(initialFormData);
                            }}>Cancel</button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default ChangePassword;