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
  const [selectedDay, setSelectedDay] = useState(null);
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
      const res = await api.get("/emp/punch-status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPunchStatus(res.data?.isPunchedIn ? "in" : "out");
    };

    fetchData();
    fetchPunch();
  }, []);

  // ================= SAFE DATE FORMAT (FIX +1 BUG) =================
  const formatDate = (y, m, d) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  // ================= MAP =================
  const dateMap = useMemo(() => {
    const map = {};
    calendarData.forEach((i) => {
      const key = i.date.split("T")[0];
      map[key] = i;
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
      const key = formatDate(year, month, i); // 🔥 FIXED

      arr.push({
        day: i,
        date: key,
        data: dateMap[key] || { type: "absent", title: "Absent" },
      });
    }

    return arr;
  }, [year, month, dateMap]);

  const today = formatDate(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  // ================= STATUS COLORS (LEGEND RESTORED) =================
  const STATUS = {
    present: { color: "#22c55e", icon: <FaUserCheck />, label: "Present" },
    absent: { color: "#ef4444", icon: <FaUserTimes />, label: "Absent" },
    paid_leave: { color: "#3b82f6", icon: <FaBusinessTime />, label: "Paid Leave" },
    unpaid_leave: { color: "#f97316", icon: <FaSignOutAlt />, label: "Unpaid Leave" },
    half_day: { color: "#eab308", icon: <FaClock />, label: "Half Day" },
    holiday: { color: "#a855f7", icon: <FaUmbrellaBeach />, label: "Holiday" },
  };

  const getStatusUI = (type) => STATUS[type] || STATUS.absent;

  // ================= PUNCH =================
  const handlePunch = async () => {
    try {
      setLoading(true);

      const url = punchStatus === "out" ? "/emp/punchIn" : "/emp/punchOut";

      const res = await api.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data?.success) {
        setPunchStatus(punchStatus === "out" ? "in" : "out");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">

      {/* ================= LEGEND (RESTORED CLEAN UI) ================= */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(STATUS).map(([key, val]) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-1 bg-white border rounded-full shadow-sm text-xs"
          >
            <span style={{ color: val.color }}>{val.icon}</span>
            <span className="capitalize">{val.label}</span>
          </div>
        ))}
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-12 gap-6">

        {/* CALENDAR */}
        <div className="col-span-9 bg-white rounded-3xl shadow-lg p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">

            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <FaChevronLeft />
            </button>

            <h3 className="font-semibold">
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h3>

            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <FaChevronRight />
            </button>

          </div>

          {/* WEEK DAYS */}
          <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-3">

            {monthDays.map((d, i) => {
              if (!d) return <div key={i} />;

              const ui = getStatusUI(d.data.type);
              const isToday = d.date === today;

              return (
                <div
                  key={d.date}
                  onClick={() => setSelectedDay(d)}
                  className={`h-20 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition hover:scale-105 ${
                    isToday ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div style={{ color: ui.color, fontSize: 18 }}>
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

        {/* RIGHT PANEL */}
        <div className="col-span-3">

          {/* PUNCH CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center mb-4">

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
              className={`w-full py-2 rounded-xl text-white ${
                punchStatus === "out" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {punchStatus === "out" ? "Punch In" : "Punch Out"}
            </button>
          </div>

          {/* DETAIL */}
          {selectedDay && (
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="font-semibold mb-2">{selectedDay.date}</h3>
              <div className="flex items-center gap-2">
                <span style={{ color: getStatusUI(selectedDay.data.type).color }}>
                  {getStatusUI(selectedDay.data.type).icon}
                </span>
                <span className="capitalize">
                  {selectedDay.data.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {selectedDay.data.title}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}