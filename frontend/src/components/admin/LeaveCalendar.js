import React, { useMemo, useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import './LeaveCalendar.css';

const AdminLeaveCalendar = ({ leaveTypes, approvedLeaves, employees }) => {
    const calendarRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState("");

    const pastelColors = [
        "#FFC9DE", "#cdeac0", "#A5D8FF",
        "#FFD6A5", "#D0BFFF", "#fff1c1"
    ];

    const getRandomPastelColor = (usedColors) => {
        let color;
        do {
            const hue = Math.floor(Math.random() * 360);
            color = `hsl(${hue}, 70%, 85%)`;
        } while (usedColors.has(color));
        usedColors.add(color);
        return color;
    };

    const colorMap = useMemo(() => {
        const map = {};
        const usedColors = new Set();
        leaveTypes.forEach((type, index) => {
            const key = type.leave_type;
            if (!map[key]) {
                map[key] = pastelColors[index] || getRandomPastelColor(usedColors);
            }
        });
        return map;
    }, [JSON.stringify(leaveTypes)]);

    // Find employee name using email
    const getEmployeeName = (email) => {
        const emp = employees.find(e => e.email === email);
        return emp ? `${emp.first_name} ${emp.last_name}` : email;
    };

    const events = useMemo(() => {
        return approvedLeaves.map((leave) => ({
            title:
                leave.leave_method === "Full Day"
                    ? getEmployeeName(leave.email)
                    : `${getEmployeeName(leave.email)}\n${leave.leave_method === "Half Day (1st half)" ? "(1st Half)" : "(2nd Half)"}`, // 👈 Show only 1st half or 2nd half
            start: leave.from_date,
            end: leave.to_date,
            allDay: true,
            backgroundColor: colorMap[leave.leave_type],
            borderColor: colorMap[leave.leave_type],
            textColor: '#222',
        }));
    }, [approvedLeaves, colorMap, employees]);

    const handleDateChange = () => {
        const calendarApi = calendarRef.current.getApi();
        const date = calendarApi.getDate();
        const options = { month: 'long', year: 'numeric' };
        setCurrentMonth(date.toLocaleDateString('en-US', options));
    };

    useEffect(() => {
        handleDateChange();
    }, []);

    return (
        <div className="shadow-lg rounded-4 mt-3 p-3 ps-4">
            <h6 className="text-secondary fw-bold mb-4">Leave Calendar</h6>

            {/* Custom Toolbar */}
            <div className="d-flex mb-3 flex-wrap  justify-content-between align-items-center">
                <div className="d-flex align-items-center mb-2 ">
                    <button
                        className="btn btn-outline-secondary me-2"
                        style={{ padding: "2px 6px", fontSize: "0.6rem" }}
                        onClick={() => {
                            calendarRef.current.getApi().prev();
                            handleDateChange();
                        }}
                    >
                        &lt;
                    </button>
                    <span className="fw-bold" style={{ fontSize: "0.8rem" }}>{currentMonth}</span>
                    <button
                        className="btn btn-outline-secondary ms-2"
                        style={{ padding: "2px 6px", fontSize: "0.6rem" }}
                        onClick={() => {
                            calendarRef.current.getApi().next();
                            handleDateChange();
                        }}
                    >
                        &gt;
                    </button>
                </div>

                {/* Legends */}
                <div className="d-flex">
                    {leaveTypes.map((type, idx) => (
                        <div key={idx} className="d-flex align-items-center">
                            <span
                                className="rounded-circle d-inline-block me-2"
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: colorMap[type.leave_type],
                                    transition: "none",
                                    opacity: 1
                                }}
                            ></span>
                            <small className="text-secondary me-4" style={{ fontSize: "0.7rem" }}>{type.leave_type}</small>
                        </div>
                    ))}

                </div>
            </div>

            <div className='admin-calendar' style={{ maxWidth: '860px' }}>
                <FullCalendar
                    key={events.length}
                    ref={calendarRef}
                    plugins={[dayGridPlugin]}
                    fixedWeekCount={false}
                    firstDay={1}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                    headerToolbar={false}
                    eventDisplay="block" // 🟩 Show events as blocks
                />
            </div>

        </div>
    );
};

export default AdminLeaveCalendar;
