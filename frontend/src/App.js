import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";

import AdminPage from "./components/admin/AdminPage";
import Dashboard from "./components/admin/Dashboard";
import AddDepartment from "./components/admin/AddDepartment";
import ManageDepartments from "./components/admin/ManageDepartments";
import AddLeaveType from "./components/admin/AddLeaveType";
import ManageLeaveTypes from "./components/admin/ManageLeaveTypes";
import AddEmployee from "./components/EmployeeInfo";
import ManageEmployees from "./components/admin/ManageEmployees";
import LeaveHistory from "./components/admin/LeaveHistory";
import ChangePassword from "./components/admin/ChangePassword";

import EmployeePage from "./components/employee/EmployeePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>

        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addDep" element={<AddDepartment />} />
        <Route path="/manageDep" element={<ManageDepartments />} />
        <Route path="/addLeaveType" element={<AddLeaveType />} />
        <Route path="/manageLeaveTypes" element={<ManageLeaveTypes />} />
        <Route path="/addEmp" element={<AddEmployee />} />
        <Route path="/manageEmp" element={<ManageEmployees />} />
        <Route path="/leaveHistory" element={<LeaveHistory />} />
        <Route path="/changePass" element={<ChangePassword />} />

        <Route path="/employeePage" element={<EmployeePage />} />
      </Routes>
    </Router>
  );
}

export default App;
