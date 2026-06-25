import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
FaArrowLeft,
FaUserTie,
FaEnvelope,
FaPhone,
FaLock,
FaBriefcase,
FaMoneyBillWave,
FaCalendarAlt,
FaUserFriends,
FaSave,
} from "react-icons/fa";
import api from "../../api/axios";

const AddEmployee = () => {
const navigate = useNavigate();

const [empTypes, setEmpTypes] = useState([]);
const [employees, setEmployees] = useState([]);

const [loading, setLoading] = useState(false);
const [pageLoading, setPageLoading] = useState(true);

const [error, setError] = useState("");
const [successMessage, setSuccessMessage] = useState("");

const [formData, setFormData] = useState({
fullName: "",
email: "",
password: "",
phoneNumber: "",
designation: "",
monthlySalary: "",
dateOfJoining: "",
employmentType: "",
reportingManager: "",
status: "active",
});

useEffect(() => {
const loadData = async () => {
try {
const token = localStorage.getItem("token");

    const [empTypeRes, employeeRes] = await Promise.all([
      api.get("/auth/getAllEmpTypes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

      api.get("/auth/getAllEmployees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (empTypeRes.data.success) {
      setEmpTypes(empTypeRes.data.empTypes);
    }

    if (employeeRes.data.success) {
      setEmployees(employeeRes.data.employees);
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Failed to load required data"
    );
  } finally {
    setPageLoading(false);
  }
};

loadData();

}, []);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

try {
  setLoading(true);
  setError("");
  setSuccessMessage("");

  const token = localStorage.getItem("token");

  const response = await api.post(
    "/auth/registerNewEmployee",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.data.success) {
    setSuccessMessage(response.data.message);

    setFormData({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      designation: "",
      monthlySalary: "",
      dateOfJoining: "",
      employmentType: "",
      reportingManager: "",
      status: "active",
    });

    setTimeout(() => {
      navigate("/admin/employees");
    }, 1500);
  }
} catch (err) {
  setError(
    err.response?.data?.message ||
      "Failed to create employee"
  );
} finally {
  setLoading(false);
}

};

if (pageLoading) {
return ( <div className="min-h-screen flex items-center justify-center">
Loading... </div>
);
}

return ( <div className="min-h-screen bg-slate-100 p-6">

  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-lg mb-8 text-white">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

    <div>
      <h1 className="text-3xl font-bold">
        Employee Management
      </h1>

      <p className="text-blue-100 mt-2">
        Create a new employee profile and assign employment details.
      </p>
    </div>

    <Link
      to="/admin/employees"
      className="bg-white text-slate-800 px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-100 transition"
    >
      <FaArrowLeft />
      Back to Employees
    </Link>

  </div>

</div>

  {error && (
    <div className="mb-5 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
      {error}
    </div>
  )}

  {successMessage && (
    <div className="mb-5 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
      {successMessage}
    </div>
  )}

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  <div className="lg:col-span-2">

  <form onSubmit={handleSubmit}>
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <div className="relative">
            <FaUserTie className="absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Email
          </label>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-4 text-slate-400" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Password
          </label>

          <div className="relative">
            <FaLock className="absolute left-4 top-4 text-slate-400" />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-xl py-3 pl-11 pr-4"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Phone Number
          </label>

          <div className="relative">
            <FaPhone className="absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full border rounded-xl py-3 pl-11 pr-4"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Designation
          </label>

          <div className="relative">
            <FaBriefcase className="absolute left-4 top-4 text-slate-400" />

            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className="w-full border rounded-xl py-3 pl-11 pr-4"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Monthly Salary
          </label>

          <div className="relative">
            <FaMoneyBillWave className="absolute left-4 top-4 text-slate-400" />

            <input
              type="number"
              name="monthlySalary"
              value={formData.monthlySalary}
              onChange={handleChange}
              required
              className="w-full border rounded-xl py-3 pl-11 pr-4"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Date Of Joining
          </label>

          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-4 text-slate-400" />

            <input
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              required
              className="w-full border rounded-xl py-3 pl-11 pr-4"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Employment Type
          </label>

          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              Select Employment Type
            </option>

            {empTypes.filter((type)=>type.status==="active")
                .map((type) => (
              <option
                key={type._id}
                value={type._id}
              >
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Reporting Manager
          </label>

          <select
            name="reportingManager"
            value={formData.reportingManager}
            onChange={handleChange}
            className="w-full border rounded-xl py-3 px-4"
          >
            <option value="">
              Select Reporting Manager
            </option>

            {employees.filter((emp)=>emp.status === "active" &&
                        emp.designation?.toLowerCase().includes("manager"))
              .map((emp) => (
              <option
                key={emp._id}
                value={emp._id}
              >
                {emp.user?.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-xl py-3 px-4"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        <Link
          to="/admin/employees"
          className="px-5 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
        >
          <FaSave />

          {loading
            ? "Creating Employee..."
            : "Create Employee"}
        </button>

      </div>
      

    </div>
  </form>
  </div>

  <div className="space-y-6">

  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

    <h3 className="text-lg font-bold text-slate-800 mb-5">
      Live Preview
    </h3>

    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">

      <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl mb-4">
        <FaUserTie />
      </div>

      <h4 className="font-bold text-xl text-slate-800">
        {formData.fullName || "Employee Name"}
      </h4>

      <p className="text-slate-500 mt-2">
        {formData.designation || "Designation"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {empTypes.find(
            type => type._id === formData.employmentType
          )?.name || "Employment Type"}
        </span>

        <span
          className={
            formData.status === "active"
              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
              : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
          }
        >
          {formData.status}
        </span>

      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-600">

        <p>
          📧 {formData.email || "Email Address"}
        </p>

        <p>
          📱 {formData.phoneNumber || "Phone Number"}
        </p>

        <p>
          💰 ₹{formData.monthlySalary || "0"}
        </p>

        <p>
          📅 {formData.dateOfJoining || "Joining Date"}
        </p>

      </div>

    </div>

  </div>

  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

  <h3 className="font-bold text-slate-800 mb-4">
    Important Notes
  </h3>

  <ul className="space-y-3 text-sm text-slate-600">

    <li>
      • Employee ID is generated automatically.
    </li>

    <li>
      • Email address must be unique.
    </li>

    <li>
      • Reporting Manager is optional.
    </li>

    <li>
      • Login account is created automatically.
    </li>

    <li>
      • Employment Type controls leave policies and benefits.
    </li>

  </ul>

</div>

</div>
</div>

</div>

);
};

export default AddEmployee;
