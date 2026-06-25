import React, { useEffect, useRef, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import {
FaArrowLeft,
FaBriefcase,
FaClipboardList,
FaBolt,
FaSave,
FaInfoCircle,
} from "react-icons/fa";

const EditEmpTypes = () => {

const {id} = useParams();

useEffect(()=>{
  const token = localStorage.getItem("token");

  const getData = async () =>{  
    const response = await api.get(`/auth/getEmpTypeById/${id}`,
      {
        headers : { Authorization : `Bearer ${token}`
      }}
    );

    if(response.data.success)
    {
      setName(response.data.empType.name);
      setDescription(response.data.empType.description);
      setStatus(response.data.empType.status);
    }
  }


  getData();
},[id])

const navigate = useNavigate();
const nameRef = useRef();
const descriptionRef = useRef();

const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [status, setStatus] = useState("Active");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();

setError("");
setSuccess("");

const employmentTypeName = nameRef.current.value.trim();
const employmentTypeDescription = descriptionRef.current.value.trim();

if (!employmentTypeName) {
  setError("Employment Type Name is required");
  return;
}


try {
  setLoading(true);

  const token = localStorage.getItem("token");

  const response = await api.put(
    `/auth/updateEmpType/${id}`,
    {
      name: employmentTypeName,
      description: employmentTypeDescription,
      status : status.toLowerCase()
    },
    {
      headers : {
        Authorization : `Bearer ${token}`
      }
    }
  );

  if(response.data.success)
  {
    setSuccess(response.data.message);

    setTimeout(() => {

      nameRef.current.value = "";
      descriptionRef.current.value = "";

      setName("");
      setDescription("");
      setStatus("Active");

      setLoading(false);
      navigate("/admin/employment-types");
    }, 3000);
  }
} catch (err) {
  setLoading(false);

  setError(
    err.response?.data?.message ||
    "Something went wrong"
  );
}
};

return ( <div className="min-h-screen bg-slate-100 p-6">

  {/* Header */}

  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-lg mb-8 text-white">

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

      <div>
        <h1 className="text-3xl font-bold">
          Employment Type Management
        </h1>

        <p className="text-blue-100 mt-2">
          Update employment categories used by Employees,
          Leave Policies and Payroll.
        </p>
      </div>

      <Link
        to="/admin/employment-types"
        className="bg-white text-slate-800 px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-100 transition"
      >
        <FaArrowLeft />
        Back to Employment Types
      </Link>

    </div>

  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Left Side */}

    <div className="lg:col-span-2">

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

        {error && (
          <div className="mb-5 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-5">

            {/* Employment Type */}

            <div>

              <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                <FaBriefcase className="text-blue-600" />
                Employment Type Name
              </label>

              <input
                ref={nameRef}
                type="text"
                placeholder="Full Time"
                onChange={(e) =>
                  setName(e.target.value)
                }
                value={name}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Status */}

            <div>

              <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                <FaBolt className="text-yellow-500" />
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Description */}

          <div>

            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <FaClipboardList className="text-green-600" />
              Description
            </label>

            <textarea
              ref={descriptionRef}
              rows="5"
              placeholder="Describe this employment type..."
              onChange={(e) =>
                setDescription(e.target.value)
              }
              value={description}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3">

            <Link
              to="/admin/employment-types"
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
                ? "Saving..."
                : "Update Employment Type"}
            </button>

          </div>

        </form>

      </div>

    </div>

    {/* Right Side */}

    <div className="space-y-6">

      {/* Live Preview */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

        <h3 className="text-lg font-bold text-slate-800 mb-5">
          Live Preview
        </h3>

        <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">

          <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl mb-4">
            <FaBriefcase />
          </div>

          <h4 className="font-bold text-xl text-slate-800">
            {name || "Employment Type"}
          </h4>

          <p className="text-slate-500 mt-2">
            {description ||
              "Description preview will appear here"}
          </p>

          <div className="mt-4">

            <span
              className={
                status === "Active"
                  ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
              }
            >
              {status}
            </span>

          </div>

        </div>

      </div>

      {/* Information */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

        <div className="flex items-center gap-2 mb-4">

          <FaInfoCircle className="text-blue-600" />

          <h3 className="font-bold text-slate-800">
            Important Notes
          </h3>

        </div>

        <ul className="space-y-3 text-sm text-slate-600">

          <li>
            • Employees are assigned Employment Types.
          </li>

          <li>
            • Leave Policies are linked with Employment Types.
          </li>

          <li>
            • Payroll calculations can depend on Type.
          </li>

          <li>
            • Use short and meaningful names.
          </li>

        </ul>

      </div>

    </div>

  </div>

</div>

);
};

export default EditEmpTypes;
