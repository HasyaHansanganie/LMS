import defaultProfile from '../../default_logo.svg';
import img from '../../Hasya_Hansanganie.jpg';
import { React, useState, useEffect } from "react";
import axios from "axios";
import './EmployeePage.css';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import UploadProfile from "./UploadProfile";
import { FaChevronDown, FaCamera, FaChevronUp, FaTachometerAlt, FaBuilding, FaUser, FaUserCircle, FaUsers, FaCalendarAlt, FaKey, FaSignOutAlt, FaListAlt, FaAngleRight } from "react-icons/fa"; // Importing icons

import Dashboard from "./Dashboard";
import EmployeeInfo from "../EmployeeInfo";
import ChangePassword from "./ChangePassword";
import ApplyLeave from "./ApplyLeave";
import LeaveHistory from "./LeaveHistory";

const EmployeePage = () => {

    const userEmail = localStorage.getItem("userEmail");
    const userPassword = localStorage.getItem("userPassword");

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if (userEmail) {
            axios.get(`http://localhost:5000/auth/get_employee/${userEmail}`)
                .then(res => {
                    if (res.data.length > 0) {
                        const emp = res.data[0];

                        // Format dates
                        const formattedJoinedDate = new Date(emp.date_of_join).toISOString().split("T")[0];
                        const formattedBirthday = new Date(emp.date_of_birth).toISOString().split("T")[0];

                        // Transform object
                        const transformedData = {
                            empId: emp.id, employeeCode: emp.employee_id, startDate: formattedJoinedDate, firstName: emp.first_name,
                            lastName: emp.last_name, email: emp.email, password: "", confirmPassword: "", gender: emp.gender,
                            birthday: formattedBirthday, department: emp.department, address: emp.address, role: emp.role, mobile: emp.mobile_number,
                        };

                        setUserData(transformedData);
                    }
                })
                .catch(err => console.error("Error fetching user details:", err));
        }
    }, [userEmail]);


    const navigate = useNavigate();

    const [dropdowns, setDropdowns] = useState({});

    const [selectedPage, setSelectedPage] = useState("Dashboard");
    const [isEditMode, setIsEditMode] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [profileUrl, setProfileUrl] = useState(`http://localhost:5000/userProfiles/${userEmail}.jpg`);


    useEffect(() => {
        // If image doesn't exist, fallback to default
        const img = new Image();
        img.src = profileUrl;
        img.onerror = () => setProfileUrl("/default-profile.jpg");
    }, [userEmail]);

    const handleUploadSuccess = () => {
        // Force update image with a new timestamp to bypass cache
        const timestamp = Date.now();
        setProfileUrl(`http://localhost:5000/userProfiles/${userEmail}.jpg?${timestamp}`);
        setShowPopup(false); // Close the popup
    };


    const [leaveData, setLeaveData] = useState({
        leaveId: "",
        leaveType: 'Annual',
        leaveMethod: 'Full Day',
        fromDate: dayjs().format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD'),
        reason: ''
    });

    useEffect(() => {
        if (selectedPage === "ApplyLeave" && !isEditMode) {
            setLeaveData({
                leaveId: "",
                leaveType: 'Annual',
                leaveMethod: 'Full Day',
                fromDate: dayjs().format('YYYY-MM-DD'),
                toDate: dayjs().format('YYYY-MM-DD'),
                reason: ''
            });
        }
    }, [selectedPage, isEditMode]);

    // Function to render the selected page
    const renderContent = () => {
        switch (selectedPage) {
            case "Dashboard":
                return (
                    <Dashboard
                        setSelectedPage={setSelectedPage}
                        setLeaveData={setLeaveData}
                        setIsEditMode={setIsEditMode}
                        userEmail={userEmail} />
                );
            case "MyProfile": return (
                <EmployeeInfo empId={userData.empId} empData={userData} isEditMode={true} source="EmployeePage"/>
            );
            case "ApplyLeave": return <ApplyLeave leaveId={leaveData.leaveId} leaveData={leaveData} isEditMode={isEditMode} userEmail={userEmail} />;
            case "LeaveHistory":
                return (
                    <LeaveHistory
                        setSelectedPage={setSelectedPage}
                        setLeaveData={setLeaveData}
                        setIsEditMode={setIsEditMode}
                        userEmail={userEmail} />
                );
            case "ChangePassword": return <ChangePassword userEmail={userEmail} userPassword={userPassword} />;
            default:
                return <h2>Page Not Found</h2>;
        }
    };

    return (
        <div className="d-flex vh-100" style={{ width: "100vw", overflowX: "hidden" }}>
            <div className="d-flex flex-column p-3 m-3 me-0 rounded-4 shadow-lg h-100 overflow-auto" style={{ width: "250px", backgroundColor: "rgb(24, 43, 61)" }}>

                {/* Profile Section */}
                <div className="text-center mb-5">
                    <div className="position-relative d-inline-block mb-2">
                        {/* Profile Picture */}
                        <img
                            src={profileUrl}
                            alt="Profile"
                            className="rounded-circle mb-2 mt-4"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultProfile;
                            }}
                        />

                        {/* Edit Icon */}
                        {selectedPage === "MyProfile" && (
                            <button
                                className="position-absolute bottom-0 border-light end-0 btn btn-dark rounded-circle d-flex justify-content-center align-items-center"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    padding: "0",
                                }}
                                title="Edit Profile"
                                onClick={() => setShowPopup(true)}
                            >
                                <FaCamera className="text-white" style={{ fontSize: "12px" }} />
                            </button>
                        )}

                    </div>

                    {showPopup && (
                        <UploadProfile
                            email={userEmail}
                            onClose={() => setShowPopup(false)}
                            onUploadSuccess={handleUploadSuccess}
                        />
                    )}
                    <h5 className="fw-bold text-white">Hasya Hansanganie</h5>
                </div>

                {/* Navigation Links */}
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a href="#" className={`nav-link text-white d-flex align-items-center hover-effect ${selectedPage === "Dashboard" ? "bg-gray" : ""}`} onClick={() => setSelectedPage("Dashboard")}>
                            <FaTachometerAlt className="me-3" /> Dashboard
                        </a>
                    </li>

                    <li className="nav-item">
                        <a href="#" className={`nav-link text-white d-flex align-items-center hover-effect ${selectedPage === "MyProfile" ? "bg-gray" : ""}`}
                            onClick={() => setSelectedPage("MyProfile")}>
                            <FaUserCircle className="me-3" /> My Profile
                        </a>
                    </li>

                    <li className="nav-item">
                        <a href="#" className={`nav-link text-white d-flex align-items-center hover-effect ${selectedPage === "ChangePassword" ? "bg-gray" : ""}`}
                            onClick={() => setSelectedPage("ChangePassword")}>
                            <FaKey className="me-3" /> Change Password
                        </a>
                    </li>

                    <li className="nav-item">
                        <a
                            href="#"
                            className="nav-link text-white d-flex align-items-center"
                            onClick={() => setDropdowns(prev => ({ ...prev, leaves: !prev.leaves }))}
                        >
                            <FaCalendarAlt className="me-3" />
                            Leaves
                            {dropdowns.leaves ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
                        </a>

                        {dropdowns.leaves && (
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a
                                        href="#"
                                        className={`nav-link nav-subitem text-white hover-effect ${selectedPage === "ApplyLeave" ? "bg-gray" : ""}`}
                                        onClick={() => { setIsEditMode(false); setSelectedPage("ApplyLeave"); }}
                                    >
                                        <FaAngleRight className="me-3" />
                                        Apply Leave
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        href="#"
                                        className={`nav-link nav-subitem text-white hover-effect ${selectedPage === "LeaveHistory" ? "bg-gray" : ""}`}
                                        onClick={() => setSelectedPage("LeaveHistory")}
                                    >
                                        <FaAngleRight className="me-3" />
                                        Leave History
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="nav-item">
                        <a href="#" className="nav-link text-white d-flex align-items-center hover-effect" onClick={() => navigate("/")}>
                            <FaSignOutAlt className="me-3" /> Sign Out
                        </a>
                    </li>
                </ul>
            </div>

            {/* Right Content Area */}
            <div className="flex-grow-1 m-3 ms-0 p-3 ps-4 overflow-auto" >
                {renderContent()}
            </div>

        </div>
    );
};

export default EmployeePage;