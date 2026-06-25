import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaClipboardList,
  FaHistory,
  FaMoneyBillWave,
  FaNotesMedical,
  FaUmbrellaBeach,
  FaClock,
  FaEye,
} from "react-icons/fa";

export default function LeaveRequests() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const [leaveRequests, setLeaveRequests] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(()=>{

    const getAllLeavereq = async () =>{
      try
      {
        const token = localStorage.getItem("token");
        const response = await api.get("/auth/getAllLeaveRequests",
          {
            headers : {
              Authorization : `Bearer ${token}`
            }
          }
        );

        if(response.data.success)
        {
          setLeaveRequests(response.data.allLeaveRequests);
        }
      }
      catch(err)
      {
      }
    }
    getAllLeavereq();
  },[])

  const approveLeave = async (id) => {
  try {
    console.log("Approve Leave Id :", id);

    // Dummy API
    const token = localStorage.getItem("token");

    const response = await api.put(
      `/auth/approveLeaveRequest/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if(response.data.success)
    {
      setLeaveRequests((prev) =>
        prev.map((leave) =>
          leave._id === id
            ? {
                ...leave,
                status: "Approved",
              }
            : leave
        )
      );
  }

  } catch (err) {
    console.log(err);
  }
};

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const rejectLeave = async () => {
  try {
    if (!rejectReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    console.log("Reject Leave Id :", selectedRequest._id);
    console.log("Reason :", rejectReason);

    const token = localStorage.getItem("token");

    const response = await api.put(
      `/auth/rejectLeaveRequest/${selectedRequest._id}`,
      {
        rejectionReason: rejectReason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if(response.data.success)
    {
      setLeaveRequests((prev) =>
        prev.map((leave) =>
          leave._id === selectedRequest._id
      ? {
        ...leave,
        status: "Rejected",
        rejectionReason: rejectReason,
      }
      : leave
    )
  );
}

    setRejectReason("");
    setSelectedRequest(null);
    setShowRejectModal(false);

  } catch (err) {
    console.log(err);
  }
};

  const pendingCount = leaveRequests.filter(
    (l) => l.status === "Pending"
  ).length;

  const approvedCount = leaveRequests.filter(
    (l) => l.status === "Approved"
  ).length;

  const rejectedCount = leaveRequests.filter(
    (l) => l.status === "Rejected"
  ).length;

  const getLeaveIcon = (type) => {
    switch (type) {
      case "Casual Leave":
        return (
          <FaUmbrellaBeach className="text-blue-600 text-xl" />
        );

      case "Sick Leave":
        return (
          <FaNotesMedical className="text-red-600 text-xl" />
        );

      case "Paid Leave":
        return (
          <FaMoneyBillWave className="text-green-600 text-xl" />
        );

      default:
        return (
          <FaClipboardList className="text-indigo-600 text-xl" />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FaCalendarAlt />
          Leave Request Management
        </h1>

        <p className="text-blue-100 mt-2">
          Review, approve and reject employee leave
          requests.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <input
  type="text"
  placeholder="Search employee..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="w-full mb-6 bg-white border rounded-2xl px-4 py-3"
/>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500">
                Pending Requests
              </p>

              <h2 className="text-3xl font-bold text-yellow-600">
                {pendingCount}
              </h2>
            </div>

            <FaClock className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500">
                Approved
              </p>

              <h2 className="text-3xl font-bold text-green-600">
                {approvedCount}
              </h2>
            </div>

            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500">
                Rejected
              </p>

              <h2 className="text-3xl font-bold text-red-600">
                {rejectedCount}
              </h2>
            </div>

            <FaTimesCircle className="text-4xl text-red-500" />
          </div>
        </div>

      </div>

      {/* Requests */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {leaveRequests.filter((leave) =>
            leave.employeeName
              .toLowerCase()
              .includes(search.toLowerCase())
          ).map((leave) => (
          <div
            key={leave._id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition"
          >

            <div className="flex justify-between items-start mb-5">

              <div className="flex items-center gap-4">

                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <FaUser className="text-blue-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {leave.employeeName}
                  </h3>

                  <p className="text-slate-500 text-sm">
                    {leave.email}
                  </p>

                   <p>
                      Designation:
                      <span className="font-medium ml-1">
                        {leave.designation}
                      </span>
                    </p>

                    <p>
                      Employment Type:
                      <span className="font-medium ml-1">
                        {leave.employmentType}
                      </span>
                    </p>
                </div>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  leave.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : leave.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {leave.status}
              </span>

            </div>

            <div className="flex items-center gap-3 mb-4">
              {getLeaveIcon(leave.leaveType)}

              <span className="font-semibold">
                {leave.leaveType}
              </span>

              {leave.isHalfDay && (
                <span className="ml-3 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Half Day ({leave.halfDayType})
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600 mb-5">

              <p>
                <strong>Dates:</strong>{" "}
                  {new Date(
                      leave.startDate
                    ).toLocaleDateString()}{" "}
                    →{" "}
                    {new Date(
                      leave.endDate
                    ).toLocaleDateString()}
              </p>

              <p>
                <strong>Total Days:</strong>{" "}
                {leave.totalDays}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {leave.reason}
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(
                  leave.appliedOn
                ).toLocaleDateString()}
              </p>

            </div>

            {/* Leave Balance */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-5 border">

              <h4 className="font-semibold text-slate-800 mb-3">
                Leave Balance
              </h4>

              <div className="grid grid-cols-3 gap-3">

                <div className="text-center">
                  <p className="text-slate-500 text-xs">
                    Allocated
                  </p>

                  <p className="font-bold text-blue-600 text-xl">
                    {leave.allocated}
                  </p>

                </div>

                <div className="text-center">
                  <p className="text-slate-500 text-xs">
                    Used
                  </p>

                  <p className="font-bold text-red-600 text-xl">
                    {leave.used}
                  </p>
                </div>

                <div className="text-center">
                  <p className="font-bold text-green-600 text-xl">
                    Remaining
                  </p>

                  <p className="font-bold text-green-600">
                    {leave.remaining}
                  </p>
                </div>

              </div>

            </div>

            {leave.status === "Pending" ? (
              <div className="flex gap-3">

                <button
                  onClick={() =>
                    approveLeave(leave._id)
                  }
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    openRejectModal(leave)
                  }
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700"
                >
                  Reject
                </button>

              </div>
            ) : (
                  <div className="w-full text-center py-3 rounded-xl bg-slate-100 text-slate-600 font-medium">
                    Request {leave.status}
                  </div>
                )}

            {leave.rejectionReason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">
                  <strong>Reason:</strong>{" "}
                  {leave.rejectionReason}
                </p>
              </div>
            )}

          </div>
        ))}

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Reject Leave Request
            </h2>

            <textarea
              rows="4"
              value={rejectReason}
              onChange={(e) =>
                setRejectReason(e.target.value)
              }
              placeholder="Enter rejection reason..."
              className="w-full border rounded-xl p-3"
            />

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() =>
                  setShowRejectModal(false)
                }
                className="px-5 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={()=>rejectLeave()}
                className="bg-red-600 text-white px-5 py-2 rounded-xl"
              >
                Reject
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}