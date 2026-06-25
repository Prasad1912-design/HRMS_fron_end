import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {

  const navigate = useNavigate();
  
  const logoutFun = () =>{
    localStorage.removeItem("token");
    navigate("/login");
  }

  const adminMenus = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Employees", path: "/admin/employees" },
    { name: "Employment Types", path: "/admin/employment-types" },
    { name: "Leave Policies", path: "/admin/leave-policies" },
    { name: "Leave Requests", path: "/admin/leaveRequests" },
    { name: "Holidays", path: "/admin/holidays" },
    { name: "Payroll", path: "/admin/payroll" },
    { name: "Salary Slips", path: "/admin/salary-slips" }
  ];

  const employeeMenus = [
    // { name: "Dashboard", path: "/employee/dashboard" },
    { name: "My Attendance", path: "/employee/attendance" },
    { name: "Apply Leave", path: "/employee/apply-leave" },
    { name: "My Payrolls", path: "/employee/payrolls" },
    { name: "My Salary Slips", path: "/employee/salary-slips" }
  ];

  const menus =
    role === "admin"
      ? adminMenus
      : employeeMenus;

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen">

      {/* Logo */}
      <div className="p-5 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          HRMS
        </h1>
      </div>

      {/* Menus */}
      <div className="p-3">

        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg mb-2 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }`
            }
          >
            {menu.name}
          </NavLink>
        ))}

        <button
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-600 transition mt-5"
          onClick={logoutFun}
        >
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;