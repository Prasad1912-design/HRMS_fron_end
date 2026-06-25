import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  FaArrowLeft,
  FaBriefcase,
  FaClipboardList,
  FaCalendarCheck,
  FaCalendarAlt,
  FaSave,
  FaInfoCircle,
} from "react-icons/fa";

const AddLeavePolicy = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [employmentTypeId, setEmploymentTypeId] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [annualDays, setAnnualDays] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const leaveTypes = [
    "Casual Leave",
    "Sick Leave",
    "Paid Leave",
    "Unpaid Leave",
  ];

useEffect(() => {

  const loadData = async () => {
    try {

      const token = localStorage.getItem("token");

      // Both APIs parallel
      const [policyResponse, empTypeResponse] = await Promise.all([
        api.post(
          `/auth/getLeavePolicyById/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        api.get(
          "/auth/getAllEmpTypes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      if (empTypeResponse.data.success) {
        setEmploymentTypes(
          empTypeResponse.data.empTypes
        );
      }

      if (policyResponse.data.success) {

        const policy =
          policyResponse.data.leavePolicy;

        setEmploymentTypeId(
          policy.employmentType
        );

        setLeaveType(
          policy.leaveType
        );

        setAnnualDays(
          policy.annualDays
        );
      }

    }
    catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to load data"
      );

    }
  };

  loadData();

}, [id]);
  


const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!employmentTypeId) {
    setError("Please select Employment Type");
    return;
  }

  if (!leaveType) {
    setError("Please select Leave Type");
    return;
  }

  if (!annualDays || annualDays < 0) {
    setError("Please enter valid Annual Days");
    return;
  }

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const response = await api.post(
      `/auth/updateLeavePolicy/${id}`,
      {
        employmentTypeId,
        leaveType,
        annualDays,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setSuccess(response.data.message);

      setTimeout(() => {
        navigate("/admin/leave-policies");
      }, 2000);
    }
  }
  catch (err) {
    setError(
      err.response?.data?.message ||
      "Something went wrong"
    );
  }
  finally {
    setLoading(false);
  }
};

  const selectedEmploymentType =
    employmentTypes.find(
      (item) => item._id === employmentTypeId
    );

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-lg mb-8 text-white">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <h1 className="text-3xl font-bold">
              Leave Policy Management
            </h1>

            <p className="text-blue-100 mt-2">
              Update existing leave policies details.
            </p>
          </div>

          <Link
            to="/admin/leave-policies"
            className="bg-white text-slate-800 px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-100 transition"
          >
            <FaArrowLeft />
            Back to Leave Policies
          </Link>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form Section */}

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Employment Type */}

                <div>

                  <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <FaBriefcase className="text-blue-600" />
                    Employment Type
                  </label>

                  <select
                    value={employmentTypeId}
                    onChange={(e) =>
                      setEmploymentTypeId(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {employmentTypes
                      .filter(
                        (item) =>
                          item.status?.toLowerCase() === "active"
                      )
                      .map((item) => (
                        <option
                          key={item._id}
                          value={item._id}
                        >
                          {item.name}
                        </option>
                      ))}                    
                  </select>

                </div>

                {/* Leave Type */}

                <div>

                  <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                    <FaClipboardList className="text-yellow-500" />
                    Leave Type
                  </label>

                  <select
                    value={leaveType}
                    onChange={(e) =>
                      setLeaveType(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select Leave Type
                    </option>

                    {leaveTypes.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>

                </div>

              </div>

              {/* Annual Days */}

              <div>

                <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                  <FaCalendarAlt className="text-green-600" />
                  Annual Days
                </label>

                <input
                  type="number"
                  min="0"
                  value={annualDays}
                  onChange={(e) =>
                    setAnnualDays(
                      e.target.value
                    )
                  }
                  placeholder="How many days..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3">

                <Link
                  to="/admin/leave-policies"
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
                    : "Update Leave Policy"}
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
                <FaCalendarCheck />
              </div>

              <h4 className="font-bold text-xl text-slate-800">
                {selectedEmploymentType?.name ||
                  "Employment Type"}
              </h4>

              <p className="text-slate-500 mt-2">
                {leaveType ||
                  "Leave Type will appear here"}
              </p>

              <div className="mt-4">

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {annualDays
                    ? `${annualDays} Days / Year`
                    : "Annual Days"}
                </span>

              </div>

            </div>

          </div>

          {/* Notes */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center gap-2 mb-4">

              <FaInfoCircle className="text-blue-600" />

              <h3 className="font-bold text-slate-800">
                Important Notes
              </h3>

            </div>

            <ul className="space-y-3 text-sm text-slate-600">

              <li>
                • Leave policies are linked to Employment Types.
              </li>

              <li>
                • Each Leave Type can be assigned once per Employment Type.
              </li>

              <li>
                • Annual Days define yearly entitlement.
              </li>

              <li>
                • Only active Employment Types can receive Leave Policies.
              </li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddLeavePolicy;