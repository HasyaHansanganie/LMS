import dayjs from "dayjs";

export const getRemainingLeaves = async (leaveTypes, approvedLeaves) => {
    try {

        // Calculate remaining leaves
        const summary = {};

        leaveTypes.forEach(type => {
            summary[type.leave_type] = {
                total: type.leave_count,
                used: 0,
                remaining: type.leave_count,
                description: type.description
            };
        });

        approvedLeaves.forEach(leave => {
            let usedDays = 0;

            if (leave.leave_method === "Full Day") {
                const start = dayjs(leave.from_date);
                const end = dayjs(leave.to_date);
                usedDays = end.diff(start, "day") + 1;
            } else if (
                leave.leave_method === "Half Day (1st half)" ||
                leave.leave_method === "Half Day (2nd half)"
            ) {
                usedDays = 0.5;
            }

            if (summary[leave.leave_type]) {
                summary[leave.leave_type].used += usedDays;
                summary[leave.leave_type].remaining = Math.max(
                    summary[leave.leave_type].total - summary[leave.leave_type].used,
                    0
                );
            }
        });

        return summary;
    } catch (err) {
        console.error("Error in getRemainingLeaves:", err);
        return {};
    }
};
