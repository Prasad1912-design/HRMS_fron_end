import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFileInvoiceDollar,
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaTimes,
  FaWallet,
  FaMinusCircle,
  FaUmbrellaBeach,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function MySalarySlips() {
  const [salarySlips, setSalarySlips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const token = localStorage.getItem("token");

  const getMonthName = (month) => {
    return new Date(2026, month - 1).toLocaleString("default", {
      month: "long",
    });
  };

  const fetchSalarySlips = async () => {
    try {
      setLoading(true);

      const res = await api.get("/emp/getSalarySlips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const slips = res.data?.salarySlips || [];

      slips.sort((a, b) => {
        if (a.payroll?.year !== b.payroll?.year) {
          return b.payroll?.year - a.payroll?.year;
        }
        return b.payroll?.month - a.payroll?.month;
      });

      setSalarySlips(slips);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalarySlips();
  }, []);

const downloadSlip = (slip) => {
  const payroll = slip.payroll;

  const doc = new jsPDF();

  // Header Background
  doc.setFillColor(29, 78, 216);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("SALARY SLIP", 75, 20);

  doc.setFontSize(11);
  doc.text(
    `${getMonthName(payroll.month)} ${payroll.year}`,
    82,
    28
  );

  // Employee Details
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(14);
  doc.text("Employee Information", 14, 50);

  autoTable(doc, {
    startY: 55,
    theme: "grid",
    head: [["Field", "Value"]],
    body: [
      [
        "Employee Name",
        slip.employee?.user?.fullName || "Employee",
      ],
      [
        "Email",
        slip.employee?.user?.email || "-",
      ],
      [
        "Month",
        `${getMonthName(payroll.month)} ${payroll.year}`,
      ],
      [
        "Status",
        payroll.status || "Generated",
      ],
    ],
  });

  // Salary Summary
  doc.setFontSize(14);

  doc.text(
    "Salary Summary",
    14,
    doc.lastAutoTable.finalY + 15
  );

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    theme: "striped",
    head: [["Description", "Amount"]],
    body: [
      [
        "Gross Salary",
        `₹${payroll.grossSalary?.toLocaleString()}`,
      ],
      [
        "Total Deduction",
        `₹${payroll.totalDeduction?.toLocaleString()}`,
      ],
      [
        "Net Salary",
        `₹${payroll.netSalary?.toLocaleString()}`,
      ],
    ],
  });

  // Attendance
  doc.text(
    "Attendance Summary",
    14,
    doc.lastAutoTable.finalY + 15
  );

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Metric", "Days"]],
    body: [
      ["Absent Days", payroll.absentDays],
      ["Half Days", payroll.halfDayCount],
      ["Late Marks", payroll.lateMarkCount],
      ["Holiday Days", payroll.holidayDays],
    ],
  });

  // Leave Summary
  doc.text(
    "Leave Summary",
    14,
    doc.lastAutoTable.finalY + 15
  );

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Leave Type", "Days"]],
    body: [
      ["Paid Leave", payroll.paidLeaveUsed],
      ["Sick Leave", payroll.sickLeaveDays],
      ["Casual Leave", payroll.casualLeaveDays],
      ["Unpaid Leave", payroll.unpaidLeaveDays],
    ],
  });

  // Footer Net Salary Card
  const y = doc.lastAutoTable.finalY + 20;

  doc.setFillColor(219, 234, 254);
  doc.roundedRect(14, y, 180, 25, 3, 3, "F");

  doc.setTextColor(29, 78, 216);
  doc.setFontSize(12);

  doc.text("Final Salary Credited", 20, y + 10);

  doc.setFontSize(18);
  doc.text(
    `₹${payroll.netSalary?.toLocaleString()}`,
    20,
    y + 20
  );

  doc.save(
    `SalarySlip-${getMonthName(payroll.month)}-${payroll.year}.pdf`
  );
};

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FaFileInvoiceDollar />
            My Salary Slips
          </h2>

          <p className="mt-2 text-blue-100">
            View and download all your salary slips.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

        <div className="p-5 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">
            Salary Slip History
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
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>

              {salarySlips.map((s) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      {getMonthName(s.payroll?.month)}
                    </div>
                  </td>

                  <td className="p-4">
                    {s.payroll?.year}
                  </td>

                  <td className="p-4 font-medium">
                    ₹{s.payroll?.grossSalary?.toLocaleString()}
                  </td>

                  <td className="p-4 font-bold text-green-600">
                    ₹{s.payroll?.netSalary?.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Salary Slip Generated
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => setSelectedSlip(s)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaEye />
                        View
                      </button>

                      <button
                        onClick={() => downloadSlip(s)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaDownload />
                        Download
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
              {!loading && salarySlips.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-10 text-gray-500"
                  >
                    No salary slips found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>
      </div>

      {/* SALARY SLIP DETAIL MODAL */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white p-6 flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold">
                  Salary Slip Details
                </h2>

                <p className="text-blue-100 mt-1">
                  {getMonthName(selectedSlip.payroll?.month)}{" "}
                  {selectedSlip.payroll?.year}
                </p>
              </div>

              <button
                onClick={() => setSelectedSlip(null)}
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
                    ₹{selectedSlip.payroll?.grossSalary?.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">
                    Total Deduction
                  </p>

                  <h3 className="text-3xl font-bold text-red-600 mt-2">
                    ₹{selectedSlip.payroll?.totalDeduction?.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <p className="text-gray-500 text-sm">
                    Net Salary
                  </p>

                  <h3 className="text-3xl font-bold text-blue-700 mt-2">
                    ₹{selectedSlip.payroll?.netSalary?.toLocaleString()}
                  </h3>
                </div>

              </div>

              {/* DETAILS */}
              <div className="grid lg:grid-cols-2 gap-6">

                {/* ATTENDANCE */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm">

                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    Attendance Summary
                  </h3>

                  <div className="space-y-3">

                    <Row
                      label="Absent Days"
                      value={selectedSlip.payroll?.absentDays}
                    />

                    <Row
                      label="Half Days"
                      value={selectedSlip.payroll?.halfDayCount}
                    />

                    <Row
                      label="Late Marks"
                      value={selectedSlip.payroll?.lateMarkCount}
                    />

                    <Row
                      label="Holiday Days"
                      value={selectedSlip.payroll?.holidayDays}
                    />

                  </div>

                </div>

                {/* LEAVE SUMMARY */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm">

                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaUmbrellaBeach className="text-green-500" />
                    Leave Summary
                  </h3>

                  <div className="space-y-3">

                    <Row
                      label="Paid Leaves"
                      value={selectedSlip.payroll?.paidLeaveUsed}
                    />

                    <Row
                      label="Sick Leaves"
                      value={selectedSlip.payroll?.sickLeaveDays}
                    />

                    <Row
                      label="Casual Leaves"
                      value={selectedSlip.payroll?.casualLeaveDays}
                    />

                    <Row
                      label="Unpaid Leaves"
                      value={selectedSlip.payroll?.unpaidLeaveDays}
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
                    value={selectedSlip.payroll?.halfDayDeductionDays}
                  />

                  <Row
                    label="Late Mark Deduction Days"
                    value={selectedSlip.payroll?.lateMarkDeductionDays}
                  />

                  <Row
                    label="Total Deduction Days"
                    value={selectedSlip.payroll?.totalDeductionDays}
                  />

                  <Row
                    label="Per Day Salary"
                    value={`₹${selectedSlip.payroll?.perDaySalary}`}
                  />

                </div>

              </div>

              {/* FINAL SALARY */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">

                <div className="flex items-center gap-3">
                  <FaWallet className="text-blue-700 text-xl" />

                  <div>
                    <p className="text-gray-500 text-sm">
                      Salary Slip Amount
                    </p>

                    <h2 className="text-3xl font-bold text-blue-700">
                      ₹{selectedSlip.payroll?.netSalary?.toLocaleString()}
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