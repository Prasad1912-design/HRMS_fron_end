import React, { useEffect, useState } from "react";
import api from "../../api/axios"

import {
  FaUsers,
  FaUserCheck,
  FaCalendarAlt,
  FaMoneyCheckAlt
} from "react-icons/fa";

const Dashboard = () => {

  const [leaveReq, setLeaveRequest] = useState([]);
  const [getHoliday, setHoliday] = useState([]);
  const [getPayroll, setPayroll] = useState([]);

  useEffect(()=>{

    const getLevereqSummary = async () =>{
      try
      {
        const response = await api.get("/auth/getAllLeaveRequests",{headers : {Authorization : `Bearer ${localStorage.getItem("token")}`}});
        if(response.data.success)
          {         
            setLeaveRequest(response.data.allLeaveRequests);
          }       
      }
      catch(err)
      {
        console.log(err.response?.data?.message || "Something went wrong");
      }
    }

    const getUpCommingHolidays = async () =>{
      try{
        const getHoliday = await api.get("/auth/getUpcomingHolidays",{headers : {Authorization : `Bearer ${localStorage.getItem("token")}`}});
        if(getHoliday.data.success)
        {
          setHoliday(getHoliday.data.upcomingHolidays);
        }
      }
      catch(err)
      {
        console.log(err.response?.data?.message || "Something went wrong");
      }

    }

    const getRecentPayroll = async () =>{
      try{
        const response = await api.get("/auth/getPayrolls",{headers : {Authorization : `Bearer ${localStorage.getItem("token")}`}})
        if(response.data.success)
        {
          console.log(response.data);
          setPayroll(response.data.payrolls);
        }
      }
      catch(err)
      {
        console.log(err.response?.data?.message);
      }
    }

    getLevereqSummary();
    getUpCommingHolidays();
    getRecentPayroll();
  },[])


  
  return (
    <div className="p-6 bg-slate-100 min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome Back, Admin
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your organization efficiently
        </p>
      </div>


      {/* Leave Requests & Holidays */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Recent Leave Requests
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 text-slate-600">
                  Employee
                </th>

                <th className="text-left py-3 text-slate-600">
                  Type
                </th>

                <th className="text-left py-3 text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {leaveReq.map((leave)=>(          

                    <tr key={leave._id} className="border-b border-slate-100">
                      <td className="py-3">
                        {leave.employeeName}
                      </td>

                      <td>
                        {leave.leaveType}
                      </td>
                      {leave.status.toLowerCase() === "pending" ?
                            <td className="text-yellow-600 font-medium">{leave.status}</td>
                            : leave.status.toLowerCase() === "approved" ? <td className="text-blue-600 font-medium">
                        {leave.status}
                      </td> : <td className="text-red-600 font-medium">{leave.status}</td>}
                      
                    </tr>
               ))}

            </tbody>

          </table>

        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Upcoming Holidays
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 text-slate-600">
                  Holiday
                </th>

                <th className="text-left py-3 text-slate-600">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {getHoliday.map((holiday)=>(
                
                <tr key={holiday._id} className="border-b border-slate-100">
                  <td className="py-3">
                    {holiday.title}
                  </td>

                  <td>
                    {new Date(holiday.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Recent Payroll Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8">

        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Recent Payroll Activity
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-200">

              <th className="text-left py-3 text-slate-600">
                Employee
              </th>

              <th className="text-left py-3 text-slate-600">
                Month
              </th>

              <th className="text-left py-3 text-slate-600">
                Status
              </th>

            </tr>
          </thead>

          <tbody>
            {getPayroll.map((payroll)=>(           

                <tr key = {payroll._id} className="border-b border-slate-100">
                  <td className="py-3">
                    {payroll.employee.user.fullName}
                  </td>

                  <td>
                    {new Date(0, payroll.month - 1).toLocaleString("en-US", {
                      month: "long",
                    })}{" "}
                    {payroll.year}
                  </td>

                  <td className="text-green-600 font-medium">
                    {payroll.status}
                  </td>
                </tr>
          ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Dashboard;