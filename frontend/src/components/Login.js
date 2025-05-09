import { React, useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginImg from '../LoginImg.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    // Handles form submission for login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/auth/login", { email, password });

            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPassword", password);

            // Navigate based on user role
            if (res.data.role === "Admin") {
                navigate("/adminPage");
            } else {
                navigate("/employeePage");
            }

        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else if (error.request) {
                setMessage("No response from server");
            } else {
                setMessage("An error occurred");
            }
            setMessageType("error");
        }
    };

    // Handles password reset or first-time login
    const needPassword = async () => {
        try {
            const res = await axios.post("http://localhost:5000/auth/first-time-login", { email });
            setMessage(res.data.message);
            setMessageType("success");
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else if (error.request) {
                setMessage("No response from server");
            } else {
                setMessage("An error occurred");
            }
            setMessageType("error");
        }
    };

    // Toggle visibility of password input field
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="card shadow-lg p-4 rounded-4 w-100 d-flex flex-column flex-md-row gap-3">

                {/* Left side */}
                <div className="d-flex flex-column justify-content-between mt-4 w-100 w-md-50">
                    <div className='container mb-2'>
                        <h2 className="fw-bold text-center text-md-start">
                            <span className="d-block">Welcome to</span>
                            <span style={{ color: 'rgb(128, 129, 129)', fontSize: '1.5rem' }} className='d-md-block'>CodeNova Solutions </span>
                            <span style={{ color: 'rgb(14, 84, 149)' }}>LMS</span>
                        </h2>
                    </div>

                    <div className="ms-3 text-start d-none d-md-block">
                        <img
                            src={LoginImg}
                            alt="Login Visual"
                            className="img-fluid"
                            style={{
                                maxHeight: "220px",
                                width: "auto"
                            }}
                        />
                    </div>
                </div>


                {/* Right side */}
                <div className="position-relative w-100 w-md-50 p-4 shadow rounded-4">

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

                    <h3 className="fw-bold mb-4 text-start" style={{ color: 'rgb(14, 84, 149)' }}>Login</h3>

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <div className="input-group">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="input-group-text" role="button" onClick={togglePasswordVisibility}>
                                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>

                    <div className="mt-3">
                        <a
                            href="#"
                            className="text-decoration-none"
                            onClick={needPassword}
                            style={{ color: 'rgb(14, 84, 149)', fontSize: '0.9rem' }}
                        >
                            Forgot Password / First time logging in? <b><u>Contact IT</u></b>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
