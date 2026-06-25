import { useState } from 'react'
import './App.css'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from './pages/auth/login'
import { jwtDecode } from 'jwt-decode';

// Admin Routing
import Dashboard       from "./pages/admin/Dashboard";
import Attendance      from "./pages/admin/Attendance";
import Employees       from "./pages/admin/Employees";
import Holiday         from "./pages/admin/Holiday";
import LeaveRequests   from "./pages/admin/LeaveRequests";
import Payroll         from "./pages/admin/Payroll";
import SalarySlips     from "./pages/admin/SalarySlips";
import AddEmployee     from "./pages/admin/AddEmployee";
import EditEmployee    from "./pages/admin/EditEmployee";
import EmpType         from "./pages/admin/EmployementType";
import AddEmpTypes     from "./pages/admin/AddEmpTypes";
import EditEmpTypes    from "./pages/admin/EditEmpTypes";
import LeavePolicy     from "./pages/admin/LeavePolicies";
import AddLeavePolicy  from "./pages/admin/AddLeavePolicy";
import EditLeavePolicy from './pages/admin/EditLeavePolicy';

// Employee Routing
import ApplyLeave      from "./pages/employee/ApplyLeave";
// import EmpDashboard    from "./pages/employee/Dashboard";
import MyAttendance    from "./pages/employee/MyAttendance";
import MyPayrolls      from "./pages/employee/MyPayrolls";
import MySalarySlips   from "./pages/employee/MySalarySlips";

// Layouts  
import AdminLayout     from "./layouts/AdminLayout";
import EmployeeLayout  from "./layouts/EmployeeLayout";
import ProtectedRoutes from './components/common/ProtectedRoutes';


function App() {

  const token = localStorage.getItem("token");

  let decodedToken = null;

  if(token)
  {
    decodedToken = jwtDecode(token);
  }

  return (
    <>
    <BrowserRouter>
    <Routes>

      {/* Default Route */}
      <Route
        path="/"
        element={token ?
                    (decodedToken.role.toLowerCase()==="admin" ?
                        <Navigate to="/admin/dashboard" />
                    : <Navigate to = "/employee/attendance" />)
                  : <Navigate to="/login" />}
      />

      {/* Login Route */}
      <Route
       path="/login"
       element={<Login />}
      />

      {/* Admin Routes */}
      {/* open the beginning of the adminLayout and wrap all the admin routes inside it */}
      <Route path="/admin" element={
              <ProtectedRoutes allowedRoles="admin">
                <AdminLayout />
              </ProtectedRoutes>}>
        
              <Route
                path="dashboard"
                element={<Dashboard />}
              />
              <Route
                path="employment-types"
                element={<EmpType />}
              />
              <Route
                path="employment-types/add"
                element={<AddEmpTypes />}
              />
              <Route
                path="employment-types/edit/:id"
                element={<EditEmpTypes />}
              />
              <Route
                path="leave-policies"
                element={<LeavePolicy />}
              />
              <Route
                path="leave-policies/add"
                element={<AddLeavePolicy />}
              />
              <Route
                path="leave-policies/edit/:id"
                element={<EditLeavePolicy />}
              />
              <Route
                path="employees/add"
                element={<AddEmployee />}
              />
              <Route
                path="employees/edit/:id"
                element={<EditEmployee />}
              />
              <Route
                path="employees"
                element={<Employees />}
              />
              <Route
                path="holidays"
                element={<Holiday />}
              />
              <Route
                path="leaveRequests"
                element={<LeaveRequests />}
              />
              <Route
                path="payroll"
                element={<Payroll />}
              />
              <Route
                path="salary-slips"
                element={<SalarySlips />}
              />
      </Route>

      {/* Employee Routes */}
      {/* Wrap the all emp routes under Emp Layout */}
      <Route path='/employee' element={
              <ProtectedRoutes allowedRoles="employee">
                  <EmployeeLayout />
              </ProtectedRoutes>}>

                {/* <Route
                  path="dashboard"
                  element={<EmpDashboard />}
                /> */}
                <Route  
                  path="attendance"
                  element={<MyAttendance />}
                />
                <Route
                  path="salary-slips"
                  element={<MySalarySlips />}
                />
                <Route
                  path="payrolls"
                  element={<MyPayrolls />}
                />
                <Route
                  path="apply-leave"
                  element={<ApplyLeave />}
                />
      </Route>

      {/* Redirect to dashboard from wrong url */}
      <Route
        path="*"
        element={
          token ?
            (
              decodedToken.role.toLowerCase()==="admin" ?
              <Navigate to="/admin/dashboard" /> :
              <Navigate to="/employee/attendance" />
            ) : <Navigate to="/login" />
        }
      />

    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
