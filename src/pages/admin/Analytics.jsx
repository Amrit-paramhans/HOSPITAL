

import DashboardLayout from "../../layouts/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

import { getEntries } from "../../data/entriesStore";
import { getInventory } from "../../data/inventoryStore";

function Analytics() {
  const nurseEntries = getEntries();
  const rawStoreEntries = getInventory();

  // AUTO-FIX: Filter out "ghost" inventory records that don't have a matching nurse entry
  // This prevents items like "ddd" from showing up if their parent entry was deleted
  const validEntryIds = new Set(nurseEntries.map(e => e.id));
  const storeEntries = rawStoreEntries.filter(inv => validEntryIds.has(inv.nurseEntryId));

  // Build analytics data
  let analyticsMap = {};

  nurseEntries.forEach(entry => {
    entry.items.forEach(item => {
      if (!analyticsMap[item.name]) {
        analyticsMap[item.name] = { item: item.name, nurse: 0, store: 0 };
      }
      analyticsMap[item.name].nurse += Number(item.qty ?? item.nurseQty ?? 0);
    });
  });

  storeEntries.forEach(entry => {
    entry.itemsVerified.forEach(item => {
      if (!analyticsMap[item.name]) {
        analyticsMap[item.name] = { item: item.name, nurse: 0, store: 0 };
      }
      analyticsMap[item.name].store += Number(item.qty ?? item.inventoryQty ?? 0);
    });
  });

  const barData = Object.values(analyticsMap);

  const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4"];

  // Pie chart: doctor usage
  let doctorMap = {};

  nurseEntries.forEach(entry => {
    if (!doctorMap[entry.doctorName]) doctorMap[entry.doctorName] = 0;
    entry.items.forEach(i => {
      doctorMap[entry.doctorName] += Number(i.qty ?? i.nurseQty ?? 0);
    });
  });

  const pieData = Object.keys(doctorMap).map((doc, idx) => ({
    name: doc,
    value: doctorMap[doc],
    fill: COLORS[idx % COLORS.length]
  }));

  return (
    <DashboardLayout>
      <div className="p-6">

        <h1 className="text-4xl font-bold text-[#103151] mb-10">
          Analytics Dashboard
        </h1>

        {/* Bar Chart Section */}
        <div className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-semibold text-[#103151] mb-4">
            Nurse Qty vs Store Qty
          </h2>

          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="item" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="nurse" fill="#2563eb" name="Nurse Qty" />
                <Bar dataKey="store" fill="#16a34a" name="Store Qty" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-semibold text-[#103151] mb-4">
            Doctor-wise Usage Distribution
          </h2>

          <div className="w-full flex justify-center">
            <ResponsiveContainer width="60%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Analytics;
