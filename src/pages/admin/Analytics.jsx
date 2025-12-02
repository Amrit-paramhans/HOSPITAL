
import DashboardLayout from "../../layouts/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

import { getEntries } from "../../data/entriesStore";
import { getInventory } from "../../data/inventoryStore";

function Analytics() {
  const nurseEntries = getEntries();
  const storeEntries = getInventory();

  let analyticsMap = {};

  nurseEntries.forEach(entry => {
    entry.items.forEach(item => {
      if (!analyticsMap[item.name]) {
        analyticsMap[item.name] = { item: item.name, nurse: 0, store: 0 };
      }
      analyticsMap[item.name].nurse += Number(item.nurseQty);
    });
  });

  storeEntries.forEach(entry => {
    entry.items.forEach(item => {
      if (!analyticsMap[item.name]) {
        analyticsMap[item.name] = { item: item.name, nurse: 0, store: 0 };
      }
      analyticsMap[item.name].store += Number(item.inventoryQty);
    });
  });

  const barData = Object.values(analyticsMap);

  const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4"];

  let doctorMap = {};

  nurseEntries.forEach(entry => {
    if (!doctorMap[entry.doctorId]) doctorMap[entry.doctorId] = 0;
    entry.items.forEach(i => doctorMap[entry.doctorId] += Number(i.nurseQty));
  });

  const pieData = Object.keys(doctorMap).map((docId, idx) => ({
    name: "Doctor " + docId,
    value: doctorMap[docId],
    fill: COLORS[idx % COLORS.length]
  }));

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Total Nurse vs Store Quantities</h2>

      <BarChart width={800} height={350} data={barData}>
        <XAxis dataKey="item" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="nurse" fill="#2563eb" name="Nurse Qty" />
        <Bar dataKey="store" fill="#16a34a" name="Store Qty" />
      </BarChart>

      <h2 className="text-xl font-semibold mt-10 mb-2">Doctor-wise Total Usage</h2>

      <PieChart width={500} height={400}>
        <Pie
          dataKey="value"
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={140}
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </DashboardLayout>
  );
}

export default Analytics;
