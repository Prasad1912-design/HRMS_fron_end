import React, { useRef, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {

  const emailRef = useRef();
  const passwordRef = useRef();

  const [error,setError] = useState();

  const navigate = useNavigate();

  const handleLogin = async (e) =>{
    e.preventDefault();   
    
    try{

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const response = await api.post("/auth/login",{email,password});
    if(response.data.success)
    {
      localStorage.setItem("token",response.data.token);
      console.log(jwtDecode(response.data.token));
    }
    else
    {
      setError(response.data.message);
    }

    if(response.data.role.toLowerCase()==="admin")
    {
      navigate("/admin/dashboard");
    }
    else
    {
      navigate("/employee/attendance");
    }
  }
  catch(err)
  {
    setError(err.response?.data?.message || "Something went wrong");
  }
  }


  return (
    <div className="min-h-screen flex bg-slate-100">
      
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-10">
        <div className="text-center text-white">
           <h1 className="text-5xl font-bold mb-4">
            Mobicloud Technologies
          </h1>
          <h1 className="text-5xl font-bold mb-4">
            HRMS
          </h1>

          <p className="text-xl">
            Human Resource Management System
          </p>

          <p className="mt-6 text-blue-100">
            Manage Employees, Attendance, Leaves,
            Payroll and Salary Slips efficiently.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              Welcome Back 👋
            </h2>

            <p className="text-slate-500 mt-2">
              Sign in to your account
            </p>
          </div>

          {
            error && (
              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>
            )
          }

          <form className="space-y-5" onSubmit={handleLogin}>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                ref={emailRef}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                ref={passwordRef}
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;