import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBriefcase,
} from "react-icons/fa";

const EmploymentTypes = () => {

  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(()=>{
    const getAllData = async () =>{    
      try{
        const token = localStorage.getItem("token");
        const response = await api.get("/auth/getAllEmpTypes",{headers : {Authorization : `Bearer ${token}`}});
        if(response.data.success)
        {
          setEmploymentTypes(response.data.empTypes);
        }
      }
      catch(err)
      {
        setError(err.response?.data?.message || "Something Went Wrong");
      }
    }
    getAllData();

  });

  const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(
      `/auth/deleteEmpType/${selectedEmploymentType._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if(response.data.success)
    {
      setEmploymentTypes((prev) =>
        prev.filter(
          (item) =>
            item._id !== selectedEmploymentType._id
        )
      );

      setSuccessMessage(response.data.message);

      setTimeout(()=>{setSuccessMessage("")},3000);
    }



    setShowDeleteModal(false);
    setSelectedEmploymentType(null);

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to delete employment type"
    );
  }
};


  const [search, setSearch] = useState("");

  const filteredTypes = employmentTypes.filter((type) =>
    type.name.toLowerCase().includes(search.toLowerCase())
  );

  const getBadgeColor = (name) => {
    switch (name) {
      case "Full Time":
        return "bg-blue-100 text-blue-700";
      case "Part Time":
        return "bg-green-100 text-green-700";
      case "Intern":
        return "bg-yellow-100 text-yellow-700";
      case "Contract":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {
        error && (
          <div className="mb-5 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )
      }

       {
        successMessage && (
          <div className="mb-5 bg-green-100 border border-red-200 text-green-700 px-4 py-3 rounded-xl">
            {successMessage}
          </div>
        )
      }

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Employment Types
          </h1>

          <p className="text-slate-500 mt-1">
            Manage employee employment categories
          </p>
        </div>

        <Link
          to="/admin/employment-types/add"
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition"
        >
          <FaPlus />
          Add Employment Type
        </Link>

      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">

        <div className="relative">

          <FaSearch className="absolute left-4 top-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search Employment Type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Employment Type
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Description
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Status
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {filteredTypes.map((type) => (

              <tr
                key={type._id}
                className="hover:bg-slate-50 transition"
              >

                {/* Employment Type */}
                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <FaBriefcase />
                    </div>

                    <div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                          type.name
                        )}`}
                      >
                        {type.name}
                      </span>

                    </div>

                  </div>

                </td>

                {/* Description */}
                <td className="px-6 py-5 text-slate-700">
                  {type.description}
                </td>

                {/* Status */}
                <td className="px-6 py-5">

                  <span
                    className={
                      type.status === "Active"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium"
                    }
                  >
                    {type.status}
                  </span>

                </td>

                {/* Actions */}
                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Link
                      to={`/admin/employment-types/edit/${type._id}`}
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition"
                    >
                      <FaEdit />
                    </Link>

                    <button
                    onClick={() => {
                        setSelectedEmploymentType(type);
                        setShowDeleteModal(true);
                      }}
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
      {
  showDeleteModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-xl font-bold text-slate-800">
          Delete Employment Type
        </h2>

        <p className="text-slate-500 mt-3">
          Are you sure you want to delete
          <span className="font-semibold text-slate-700">
            {" "}
            {selectedEmploymentType?.name}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedEmploymentType(null);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Yes, Delete
          </button>

        </div>

      </div>

    </div>
  )
}

    </div>
  );
};

export default EmploymentTypes;