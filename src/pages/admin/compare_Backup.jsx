import { useState, useEffect } from "react";
import { getEntries } from "../../data/entriesStore";
import { getInventory } from "../../data/inventoryStore";

function Compare() {
  const allEntries = getEntries();
  const invAll = getInventory();

  // ---------------------------
  // LOAD UNIQUE DATES CLEANLY
  // ---------------------------
  const uniqueDates = [
    ...new Set(allEntries.map((e) => e.date).filter(Boolean)),
  ];

  const [selectedDate, setSelectedDate] = useState("");

  // Auto-select first date when page loads
  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates]);

  // ---------------------------
  // UNIQUE DOCTOR LIST
  // ---------------------------
  const doctors = [
    ...new Map(
      allEntries.map((e) => [
        e.doctorId,
        { doctorId: e.doctorId, doctorName: e.doctorName },
      ])
    ).values(),
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Compare All Doctors
      </h1>

      {/* DATE SELECT */}
      <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 inline-block">
        <label className="text-gray-700 font-semibold mr-3">
          Select Date:
        </label>

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-[#009688] outline-none bg-white"
        >
          {uniqueDates.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <hr className="mb-8 border-gray-200" />

      {/* ---------------------------
          DISPLAY PER DOCTOR
      --------------------------- */}
      <div className="space-y-10">
        {doctors.map((doc, idx) => {
          const nurseEntries = allEntries.filter(
            (e) => e.doctorId === doc.doctorId && e.date === selectedDate
          );

          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-[#009688] rounded-full mr-3"></span>
                {doc.doctorName}
              </h2>

              {nurseEntries.length === 0 ? (
                <p className="text-gray-500 italic">No entries for selected date</p>
              ) : (
                nurseEntries.map((entry) => {
                  const inv = invAll.find((i) => i.nurseEntryId === entry.id);

                  return (
                    <div key={entry.id} className="mb-6 last:mb-0">
                      <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                        Date: {entry.date}
                      </p>

                      {/* TABLE */}
                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                          <thead className="bg-[#E0F2F1] text-[#00796B]">
                            <tr>
                              <th className="px-6 py-4 font-bold">Item</th>
                              <th className="px-6 py-4 font-bold">Nurse Qty</th>
                              <th className="px-6 py-4 font-bold">Store Qty</th>
                              <th className="px-6 py-4 font-bold">Difference</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                            {entry.items.map((x) => {
                              const invMatch = inv?.itemsVerified.find(
                                (i) => i.name === x.name
                              );

                              const storeQty = invMatch ? invMatch.qty : 0;
                              const diff = storeQty - x.qty;

                              return (
                                <tr
                                  key={x.name}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4 font-medium text-gray-900">
                                    {x.name}
                                  </td>
                                  <td className="px-6 py-4">{x.qty}</td>
                                  <td className="px-6 py-4">{storeQty}</td>
                                  <td className="px-6 py-4">
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${diff === 0
                                          ? "bg-green-50 text-green-600"
                                          : "bg-red-50 text-red-600"
                                        }`}
                                    >
                                      {diff > 0 ? `+${diff}` : diff}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Compare;
