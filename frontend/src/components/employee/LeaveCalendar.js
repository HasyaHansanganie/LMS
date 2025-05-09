import React, { useRef, useState, useEffect, useMemo } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './LeaveCalendar.css';

const LeaveCalendar = ({ leaveTypes, approvedLeaves }) => {
    const calendarRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState("");

    const pastelColors = [
        "#FFC9DE", // soft pink
        "#cdeac0", // light green
        "#A5D8FF", // pastel blue
        "#FFD6A5", // soft peach
        "#D0BFFF", // lavender
        "#fff1c1", // soft yellow
    ];

    // Generate a pastel color in HSL format
    const getRandomPastelColor = (usedColors) => {
        let color;
        do {
            const hue = Math.floor(Math.random() * 360);
            color = `hsl(${hue}, 70%, 85%)`;
        } while (usedColors.has(color));
        usedColors.add(color);
        return color;
    };

    // Generate and memoize the color map once per leave type list
    const colorMap = useMemo(() => {
        const map = {};
        const usedColors = new Set();

        leaveTypes.forEach((type, index) => {
            const key = type.leave_type;
            if (!map[key]) {
                if (index < pastelColors.length) {
                    map[key] = pastelColors[index];
                    usedColors.add(pastelColors[index]);
                } else {
                    map[key] = getRandomPastelColor(usedColors);
                }
            }
        });

        return map;
    }, [JSON.stringify(leaveTypes)]);

    const events = useMemo(() => {
        return approvedLeaves.map((leave) => ({
          title: leave.leave_type,
          start: leave.from_date, // Already in "YYYY-MM-DD"
          end: leave.to_date,     // Already in "YYYY-MM-DD"
          allDay: true,
          backgroundColor: colorMap[leave.leave_type],
          borderColor: colorMap[leave.leave_type],
          display: 'block'
        }));
      }, [approvedLeaves, colorMap]);
      
      

    function parseLocalDate(str) {
        const [year, month, day] = str.split("-").map(Number);
        return new Date(year, month - 1, day);
      }
      



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
        <div className="p-3 ps-4 pe-4">
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
                <div className="d-grid ms-2" style={{ gridTemplateColumns: "repeat(3, auto)", gap: "0.25rem 1rem" }}>
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
                            <small className="text-secondary" style={{ fontSize: "0.7rem" }}>{type.leave_type}</small>
                        </div>
                    ))}

                </div>
            </div>


            <div className="employee-calendar calendar-wrapper">
                <FullCalendar
                    key={events.length} // 👈 This will re-init when events change
                    firstDay={1}
                    fixedWeekCount={false}
                    ref={calendarRef}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                    aspectRatio={1.4}
                    headerToolbar={false}
                    eventDisplay="none"
                    dayCellDidMount={(info) => {
                        const cellDateStr = info.date.getFullYear() + '-' +
                    String(info.date.getMonth() + 1).padStart(2, '0') + '-' +
                    String(info.date.getDate()).padStart(2, '0');
                      
                        const matchingLeave = approvedLeaves.find((leave) => {
                            const start = parseLocalDate(leave.from_date);
                            const end = parseLocalDate(leave.to_date);
                            const cell = parseLocalDate(cellDateStr);
                      
                          return cell >= start && cell <= end;
                        });
                      
                        if (matchingLeave) {
                          const frameEl = info.el.querySelector(".fc-daygrid-day-frame");
                          const numberEl = frameEl?.querySelector(".fc-daygrid-day-number");

                          if (frameEl) {
                            frameEl.style.position = "relative";
                            frameEl.style.overflow = "hidden";
                      
                            if (numberEl) {
                                numberEl.style.position = "relative";
                                numberEl.style.zIndex = "2";
                              }

                            const color = colorMap[matchingLeave.leave_type] || "#CCE5FF";
                            const method = matchingLeave.leave_method;
                      
                            const leftHalf = document.createElement("div");
                            leftHalf.style.position = "absolute";
                            leftHalf.style.top = "0";
                            leftHalf.style.left = "0";
                            leftHalf.style.width = "50%";
                            leftHalf.style.height = "100%";
                            leftHalf.style.backgroundColor = color;
                            leftHalf.style.borderRadius = "8px 0 0 8px";
                            leftHalf.style.zIndex = "1";
                      
                            const rightHalf = document.createElement("div");
                            rightHalf.style.position = "absolute";
                            rightHalf.style.top = "0";
                            rightHalf.style.left = "50%";
                            rightHalf.style.width = "50%";
                            rightHalf.style.height = "100%";
                            rightHalf.style.backgroundColor = color;
                            rightHalf.style.borderRadius = "0 8px 8px 0";
                            rightHalf.style.zIndex = "1";
                      
                            if (method === "Half Day (1st half)") {
                              frameEl.appendChild(leftHalf);
                            } else if (method === "Half Day (2nd half)") {
                              frameEl.appendChild(rightHalf);
                            } else {
                              // Full day
                              const full = document.createElement("div");
                              full.style.position = "absolute";
                              full.style.top = "0";
                              full.style.left = "0";
                              full.style.width = "100%";
                              full.style.height = "100%";
                              full.style.backgroundColor = color;
                              full.style.borderRadius = "8px";
                              full.style.zIndex = "1";
                              frameEl.appendChild(full);
                            }
                          }
                        }
                      }}
                />
            </div>
        </div>
    );
};

export default LeaveCalendar;
