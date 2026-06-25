import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaPlay,
  FaCheckCircle,
  FaHourglassHalf,
  FaWallet,
  FaDownload,
  FaCreditCard,
} from "react-icons/fa";

export default function Payroll() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const token = localStorage.getItem("token");

  // ================= FETCH PAYROLL =================
  const fetchPayrolls = async (m = month, y = year) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/auth/getAllPayroll?month=${m}&year=${y}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data?.payrolls);

      setPayrolls(res.data?.payrolls || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  // ================= GENERATE PAYROLL =================
  const handleGenerate = async () => {
    try {
      setGenerating(true);

      await api.post(
        "/auth/runPayroll",
        { month, year },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPayrolls(month, year);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setGenerating(false);
    }
  };

  // ================= MARK AS PAID =================
  const handlePay = async (id) => {
    try {
      setPayingId(id);

      await api.put(
        `/auth/payPayroll/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPayrolls();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaMoneyBillWave className="text-green-600" />
            Payroll Management
          </h2>
          <p className="text-gray-500 text-sm">
            Generate and manage employee salaries
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">

          <select
            className="border px-3 py-2 rounded-lg"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
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
            className="border px-3 py-2 rounded-lg w-24"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlay />
            {generating ? "Generating..." : "Generate Payroll"}
          </button>

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Gross</th>
              <th className="p-3">Deductions</th>
              <th className="p-3">Net Salary</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>

            {payrolls.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-medium">
                  {p.employee?.user?.fullName}
                  <div className="text-xs text-gray-500">
                    {p.employee?.user?.email}
                  </div>
                </td>

                <td className="p-3">₹{p.grossSalary}</td>

                <td className="p-3 text-red-500">
                  ₹{p.totalDeduction}
                </td>

                <td className="p-3 font-semibold text-green-600">
                  ₹{p.netSalary}
                </td>

                <td className="p-3">
                  {p.status === "Paid" ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <FaCheckCircle /> Paid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <FaHourglassHalf /> Generated
                    </span>
                  )}
                </td>

                <td className="p-3 text-right flex justify-end gap-2">

                  {p.status === "Generated" && (
                    <button
                      onClick={() => handlePay(p._id)}
                      disabled={payingId === p._id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <FaWallet />
                      Pay
                    </button>
                  )}

                  {p.status === "Paid" && (
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg flex items-center gap-1">
                      <FaCreditCard />
                      Paid
                    </button>
                  )}

                </td>

              </tr>
            ))}

            {!loading && payrolls.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No payroll found for selected month
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}