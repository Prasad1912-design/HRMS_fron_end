import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBriefcase,
  FaClipboardList,
  FaUserTie,
  FaInbox
} from "react-icons/fa";

const LeavePolicies = () => {
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/auth/getAllLeavePolicies", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setLeavePolicies(response.data.leavePolicies);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something Went Wrong");
      }
    };

    getAllData();
  }, []);

  const openDeleteModal = (policy) => {
  setSelectedPolicy(policy);
  setShowDeleteModal(true);
};

const closeDeleteModal = () => {
  setSelectedPolicy(null);
  setShowDeleteModal(false);
};

const handleDelete = async () => {
  try {
    setDeleteLoading(true);

    const token = localStorage.getItem("token");

    const response = await api.post(
      `/auth/deleteLeavePolicy/${selectedPolicy._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setSuccessMessage(response.data.message);

      setLeavePolicies((prev) =>
        prev.filter(
          (policy) => policy._id !== selectedPolicy._id
        )
      );

      closeDeleteModal();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to delete leave policy"
    );

    closeDeleteModal();
  } finally {
    setDeleteLoading(false);
  }
};

  // FILTER (FIXED STRUCTURE)
  const filteredPolicies = leavePolicies.filter((item) =>
    item.leaveType.toLowerCase().includes(search.toLowerCase()) ||
    item.employmentType?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* ERROR */}
      {error && (
        <div className="mb-5 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {successMessage && (
        <div className="mb-5 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
          {successMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Leave Policies
          </h1>
          <p className="text-slate-500 mt-1">
            Manage employee leave policies
          </p>
        </div>

        <Link
          to="/admin/leave-policies/add"
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition"
        >
          <FaPlus />
          Add Leave Policy
        </Link>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leave policy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredPolicies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
          <FaInbox className="text-4xl text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-slate-700">
            No Leave Policies Found
          </h2>
          <p className="text-slate-500 mt-2">
            Create your first leave policy to get started
          </p>
        </div>
      ) : (
        /* TABLE */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Employment Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Leave Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Annual Days
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50 transition">

                  {/* Employment Type */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <FaUserTie />
                      </div>
                      <div className="font-medium text-slate-700">
                        {item.employmentType?.name}
                      </div>
                    </div>
                  </td>

                  {/* Leave Type */}
                  <td className="px-6 py-5">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                      <FaClipboardList className="inline mr-1" />
                      {item.leaveType}
                    </span>
                  </td>

                  {/* Annual Days */}
                  <td className="px-6 py-5 text-slate-700 font-medium">
                    {item.annualDays} days
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">

                      <Link
                        to={`/admin/leave-policies/edit/${item._id}`}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        onClick={() => openDeleteModal(item)}
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
        </div>
      )}

      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

      <h2 className="text-xl font-bold text-slate-800 mb-3">
        Delete Leave Policy
      </h2>

      <p className="text-slate-600 mb-6">
        Are you sure you want to delete
        <span className="font-semibold">
          {" "}
          {selectedPolicy?.leaveType}
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
          {deleteLoading
            ? "Deleting..."
            : "Yes, Delete"}
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
};

export default LeavePolicies;