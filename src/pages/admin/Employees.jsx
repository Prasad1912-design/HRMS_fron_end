import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus, FaSearch, FaEdit, FaTrash, FaUserTie, FaBriefcase,
  FaMoneyBillWave, FaCalendarAlt, FaToggleOn
} from "react-icons/fa";
import api from "../../api/axios";

const Employees = () => {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ ADDED
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [search, setSearch] = useState("");
  const [employmentType, setEmploymentType] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/auth/getAllEmployees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setEmployees(response.data.employees);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    const getAllEmpTypes = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/auth/getAllEmpTypes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setEmploymentTypes(response.data.empTypes);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load employees");
      }
    };

    getEmployees();
    getAllEmpTypes();
  }, []);

  // OPEN MODAL
  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  // CLOSE MODAL
  const closeDeleteModal = () => {
    setSelectedEmployee(null);
    setShowDeleteModal(false);
  };

  // DELETE EMPLOYEE
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.delete(
        `/auth/deleteEmployee/${selectedEmployee._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {

        // ✅ SUCCESS MESSAGE ADDED
        setSuccessMessage(response.data.message);

        setEmployees((prev) =>
          prev.filter((emp) => emp._id !== selectedEmployee._id)
        );

        closeDeleteModal();

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete employee");
      closeDeleteModal();
    } finally {
      setDeleteLoading(false);
    }
  };

  // FILTER LOGIC
  const filteredEmployees = employees.filter((employee) => {

    const matchSearch =
      employee.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      employee.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      employee.employeeId?.toLowerCase().includes(search.toLowerCase());

    const matchEmploymentType =
      employmentType === "All" ||
      employee.employmentType?.name === employmentType;

    const matchStatus =
      status === "All" ||
      employee.status?.toLowerCase() === status.toLowerCase();

    return matchSearch && matchEmploymentType && matchStatus;
  });

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* ERROR */}
      {error && (
        <div className="mb-5 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ✅ SUCCESS MESSAGE (ADDED LIKE LEAVE PAGE) */}
      {successMessage && (
        <div className="mb-5 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
          {successMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Employees Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage employee records and workforce
          </p>
        </div>

        <Link
          to="/admin/employees/add"
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition"
        >
          <FaPlus />
          Add Employee
        </Link>

      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-3"
          >
            <option value="All">All Employment Types</option>
            {employmentTypes.map((type) => (
              <option key={type._id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-3"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {filteredEmployees.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FaSearch className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700">
              No Employees Found
            </h3>
            <p className="text-slate-500 mt-2">
              No employees match your current search criteria.
            </p>
          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Employee</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Employment Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Designation</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Joining Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Salary</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredEmployees.map((employee) => (
                <tr key={employee._id} className="hover:bg-slate-50 transition">

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {employee.user?.fullName
                          ?.split(" ")
                          ?.map(word => word[0])
                          ?.join("")}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {employee.user?.fullName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {employee.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {employee.employmentType?.name}
                    </span>
                  </td>

                  <td className="px-6 py-5">{employee.designation}</td>

                  <td className="px-6 py-5">
                    {employee.dateOfJoining
                      ? new Date(employee.dateOfJoining).toLocaleDateString("en-GB")
                      : "-"}
                  </td>

                  <td className="px-6 py-5 font-semibold">
                    ₹{employee.monthlySalary?.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <span className={
                      employee.status === "active"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium"
                    }>
                      {employee.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">

                      <Link
                        to={`/admin/employees/edit/${employee._id}`}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        onClick={() => openDeleteModal(employee)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        <FaTrash />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-bold text-slate-800 mb-3">
              Delete Employee
            </h2>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedEmployee?.user?.fullName}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Employees;