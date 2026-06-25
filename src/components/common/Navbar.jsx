const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      <h2 className="text-xl font-semibold text-slate-800">
        Mobicloud Technologies HRMS System
      </h2>

      <div className="flex items-center gap-4">

        <div className="text-right">
          <p className="font-medium text-slate-700">
            Welcome
          </p>

          <p className="text-sm text-slate-500">
            User
          </p>
        </div>

        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          U
        </div>

      </div>

    </header>
  );
};

export default Navbar;