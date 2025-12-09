import { Link } from "react-router-dom";
import { MdPeople, MdEvent, MdDescription, MdTrendingUp } from "react-icons/md";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import doctors from "../../data/doctors";
import { getAppointments } from "../../data/appointmentsStore";
import { getEntries } from "../../data/entriesStore";
import { getPatients } from "../../data/patientsStore";

function DashboardHome() {
  const doctorCount = doctors.length;
  const appointmentCount = getAppointments().length;
  const reportCount = getEntries().length;
  const patientCount = getPatients().length;

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
        <Link to="/doctors">
          <StatsCard
            icon={MdPeople}
            value={doctorCount.toString()}
            label="Total Doctors"
            progress={75}
            trend="Active"
          />
        </Link>
        <Link to="/appointments">
          <StatsCard
            icon={MdEvent}
            value={appointmentCount.toString()}
            label="Appointments"
            progress={60}
            trend="Scheduled"
          />
        </Link>
        <Link to="/reports">
          <StatsCard
            icon={MdDescription}
            value={reportCount.toString()}
            label="Total Reports"
            progress={25}
            trend="Entries"
          />
        </Link>
        <Link to="/patients">
          <StatsCard
            icon={MdTrendingUp}
            value={patientCount.toString()}
            label="Total Patients"
            progress={85}
            trend="Registered"
          />
        </Link>
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
