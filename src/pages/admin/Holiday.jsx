import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

/* ================= ICON ENGINE ================= */
const ICON_RULES = [
  { keys: ["independence", "republic"], icon: "🇮🇳" },
  { keys: ["christmas"], icon: "🎄" },
  { keys: ["diwali"], icon: "🪔" },
  { keys: ["holi"], icon: "🎨" },
  { keys: ["eid", "ramadan"], icon: "🌙" },
  { keys: ["new year"], icon: "🎆" },
  { keys: ["labour", "labor"], icon: "👷" },
  { keys: ["pongal"], icon: "🌾" },
  { keys: ["navratri"], icon: "🪔" },
  { keys: ["gandhi"], icon: "🕊️" },
];

const getHolidayIcon = (title = "") => {
  const text = title.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.keys.some((k) => text.includes(k))) {
      return rule.icon;
    }
  }
  return "📅";
};

export default function Holiday() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [deleteId, setDeleteId] = useState(null); // custom popup

  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
  });

  /* ================= FETCH ================= */
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/getAllHolidays", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setHolidays(res.data?.allHolidays || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  /* ================= ADD / EDIT ================= */
  const openAdd = () => {
    setForm({ title: "", date: "", description: "" });
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (h) => {
    setForm({
      title: h.title,
      date: h.date?.split("T")[0],
      description: h.description || "",
    });
    setEditId(h._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/auth/updateHoliday/${editId}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await api.post("/auth/createHoliday", form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      setModalOpen(false);
      fetchHolidays();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      await api.delete(`/auth/deleteHoliday/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDeleteId(null);
      fetchHolidays();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" />
            Holiday Management
          </h2>
          <p className="text-gray-500 text-sm">
            Manage company holidays smartly
          </p>
        </div>

        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow"
        >
          <FaPlus /> Add Holiday
        </button>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {holidays.map((h) => (
          <div
            key={h._id}
            className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-xl transition"
          >
            <div className="flex justify-between">
              <div className="text-4xl">{getHolidayIcon(h.title)}</div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(h)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setDeleteId(h._id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-3">{h.title}</h3>

            <p className="text-sm text-gray-500 mt-1">
              📅 {new Date(h.date).toDateString()}
            </p>

            <p className="text-sm text-gray-600 mt-2">
              {h.description || "No description"}
            </p>
          </div>
        ))}
      </div>

      {!loading && holidays.length === 0 && (
        <p className="text-center mt-20 text-gray-500">
          No holidays found
        </p>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl p-6 relative shadow-2xl">

            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Holiday" : "Add Holiday"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                className="w-full border p-3 rounded-xl"
                placeholder="Holiday Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full border p-3 rounded-xl"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />

              <textarea
                className="w-full border p-3 rounded-xl"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
                {editId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= PROFESSIONAL DELETE POPUP ================= */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[380px] p-6 rounded-2xl shadow-2xl text-center">

            <div className="text-red-500 text-4xl mb-3">
              <FaExclamationTriangle />
            </div>

            <h2 className="text-lg font-semibold">
              Delete Holiday?
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}