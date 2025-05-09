import React, { useEffect, useState } from 'react';
import Header from "../Header";
import axios from 'axios';
import { getRemainingLeaves } from "../../utils/leaveUtils";
import LeaveSummaryDisplay from "./LeaveSummaryDisplay";
import PendingLeavesDisplay from "./PendingLeavesDisplay";
import LeaveCalendar from "./LeaveCalendar";

const Dashboard = ({ setSelectedPage, setLeaveData, setIsEditMode, userEmail }) => {

    const applyLeave = () => {
        setSelectedPage("ApplyLeave");
    };

    const leaveHistory = () => {
        setSelectedPage("LeaveHistory");
    };

    const [leaveSummary, setLeaveSummary] = useState({});
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [approvedLeaves, setApprovedLeaves] = useState([]);

    useEffect(() => {
        const fetchLeaveSummary = async () => {
            try {
                const res = await axios.get("http://localhost:5000/auth/get_leave_types");
                setLeaveTypes(res.data);

                const leavesRes = await axios.get(`http://localhost:5000/auth/get_user_approved_leaves/${userEmail}`); // Update API path
                setApprovedLeaves(leavesRes.data);

                const summary = await getRemainingLeaves(leaveTypes, approvedLeaves);
                setLeaveSummary(summary);
            } catch (err) {
                console.error("ApplyLeavePage - error fetching leave data", err);
            }
        };

        fetchLeaveSummary();
    }, [leaveTypes, approvedLeaves]);

    return (
        <div className="px-3" >
            <Header filePath="Employee /" pageName="Dashboard" userEmail={userEmail} />
            <div className="d-flex justify-content-between align-items-center mt-4 shadow-lg rounded-2 p-2 ps-4 pe-4">
                <div><span className="fw-bold text-secondary">Leave</span></div>
                <div>
                    <button className="btn rounded-3 text-white me-3"
                        style={{ width: "110px", backgroundColor: "rgb(37, 79, 118)", fontSize: 13 }}
                        onClick={applyLeave}
                    >Apply Leave</button>
                    <button className="btn rounded-3 text-white"
                        style={{ width: "110px", backgroundColor: "rgb(37, 79, 118)", fontSize: 13 }}
                        onClick={leaveHistory}
                    >Leave History</button>
                </div>
            </div>
            <LeaveSummaryDisplay leaveSummary={leaveSummary} />

            <div className='d-flex justify-content-between mt-0'>
                <PendingLeavesDisplay
                    setSelectedPage={setSelectedPage}
                    setLeaveData={setLeaveData}
                    setIsEditMode={setIsEditMode}
                    leaveTypes={leaveTypes}
                    userEmail={userEmail} />
                <div className='flex-grow shadow-lg w-50 shadow-lg rounded-2 mt-0'>
                    <LeaveCalendar leaveTypes={leaveTypes} approvedLeaves={approvedLeaves} />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;