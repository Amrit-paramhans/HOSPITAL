import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import AdminSidebar from "../components/AdminSidebar";
import doctors from "../data/doctors";

function DashboardLayout({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      // Simple search: find doctor by name
      const found = doctors.find(d => d.name.toLowerCase().includes(term));

      if (found) {
        navigate(`/doctor/${found.id}`);
        setSearchTerm("");
      } else {
        alert("No doctor found with that name.");
      }
    }
  };

  return (
    <div className="flex">

      {/* FIXED SIDEBAR */}
      <div className="fixed left-0 top-0 h-full w-[250px] z-20">
        <AdminSidebar />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="w-full min-h-screen bg-gray-50 flex flex-col"
        style={{ marginLeft: "250px" }}   // Sidebar width
      >
        {/* TOP SEARCH BAR */}
        <div className="bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
          <div className="relative w-96">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search doctors (Press Enter)..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E0F2F1] text-[#009688] flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="text-sm font-medium text-gray-600">Admin</span>
          </div>
        </div>

        <div className="p-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
