const express = require("express");
const { firstTimeLogin, login} = require("../controllers/loginPage");
const {addDepartment, getDepartments, deleteDepartment, updateDepartment} = require("../controllers/departments");
const {addLeaveType, getLeaveTypes, deleteLeaveType, updateLeaveType} = require("../controllers/leaveTypes");
const {addEmployee, getEmployees, getEmployee, deleteEmployee, updateEmployee} = require("../controllers/employees");
const {changePassword} = require("../controllers/changePassword");
const {applyLeave, getUserApprovedLeaves, getUserLeaves, deleteLeave, updateLeave, getUserPendingLeaves, getApprovedLeaves, getPendingLeaves, approveLeave, rejectLeave, getLeaves} = require("../controllers/manageLeaves");
const {addNotification, getNotifications, markRead} = require("../controllers/notifications");

const router = express.Router();

router.post("/first-time-login", firstTimeLogin);
router.post("/login", login);

router.post("/add_department", addDepartment);
router.get("/get_departments", getDepartments);
router.delete("/delete_department/:id", deleteDepartment);
router.post("/update_department/:id", updateDepartment);

router.post("/add_leave_type", addLeaveType);
router.get("/get_leave_types", getLeaveTypes);
router.delete("/delete_leave_type/:id", deleteLeaveType);
router.post("/update_leave_type/:id", updateLeaveType);

router.post("/add_employee", addEmployee);
router.get("/get_employees", getEmployees);
router.get("/get_employee/:userEmail", getEmployee);
router.delete("/delete_employee/:id", deleteEmployee);
router.post("/update_employee/:empId", updateEmployee);

router.post("/change_password", changePassword);

router.post("/apply_leave", applyLeave);
router.get("/get_user_approved_leaves/:userEmail", getUserApprovedLeaves);
router.get("/get_leaves/:userEmail", getUserLeaves);
router.delete("/delete_leave/:id", deleteLeave);
router.post("/update_leave/:leaveId", updateLeave);
router.get("/get_user_pending_leaves/:userEmail", getUserPendingLeaves);
router.get("/get_approved_leaves", getApprovedLeaves);
router.get("/get_pending_leaves", getPendingLeaves);
router.post("/approve_leave/:leaveId", approveLeave);
router.post("/reject_leave/:leaveId", rejectLeave);
router.get("/get_leaves", getLeaves);

router.post("/add_notification", addNotification);
router.get("/get_notifications/:userEmail", getNotifications);
router.post("/mark_as_read/:id", markRead);

module.exports = router;