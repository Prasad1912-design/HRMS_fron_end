import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FaPaperPlane,
  FaHistory,
  FaCalendarAlt,
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaUmbrellaBeach,
  FaMoneyBillWave,
  FaNotesMedical,
} from "react-icons/fa";

const EmployeeLeave = () => {
  const [activeTab, setActiveTab] = useState("apply");

  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    isHalfDay: false,
    halfDayType: "",
  });

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/emp/getLeaveBalance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) setLeaveBalance(res.data.leaveBalance);        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load leave data");
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    if (activeTab !== "history") return;

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/emp/getLeaveHistory", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) setLeaveHistory(res.data.leaveHistory);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history");
      }
    };

    fetchHistory();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const res = await api.post("/emp/applyLeave", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res.data);
      if (res.data.success) {
        setSuccess("Leave applied successfully 🎉");
        setForm({
          leaveType: "",
          startDate: "",
          endDate: "",
          reason: "",
          isHalfDay: false,
          halfDayType: "",
        });
      }
      else setError(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Approved")
      return <FaCheckCircle className="text-green-500" />;
    if (status === "Pending")
      return <FaHourglassHalf className="text-yellow-500" />;
    return <FaTimesCircle className="text-red-500" />;
  };

  const getLeaveIcon = (type) => {
    if (type === "Casual Leave")
      return <FaUmbrellaBeach className="text-blue-500" />;
    if (type === "Paid Leave")
      return <FaMoneyBillWave className="text-green-500" />;
    if (type === "Sick Leave")
      return <FaNotesMedical className="text-red-500" />;
    return <FaClipboardList className="text-indigo-500" />;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaCalendarAlt /> Leave Management
        </h1>
        <p className="text-blue-100 mt-1">
          Apply for leave and track your history
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("apply")}
          className={`px-5 py-2 rounded-xl flex items-center gap-2 ${
            activeTab === "apply"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700"
          }`}
        >
          <FaPaperPlane /> Apply Leave
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-2 rounded-xl flex items-center gap-2 ${
            activeTab === "history"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700"
          }`}
        >
          <FaHistory /> History
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-xl flex items-center gap-2">
          <FaCheckCircle /> {success}
        </div>
      )}

      {/* APPLY TAB */}
      {activeTab === "apply" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT FORM (LIKE PHOTO 2 STYLE) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit}>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaPaperPlane /> Apply Leave
            </h2>

            {/* LEAVE TYPE */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                <FaClipboardList className="text-yellow-500" />
                Leave Type
              </label>

              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Leave Type</option>

                {leaveBalance.map((l) => (
                  <option
                    key={l.leaveType}
                    value={l.leaveType}
                  >
                    {l.leaveType}
                  </option>
                ))}
              </select>

            </div>

            {/* DATES */}
            <div className="grid md:grid-cols-2 gap-5 mb-5">

              <div>

                <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                  <FaCalendarAlt className="text-green-600" />
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                  <FaCalendarAlt className="text-red-500" />
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* REASON */}
            <div className="mb-5">

              <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                <FaPaperPlane className="text-blue-600" />
                Reason
              </label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={4}
                placeholder="Enter reason for leave..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* HALF DAY */}
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isHalfDay"
                  checked={form.isHalfDay}
                  onChange={handleChange}
                />
                Half Day
              </label>

              {form.isHalfDay && (
                <select
                  name="halfDayType"
                  value={form.halfDayType}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-xl"
                >
                  <option value="">Select Half</option>
                  <option value="First Half">First Half</option>
                  <option value="Second Half">Second Half</option>
                </select>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() =>
                  setForm({
                    leaveType: "",
                    startDate: "",
                    endDate: "",
                    reason: "",
                    isHalfDay: false,
                    halfDayType: "",
                  })
                }
                className="px-5 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                <FaPaperPlane />

                {loading
                  ? "Submitting..."
                  : "Apply Leave"}
              </button>

            </div>
          </form>
          </div>
          </div>

          {/* RIGHT SIDE (LIKE LIVE PREVIEW STYLE) */}
          <div className="space-y-4">

            <div className="bg-white p-5 rounded-3xl shadow">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FaClipboardList /> Leave Balance
              </h3>

              {leaveBalance.map((l) => (
                <div
                  key={l.leaveType}
                  className="p-4 border rounded-xl mb-3"
                >
                  <div className="flex items-center gap-2">
                    {getLeaveIcon(l.leaveType)}
                    <p className="font-semibold">{l.leaveType}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Allocated: {l.allocated}
                  </p>
                  <p className="text-sm text-green-600">
                    Remaining: {l.remaining}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* HISTORY */}
      {/* HISTORY */}
{activeTab === "history" && (
  <div className="space-y-5">

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <FaHistory className="text-blue-600" />
          Leave History
        </h2>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
          {leaveHistory.length} Applications
        </span>

      </div>

      {leaveHistory.length === 0 ? (

        <div className="text-center py-16">

          <FaClipboardList className="mx-auto text-6xl text-slate-300 mb-4" />

          <h3 className="text-xl font-semibold text-slate-700">
            No Leave Applications
          </h3>

          <p className="text-slate-500 mt-2">
            Your leave history will appear here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {leaveHistory.map((item) => (

            <div
              key={item._id}
              className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition"
            >

              <div className="flex justify-between items-start mb-4">

                <div className="flex items-center gap-3">

                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">

                    {getLeaveIcon(item.leaveType)}

                  </div>

                  <div>

                    <h3 className="font-bold text-lg text-slate-800">
                      {item.leaveType}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Leave Request
                    </p>

                  </div>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    item.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>

              </div>

              <div className="space-y-3">

                <div className="flex items-center gap-3 text-slate-600">

                  <FaCalendarAlt className="text-blue-500" />

                  <span>
                    {new Date(item.startDate).toLocaleDateString()}
                    {" "}→{" "}
                    {new Date(item.endDate).toLocaleDateString()}
                  </span>

                </div>

                <div className="flex items-start gap-3 text-slate-600">

                  <FaClipboardList className="text-indigo-500 mt-1" />

                  <span>
                    {item.reason || "No reason provided"}
                  </span>

                </div>

                {item.isHalfDay && (
                  <div className="inline-flex bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    Half Day ({item.halfDayType})
                  </div>
                )}

                {item.status === "Rejected" && item.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
                    <p className="text-xs font-semibold text-red-700 mb-1">
                      Rejection Reason
                    </p>

                    <p className="text-sm text-red-600">
                      {item.rejectionReason}
                    </p>
                  </div>
                )}

              </div>

              <div className="border-t mt-5 pt-4 text-xs text-slate-500">

                Applied On:{" "}
                {new Date(item.createdAt).toLocaleDateString()}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>
)}
    </div>
  );
};

export default EmployeeLeave;