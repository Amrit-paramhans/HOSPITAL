import { MdPeople, MdEvent, MdDescription, MdTrendingUp } from "react-icons/md";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatsCard from "../../components/StatsCard";

function DashboardHome() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
          Overview
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={MdPeople}
          value="45"
          label="Total Doctors"
          progress={75}
          trend="2 new"
        />
        <StatsCard
          icon={MdEvent}
          value="120"
          label="Appointments"
          progress={60}
          trend="12%"
        />
        <StatsCard
          icon={MdDescription}
          value="8"
          label="Pending Reports"
          progress={25}
          trend="3 left"
        />
        <StatsCard
          icon={MdTrendingUp}
          value="540"
          label="Monthly Patients"
          progress={85}
          trend="5%"
        />
      </div>

      {/* Welcome Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to the Admin Dashboard</h2>
        <p className="text-gray-500">Select an option from the sidebar to manage doctors, compare data, or view reports.</p>
      </div>
    </DashboardLayout>
  );
}

export default DashboardHome;
