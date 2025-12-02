import { useState } from "react";
import { getEntries } from "../../data/entriesStore";
import { getInventory } from "../../data/inventoryStore";

function Compare() {
  const allEntries = getEntries();
  const invAll = getInventory();

  const uniqueDates = [...new Set(allEntries.map((e) => e.date))];
  const [selectedDate, setSelectedDate] = useState(uniqueDates[0] || "");

  const doctors = [
    ...new Map(
      allEntries.map((e) => [
        e.doctorId,
        { doctorId: e.doctorId, doctorName: e.doctorName },
      ])
    ).values(),
  ];

  return (
    <div className="p-10 bg-[#F8F8F5] min-h-screen">
      <h1 className="text-4xl font-bold text-[#103151] mb-6">
        Compare All Doctors
      </h1>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="text-lg font-medium text-[#103151]">
          Select Date:
        </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="ml-3 p-3 border rounded-lg bg-white shadow-sm"
        >
          {uniqueDates.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <hr className="my-6" />

      {/* DOCTOR COMPARISON LOOP */}
      {doctors.map((doc) => {
        const nurseEntries = allEntries.filter(
          (e) => e.doctorId === doc.doctorId && e.date === selectedDate
        );

        return (
          <div key={doc.doctorId} className="mb-14">
            <h2 className="text-2xl font-semibold text-[#103151] mb-2">
              {doc.doctorName}
            </h2>

            {nurseEntries.length === 0 ? (
              <p className="text-gray-500">No data available.</p>
            ) : (
              nurseEntries.map((entry) => {
                const inv = invAll.find((i) => i.nurseEntryId === entry.id);

                return (
                  <div
                    key={entry.id}
                    className="bg-white rounded-xl shadow p-6 mb-10"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-[#103151]">
                      Date: {entry.date}
                    </h3>

                    <table className="w-full border">
                      <thead>
                        <tr className="bg-[#F1F1EB] text-[#103151]">
                          <th className="p-3 border">Item</th>
                          <th className="p-3 border">Nurse Qty</th>
                          <th className="p-3 border">Store Qty</th>
                          <th className="p-3 border">Difference</th>
                        </tr>
                      </thead>

                      <tbody>
                        {entry.items.map((x) => {
                          const invMatch = inv?.itemsVerified.find(
                            (a) => a.name === x.name
                          );
                          const invQty = invMatch ? invMatch.qty : 0;

                          const diff = invQty - x.qty;

                          return (
                            <tr key={x.name} className="border">
                              <td className="p-3 border">{x.name}</td>
                              <td className="p-3 border">{x.qty}</td>
                              <td className="p-3 border">{invQty}</td>
                              <td
                                className={`p-3 border font-semibold ${
                                  diff !== 0 ? "text-red-600" : "text-green-600"
                                }`}
                              >
                                {isNaN(diff) ? "NaN" : diff}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Compare;
