import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FaFileInvoice,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEye,
  FaTimes,
} from "react-icons/fa";

export default function SalarySlips() {
  const [slips, setSlips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH LIST =================
  const fetchSlips = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/auth/getAllSalarySlips?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSlips(res.data?.slips || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlips();
  }, []);

  // ================= OPEN MODAL =================
  const openSlip = async (id) => {
    try {
      const res = await api.get(`/auth/getSalarySlipById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedSlip(res.data?.slip);
      setViewOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaFileInvoice className="text-purple-600" />
            Salary Slips
          </h2>
          <p className="text-gray-500 text-sm">
            View employee payroll breakdowns
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 bg-white p-3 rounded-xl shadow">

          <select
            className="border px-3 py-2 rounded-lg text-sm"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Year"
            className="border px-3 py-2 rounded-lg w-24"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <button
            onClick={fetchSlips}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Filter
          </button>
        </div>
      </div>

      {/* ================= LIST ================= */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {slips.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition p-5"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start">

                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    <FaUser className="text-purple-500" />
                    {s.employee?.user?.fullName || "Deleted Employee"}
                  </div>
                  <div className="text-xs text-gray-500 ml-6">
                    {s.employee?.user?.email || "N/A"}
                  </div>
                </div>

                <div className="text-green-600 font-bold flex items-center gap-1">
                  <FaMoneyBillWave />
                  ₹{s.payroll?.netSalary || 0}
                </div>
              </div>

              {/* INFO */}
              <div className="mt-4 text-sm text-gray-600">
                <div>Month: {s.payroll?.month}</div>
                <div>Year: {s.payroll?.year}</div>
              </div>

              {/* FOOTER */}
              <div className="mt-4 flex justify-between items-center">

                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <FaCalendarAlt />
                  {new Date(s.generatedAt).toLocaleDateString()}
                </div>

                {/* VIEW BUTTON */}
                <button
                  onClick={() => openSlip(s._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  <FaEye />
                  View
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ================= MODAL ================= */}
      {viewOpen && selectedSlip && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative">

            {/* CLOSE */}
            <button
              onClick={() => setViewOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={18} />
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaFileInvoice className="text-purple-600" />
              Salary Slip Details
            </h2>

            {/* EMPLOYEE */}
            <div className="border-b pb-3 mb-3">
              <p className="font-semibold flex items-center gap-2">
                <FaUser /> {selectedSlip.employee?.user?.fullName}
              </p>
              <p className="text-sm text-gray-500">
                {selectedSlip.employee?.user?.email}
              </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-3 text-sm">

              <div className="p-3 bg-gray-50 rounded-lg">
                Gross Salary: ₹{selectedSlip.payroll?.grossSalary}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg text-red-600">
                Deductions: ₹{selectedSlip.payroll?.totalDeduction}
              </div>

              <div className="p-3 bg-green-50 rounded-lg text-green-700 col-span-2">
                Net Salary: ₹{selectedSlip.payroll?.netSalary}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                Paid Leaves: {selectedSlip.payroll?.paidLeaveUsed}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                Unpaid Leaves: {selectedSlip.payroll?.unpaidLeaveDays}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                Half Days: {selectedSlip.payroll?.halfDayCount}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                Late Marks: {selectedSlip.payroll?.lateMarkCount}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                Month / Year: {selectedSlip.payroll?.month} /{" "}
                {selectedSlip.payroll?.year}
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}