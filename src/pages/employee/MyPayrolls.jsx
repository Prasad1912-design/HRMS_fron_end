import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FaMoneyBillWave,
  FaEye,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
  FaTimes,
  FaWallet,
  FaMinusCircle,
  FaUmbrellaBeach,
  FaClock,
} from "react-icons/fa";

export default function MyPayrolls() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const token = localStorage.getItem("token");

  const getMonthName = (month) => {
    return new Date(2026, month - 1).toLocaleString("default", {
      month: "long",
    });
  };

  const fetchMyPayrolls = async () => {
    try {
      setLoading(true);

      const res = await api.get("/emp/getMyPayrolls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedPayrolls = (res.data?.myPayrolls || []).sort((a, b) => {
        if (a.year !== b.year) {
          return b.year - a.year;
        }
        return b.month - a.month;
      });

      setPayrolls(sortedPayrolls);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPayrolls();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FaMoneyBillWave />
            My Payrolls
          </h2>

          <p className="mt-2 text-green-100">
            View salary history, deductions, leaves and payment details.
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

        <div className="p-5 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">
            Payroll History
          </h3>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Month</th>
                <th className="p-4 text-left">Year</th>
                <th className="p-4 text-left">Gross Salary</th>
                <th className="p-4 text-left">Net Salary</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>

              {payrolls.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-green-50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-500" />
                      {getMonthName(p.month)}
                    </div>
                  </td>

                  <td className="p-4">{p.year}</td>

                  <td className="p-4 font-medium">
                    ₹{p.grossSalary?.toLocaleString()}
                  </td>

                  <td className="p-4 font-bold text-green-600">
                    ₹{p.netSalary?.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {p.status === "Paid" ? (
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        <FaCheckCircle />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                        <FaHourglassHalf />
                        Generated
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedPayroll(p)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 ml-auto transition"
                    >
                      <FaEye />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && payrolls.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-10 text-gray-500"
                  >
                    No payroll history found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>
      </div>

      {/* PAYROLL DETAIL MODAL */}
      {selectedPayroll && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold">
                  Payroll Details
                </h2>

                <p className="text-green-100 mt-1">
                  {getMonthName(selectedPayroll.month)}{" "}
                  {selectedPayroll.year}
                </p>
              </div>

              <button
                onClick={() => setSelectedPayroll(null)}
                className="text-white text-2xl"
              >
                <FaTimes />
              </button>

            </div>

            {/* BODY */}
            <div className="p-6">

              {/* TOP CARDS */}
              <div className="grid md:grid-cols-3 gap-5 mb-6">

                <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">
                    Gross Salary
                  </p>
                  <h3 className="text-3xl font-bold text-green-700 mt-2">
                    ₹{selectedPayroll.grossSalary?.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">
                    Total Deduction
                  </p>
                  <h3 className="text-3xl font-bold text-red-600 mt-2">
                    ₹{selectedPayroll.totalDeduction?.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">
                    Net Salary
                  </p>
                  <h3 className="text-3xl font-bold text-blue-700 mt-2">
                    ₹{selectedPayroll.netSalary?.toLocaleString()}
                  </h3>
                </div>

              </div>

              {/* DETAILS */}
              <div className="grid lg:grid-cols-2 gap-6">

                {/* ATTENDANCE */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm">

                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaClock className="text-indigo-500" />
                    Attendance Summary
                  </h3>

                  <div className="space-y-3">

                    <Row
                      label="Absent Days"
                      value={selectedPayroll.absentDays}
                    />

                    <Row
                      label="Half Days"
                      value={selectedPayroll.halfDayCount}
                    />

                    <Row
                      label="Late Marks"
                      value={selectedPayroll.lateMarkCount}
                    />

                    <Row
                      label="Holiday Days"
                      value={selectedPayroll.holidayDays}
                    />

                  </div>

                </div>

                {/* LEAVES */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm">

                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaUmbrellaBeach className="text-green-500" />
                    Leave Summary
                  </h3>

                  <div className="space-y-3">

                    <Row
                      label="Paid Leaves"
                      value={selectedPayroll.paidLeaveUsed}
                    />

                    <Row
                      label="Sick Leaves"
                      value={selectedPayroll.sickLeaveDays}
                    />

                    <Row
                      label="Casual Leaves"
                      value={selectedPayroll.casualLeaveDays}
                    />

                    <Row
                      label="Unpaid Leaves"
                      value={selectedPayroll.unpaidLeaveDays}
                    />

                  </div>

                </div>

              </div>

              {/* DEDUCTION BREAKDOWN */}
              <div className="mt-6 bg-white border rounded-2xl p-5 shadow-sm">

                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FaMinusCircle className="text-red-500" />
                  Deduction Breakdown
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                  <Row
                    label="Half Day Deduction Days"
                    value={selectedPayroll.halfDayDeductionDays}
                  />

                  <Row
                    label="Late Mark Deduction Days"
                    value={selectedPayroll.lateMarkDeductionDays}
                  />

                  <Row
                    label="Total Deduction Days"
                    value={selectedPayroll.totalDeductionDays}
                  />

                  <Row
                    label="Per Day Salary"
                    value={`₹${selectedPayroll.perDaySalary}`}
                  />

                </div>

              </div>

              {/* FOOTER */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5">

                <div className="flex items-center gap-3">
                  <FaWallet className="text-green-600 text-xl" />

                  <div>
                    <p className="text-gray-500 text-sm">
                      Final Salary Credited
                    </p>

                    <h2 className="text-3xl font-bold text-green-700">
                      ₹{selectedPayroll.netSalary?.toLocaleString()}
                    </h2>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}