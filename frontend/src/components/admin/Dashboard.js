import { React, useState, useEffect } from "react";
import Header from "../Header";
import PendingLeavesDisplay from "./PendingLeavesDisplay";
import axios from "axios";
import LeaveCalendar from "./LeaveCalendar";

const Dashboard = ({ setSelectedPage }) => {

    const [staff, setStaff] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [approvedLeaves, setApprovedLeaves] = useState([]);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        axios.get("http://localhost:5000/auth/get_employees")
            .then(res => setStaff(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/get_departments")
            .then(res => setDepartments(res.data))
            .catch(err => console.error("Error fetching departments:", err));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/get_leave_types")
            .then(res => setLeaveTypes(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetchApprovedLeaves();
        fetchPendingLeaves();
    }, []);

    const fetchApprovedLeaves = async () => {
        try {
            const res = await axios.get("http://localhost:5000/auth/get_approved_leaves");
            setApprovedLeaves(res.data);
        } catch (error) {
            console.error("Error fetching approved leaves:", error);
        }
    };

    const fetchPendingLeaves = async () => {
        try {
            const res = await axios.get("http://localhost:5000/auth/get_pending_leaves");
            setPendingLeaves(res.data);
        } catch (error) {
            console.error("Error fetching pending leaves:", error);
        }
    };

    const sendNotification = async (email, message) => {
        await axios.post("http://localhost:5000/auth/add_notification", { email, message });
    };

    const handleApprove = async (leave) => {
        try {
            await axios.post(`http://localhost:5000/auth/approve_leave/${leave.id}`);
            setMessage("Leave approved successfully!");
            setMessageType("success");
            fetchApprovedLeaves();
            fetchPendingLeaves();
            const employeeEmail = leave.email;
            await sendNotification(employeeEmail, "Your leave request has been approved.");

        } catch (error) {
            console.error("Approval failed:", error);
            setMessage("Failed to approve leave");
            setMessageType("error");
        }
    };

    const handleReject = async (leave) => {
        try {
            await axios.post(`http://localhost:5000/auth/reject_leave/${leave.id}`);
            setMessage("Leave rejected successfully!");
            setMessageType("success");
            fetchPendingLeaves();
            const employeeEmail = leave.email;
            await sendNotification(employeeEmail, "Your leave request has been rejected.");
        } catch (error) {
            console.error("Rejecting failed:", error);
            setMessage("Failed to reject leave");
            setMessageType("error");
        }
    };


    const addEmployee = () => setSelectedPage("AddEmployee");
    const addDepartment = () => setSelectedPage("AddDepartment");
    const addLeaveType = () => setSelectedPage("AddLeaveType");

    // Map string names to actual functions
    const actions = {
        addEmployee,
        addDepartment,
        addLeaveType,
    };

    const DashboardCard = ({ title, count, iconClass, actionText, actionLink, actions }) => {

        const handleActionClick = (e) => {
            e.preventDefault();
            if (actions && typeof actions[actionLink] === "function") {
                actions[actionLink](); // Trigger the corresponding action
            }
        };

        return (
            <div className="card shadow-sm rounded-4 p-2 ps-3 pe-3 d-flex flex-row align-items-center justify-content-between me-3" style={{ minWidth: '220px', backgroundColor: title === "New Applications" ? '#dbeafe' : 'white', }}>
                <div>
                    <div className="text-muted fw-semibold">{title}</div>
                    <div className="fs-3 fw-bold">{count}</div>
                </div>
                <div className="text-end">
                    <i className={`bi ${iconClass} fs-2 opacity-50`} style={{ color: "rgb(37, 73, 106)" }}></i>
                    {actionText && (
                        <div>
                            <button
                                onClick={handleActionClick}
                                className="btn btn-link text-decoration-none text-muted p-0"
                                style={{ fontSize: "12px" }}
                            >
                                {actionText}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
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
            <Header filePath="Admin / " pageName="Dashboard" />

            <div className="d-flex justify-content-between mt-4">
                <DashboardCard
                    title="Staff" count={staff.length} iconClass="bi-people-fill"
                    actionText="Add Employee" actionLink="addEmployee" actions={actions}
                />
                <DashboardCard
                    title="Departments" count={departments.length} iconClass="bi-building"
                    actionText="Add Department" actionLink="addDepartment" actions={actions}
                />
                <DashboardCard
                    title="Leave Types" count={leaveTypes.length} iconClass="bi-tags-fill"
                    actionText="Add Leave Type" actionLink="addLeaveType" actions={actions}
                />
                <DashboardCard
                    title="New Applications" count={pendingLeaves.length} iconClass="bi-envelope-paper"
                    actionText="" actionLink="" actions={actions}
                />
            </div>

            <div className="position-relative">
                <PendingLeavesDisplay pendingLeaves={pendingLeaves} staff={staff} onApprove={handleApprove} onReject={handleReject} />

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

            <LeaveCalendar leaveTypes={leaveTypes} approvedLeaves={approvedLeaves} employees={staff} />

        </div>
    );
};

export default Dashboard;