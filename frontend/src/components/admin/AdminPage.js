import { React, useState, useEffect } from "react";
import adminProfile from '../../admin_profile.jpg';
import './AdminPage.css';
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaTachometerAlt, FaBuilding, FaUsers, FaCalendarAlt, FaKey, FaSignOutAlt, FaListAlt, FaAngleRight } from "react-icons/fa"; // Importing icons

import Dashboard from "./Dashboard";
import AddDepartment from "./AddDepartment";
import ManageDepartments from "./ManageDepartments";
import AddLeaveType from "./AddLeaveType";
import ManageLeaveTypes from "./ManageLeaveTypes";
import AddEmployee from "../EmployeeInfo";
import ManageEmployees from "./ManageEmployees";
import LeaveHistory from "./LeaveHistory";
import ChangePassword from "./ChangePassword";
import EmpLeaveHistory from "../employee/LeaveHistory";

const AdminPage = () => {

    const userEmail = localStorage.getItem("userEmail");
    const userPassword = localStorage.getItem("userPassword");

    const navigate = useNavigate();

    const [dropdowns, setDropdowns] = useState({
        departments: false,
        leaveTypes: false,
        employees: false,
        leaveManagement: false,
    });

    const toggleDropdown = (menu) => {
        setDropdowns((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const menuItems = [
        {
            name: "departments", title: "Departments", icon: <FaBuilding className="me-3" />,
            subItems: [{ label: "Add Department", page: "AddDepartment" }, { label: "Manage Departments", page: "ManageDepartments" },]
        },
        {
            name: "leaveTypes", title: "Leave Types", icon: <FaListAlt className="me-3" />,
            subItems: [{ label: "Add Leave Type", page: "AddLeaveType" }, { label: "Manage Leave Types", page: "ManageLeaveTypes" },]
        },
        {
            name: "employees", title: "Employees", icon: <FaUsers className="me-3" />,
            subItems: [{ label: "Add Employee", page: "AddEmployee" }, { label: "Manage Employees", page: "ManageEmployees" },]
        }
    ];

    const [selectedPage, setSelectedPage] = useState("Dashboard");
    const [isEditMode, setIsEditMode] = useState(false);

    const [empEmail, setEmpEmail] = useState("");

    const [departmentData, setDepartmentData] = useState({
        depId: "",
        depName: "",
        depShortName: "",
        depCode: "",
    });

    const [leaveTypeData, setLeaveTypeData] = useState({
        id: "",
        leaveType: "",
        description: "",
        leaveCount: 0,
    });

    const [empData, setEmpData] = useState({
        empId: "", employeeCode: "", startDate: "", firstName: "", lastName: "", email: "",
        gender: "", birthday: "", department: "", address: "", role: "", mobile: ""
    });

    useEffect(() => {
        if (selectedPage === "AddDepartment" && !isEditMode) {
            setDepartmentData({
                depName: "",
                depShortName: "",
                depCode: "",
                message: "",
            });
        }
        if (selectedPage === "AddLeaveType" && !isEditMode) {
            setLeaveTypeData({
                id: "",
                leaveType: "",
                description: "",
                leaveCount: 0,
            });
        }
        if (selectedPage === "AddEmployee" && !isEditMode) {
            setEmpData({
                empId: "", employeeCode: "", startDate: "", firstName: "", lastName: "", email: "",
                gender: "", birthday: "", department: "", address: "", role: "", mobile: ""
            });
        }
    }, [selectedPage, isEditMode]);

    // Function to render the selected page
    const renderContent = () => {
        switch (selectedPage) {
            case "Dashboard": return <Dashboard setSelectedPage={setSelectedPage} />;
            case "AddEmployee": return <AddEmployee empId={empData.empId} empData={empData} isEditMode={isEditMode} source="AdminPage" />;
            case "ManageEmployees":
                return (
                    <ManageEmployees
                        setSelectedPage={setSelectedPage}
                        setEmpData={setEmpData}
                        setIsEditMode={setIsEditMode}
                        setEmpEmail={setEmpEmail}
                    />);
            case "EmpLeaveHistory":
                return (
                    <EmpLeaveHistory
                        // setSelectedPage={setSelectedPage}
                        // setEmpData={setEmpData}
                        // setIsEditMode={setIsEditMode}
                        userEmail={empEmail}
                    />);
            case "AddDepartment":
                return (
                    <AddDepartment
                        id={departmentData.depId}
                        name={departmentData.depName}
                        shortName={departmentData.depShortName}
                        code={departmentData.depCode}
                        isEditMode={isEditMode}
                    />
                );
            case "ManageDepartments":
                return (
                    <ManageDepartments
                        setSelectedPage={setSelectedPage}
                        setDepartmentData={setDepartmentData}
                        setIsEditMode={setIsEditMode} />
                );
            case "AddLeaveType":
                return (
                    <AddLeaveType
                        id={leaveTypeData.id}
                        leaveTypeName={leaveTypeData.leaveType}
                        leaveDescription={leaveTypeData.description}
                        noOfLeaves={leaveTypeData.leaveCount}
                        isEditMode={isEditMode}
                    />
                );
            case "ManageLeaveTypes":
                return (
                    <ManageLeaveTypes
                        setSelectedPage={setSelectedPage}
                        setLeaveTypeData={setLeaveTypeData}
                        setIsEditMode={setIsEditMode} />
                );
            case "LeaveHistory": return <LeaveHistory />;
            case "ChangePassword": return <ChangePassword userEmail={userEmail} userPassword={userPassword} />;
            default:
                return <h2>Page Not Found</h2>;
        }
    };

    return (
        <div className="d-flex vh-100">
            <div className="d-flex flex-column p-3 m-3 me-0 rounded-4 shadow-lg h-100 overflow-auto" style={{ width: "250px", backgroundColor: "rgb(24, 43, 61)" }}>
                {/* Profile Section */}
                <div className="text-center mb-4">
                    <img src={adminProfile} alt="Profile" className="rounded-circle mb-2 mt-4" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                    <h5 className="fw-bold text-white">ADMIN</h5>
                </div>

                {/* Navigation Links */}
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a href="#" className={`nav-link text-white d-flex align-items-center hover-effect ${selectedPage === "Dashboard" ? "bg-gray" : ""}`} onClick={() => setSelectedPage("Dashboard")}>
                            <FaTachometerAlt className="me-3" /> Dashboard
                        </a>
                    </li>

                    {/* Loop through dropdown menuItems */}
                    {menuItems.map((item) => (
                        <li key={item.name} className="nav-item">
                            <a href="#" className="nav-link text-white d-flex align-items-center" onClick={() => toggleDropdown(item.name)}>
                                {item.icon}
                                {item.title}
                                {dropdowns[item.name] ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
                            </a>
                            {dropdowns[item.name] && (
                                <ul className="nav flex-column">
                                    {item.subItems.map((sub, idx) => (
                                        <li key={idx} className="nav-item">
                                            <a href="#"
                                                className={`nav-link nav-subitem text-white hover-effect ${selectedPage === sub.page ? "bg-gray" : ""}`}
                                                onClick={() => {
                                                    setIsEditMode(false);  // Reset the edit mode to false when navigating
                                                    setSelectedPage(sub.page);  // Set the selected page to navigate to the new page
                                                }}>
                                                <FaAngleRight className="me-3" />
                                                {sub.label}
                                            </a>

                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}

                    <li className="nav-item">
                        <a href="#" className={`nav-link text-white d-flex align-items-center hover-effect ${selectedPage === "LeaveHistory" ? "bg-gray" : ""}`}
                            onClick={() => setSelectedPage("LeaveHistory")}>
                            <FaCalendarAlt className="me-3" /> Leave History
                        </a>
                    </li>

                    <li className="nav-item">
                        <a href="#" className={`nav-link text-white d-flex align-items-center hover-effect ${selectedPage === "ChangePassword" ? "bg-gray" : ""}`}
                            onClick={() => setSelectedPage("ChangePassword")}>
                            <FaKey className="me-3" /> Change Password
                        </a>
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

export default AdminPage;