import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCheck,
  FaUserTimes,
  FaBusinessTime,
  FaUmbrellaBeach,
} from "react-icons/fa";

export default function EmployeeDashboardCalendar() {
  const [calendarData, setCalendarData] = useState([]);
  const [punchStatus, setPunchStatus] = useState("out");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/emp/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCalendarData(res.data?.calendarData || []);
    };

    const fetchPunch = async () => {
      const res = await api.get("/emp/punch-status",{headers : {Authorization : `Bearer ${localStorage.getItem("token")}`}}
      );
      setPunchStatus(res.data?.isPunchedIn ? "in" : "out");
    };

    fetchData();
    fetchPunch();
  }, []);

  // ================= MAP =================
  const dateMap = useMemo(() => {
    const map = {};
    calendarData.forEach((i) => {
      map[i.date.split("T")[0]] = i.type;
    });
    return map;
  }, [calendarData]);

  // ================= CALENDAR =================
  const monthDays = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const start = first.getDay();
    const total = last.getDate();

    const arr = [];

    for (let i = 0; i < start; i++) arr.push(null);

    for (let i = 1; i <= total; i++) {
      const d = new Date(year, month, i);
      const key = d.toISOString().split("T")[0];

      arr.push({
        day: i,
        date: key,
        status: dateMap[key] || "absent",
      });
    }

    return arr;
  }, [year, month, dateMap]);

  const today = new Date().toISOString().split("T")[0];

  // ================= STATUS UI =================
  const statusUI = {
    present: { icon: <FaUserCheck />, color: "#22c55e" },
    absent: { icon: <FaUserTimes />, color: "#ef4444" },
    half_day: { icon: <FaBusinessTime />, color: "#facc15" },
    holiday: { icon: <FaUmbrellaBeach />, color: "#a855f7" },
  };

  // ================= PUNCH =================
  const handlePunch = async () => {
    try {
      setLoading(true);

      const url =
        punchStatus === "out" ? "/emp/punchIn" : "/emp/punchOut";

      const res = await api.post(url,{},{headers : {Authorization : `Bearer ${localStorage.getItem("token")}`}});

      if (res.data?.success) {
        setPunchStatus(punchStatus === "out" ? "in" : "out");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">

      {/* ================= TOP LEGEND (ONLY ONCE) ================= */}
      <div className="flex gap-6 mb-4 text-xs bg-white px-4 py-2 rounded-xl shadow-sm border w-fit">

        <div className="flex items-center gap-1 text-green-600">
          <FaUserCheck /> Present
        </div>

        <div className="flex items-center gap-1 text-red-500">
          <FaUserTimes /> Absent
        </div>

        <div className="flex items-center gap-1 text-yellow-500">
          <FaBusinessTime /> Half
        </div>

        <div className="flex items-center gap-1 text-purple-500">
          <FaUmbrellaBeach /> Holiday
        </div>

      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-12 gap-6">

        {/* ================= CALENDAR ================= */}
        <div className="col-span-9 bg-white rounded-3xl shadow-lg p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" />
              <h3 className="font-semibold">
                {currentDate.toLocaleString("default", { month: "long" })} {year}
              </h3>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
                <FaChevronLeft />
              </button>

              <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
                <FaChevronRight />
              </button>
            </div>

          </div>

          {/* WEEK DAYS */}
          <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-7 gap-3">

            {monthDays.map((d, i) => {
              if (!d) return <div key={i} />;

              const ui = statusUI[d.status] || statusUI.absent;
              const isToday = d.date === today;

              return (
                <div
                  key={d.date}
                  className={`h-20 rounded-2xl border flex flex-col items-center justify-center
                    hover:scale-105 transition relative
                    ${isToday ? "ring-2 ring-blue-500" : ""}
                  `}
                >

                  {/* ICON ALWAYS VISIBLE */}
                  <div
                    style={{
                      color: ui.color,
                      fontSize: 18,
                    }}
                  >
                    {ui.icon}
                  </div>

                  <span className="text-xs mt-1 text-gray-600">
                    {d.day}
                  </span>

                </div>
              );
            })}

          </div>

        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="col-span-3">

          {/* PUNCH CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center">

            <FaClock className="text-blue-600 text-2xl mx-auto mb-2" />

            <p className="text-sm mb-3">
              Status:{" "}
              <span className={punchStatus === "in" ? "text-green-600" : "text-red-500"}>
                {punchStatus.toUpperCase()}
              </span>
            </p>

            <button
              onClick={handlePunch}
              disabled={loading}
              className={`w-full py-2 rounded-xl text-white flex items-center justify-center gap-2
                ${punchStatus === "out" ? "bg-green-500" : "bg-red-500"}
              `}
            >
              {punchStatus === "out" ? (
                <>
                  <FaSignInAlt /> Punch In
                </>
              ) : (
                <>
                  <FaSignOutAlt /> Punch Out
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}