import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const pastelColors = ["#A5D8FF", "#D0BFFF", "#FFD6A5", "#B5F2EA", "#FFC9DE"];

const LeaveSummaryDisplay = ({ leaveSummary }) => {
    const leaveTypes = Object.keys(leaveSummary);

    const scrollRight = () => {
        document.getElementById('scrollContainer').scrollBy({ left: 200, behavior: 'smooth' });
    };

    return (
        <div className="position-relative w-100">
            {/* Scrollable row container */}
            <div
                id="scrollContainer"
                className="d-flex overflow-auto"
                style={{ scrollBehavior: "smooth", gap: "20px", scrollbarWidth: "none" }}
            >
                {leaveTypes.map((type, index) => {
                    const data = leaveSummary[type];
                    const chartData = [
                        { name: "Used", value: data.used },
                        { name: "Remaining", value: data.remaining },
                    ];

                    return (
                        <div
                            key={type}
                            className="d-flex justify-content-between align-items-center shadow-sm rounded bg-white mt-3 mb-3 px-3 py-2"
                            style={{
                                minWidth: "220px",
                                height: "100px",
                                flex: "0 0 auto",
                                borderRadius: "12px",
                            }}
                        >
                            <div>
                                <div className="text-secondary small">Remaining</div>
                                <div className="fw-bold fs-6">{type}</div>
                                <div className="fs-6">{data.remaining} / {data.total}</div>
                            </div>
                            <div style={{ width: "80px", height: "80px" }}>
                                <PieChart width={80} height={80}>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        dataKey="value"
                                        innerRadius={25}
                                        outerRadius={35}
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <Cell fill="#eee" />
                                        <Cell fill={pastelColors[index % pastelColors.length]} />
                                    </Pie>
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize={20}
                                        fontWeight="bold"
                                        fill="#333"
                                    >
                                        {data.remaining}
                                    </text>
                                </PieChart>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scroll Arrow */}
            <div
                className="position-absolute top-50 translate-middle-y"
                style={{
                    right: "0px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: "6px 12px",
                    borderRadius: "50%",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    userSelect: "none",
                }}
                onClick={scrollRight}
            >
                ❯
            </div>
        </div>
    );
};

export default LeaveSummaryDisplay;
