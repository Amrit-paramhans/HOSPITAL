import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdPeople, MdCompareArrows, MdAssessment, MdAnalytics, MdLogout } from "react-icons/md";

function AdminSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(path)
      ? "bg-[#009688] text-white shadow-md"
      : "text-gray-600 hover:bg-gray-200 hover:text-[#00796B]"
    }`;

  return (
    <div
      className="h-screen bg-white border-r border-gray-200 flex flex-col"
      style={{ width: "250px" }}
    >
      <div className="p-6 flex items-center justify-center border-b border-gray-100">
        <img src="/logo.png" alt="Company Logo" className="h-12 w-auto object-contain" />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <Link to="/dashboard" className={linkClasses("/dashboard")}>
          <MdDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link to="/doctors" className={linkClasses("/doctors")}>
          <MdPeople size={20} />
          <span>Doctors</span>
        </Link>

        <Link to="/compare" className={linkClasses("/compare")}>
          <MdCompareArrows size={20} />
          <span>Compare Data</span>
        </Link>

        <Link to="/reports" className={linkClasses("/reports")}>
          <MdAssessment size={20} />
          <span>Reports</span>
        </Link>

        <Link to="/analytics" className={linkClasses("/analytics")}>
          <MdAnalytics size={20} />
          <span>Analytics</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-[#009688] hover:bg-[#E0F2F1] rounded-lg transition-colors font-medium">
          <MdLogout size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;
