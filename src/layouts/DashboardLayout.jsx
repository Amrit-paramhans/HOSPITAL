import AdminSidebar from "../components/AdminSidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex">

      {/* FIXED SIDEBAR */}
      <div className="fixed left-0 top-0 h-full w-[250px]">
        <AdminSidebar />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="p-8 w-full min-h-screen bg-gray-50"
        style={{ marginLeft: "250px" }}   // Sidebar width
      >
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
