import { getEntries } from "../../data/entriesStore";
import { getInventory } from "../../data/inventoryStore";

function Reports() {
  const entries = getEntries();
  const inv = getInventory();

  // Group entries by date
  const grouped = {};
  entries.forEach((e) => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  const dates = Object.keys(grouped);

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Detailed Reports
      </h1>

      {dates.map((date) => (
        <div key={date} className="mb-12">
          <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
            <span className="w-2 h-6 bg-[#009688] rounded-full mr-3"></span>
            Date: {date}
          </h2>

          <div className="space-y-8">
            {grouped[date].map((entry) => {
              const invMatch = inv.find((i) => i.nurseEntryId === entry.id);
              let totalDiff = 0;

              return (
                <div
                  key={entry.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                    {entry.doctorName}
                  </h3>

                  <div className="overflow-hidden rounded-lg border border-gray-200 mb-4">
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
                        {entry.items.map((i) => {
                          const storeItem = invMatch?.itemsVerified.find(
                            (x) => x.name === i.name
                          );

                          const invQty = storeItem ? storeItem.qty : 0;
                          const diff = invQty - i.qty;

                          totalDiff += diff;

                          return (
                            <tr key={i.name} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-gray-900">{i.name}</td>
                              <td className="px-6 py-4">{i.qty}</td>
                              <td className="px-6 py-4">{invQty}</td>
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

                  <div className="flex justify-end items-center">
                    <p className="text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                      Total Difference:{" "}
                      <span
                        className={`font-bold ml-1 ${totalDiff !== 0 ? "text-red-600" : "text-green-600"
                          }`}
                      >
                        {totalDiff}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reports;
