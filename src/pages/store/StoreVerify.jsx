import { useState } from "react";
import { getEntries } from "../../data/entriesStore";
import { addInventoryRecord } from "../../data/inventoryStore";
import doctors from "../../data/doctors";
import { MdSave } from "react-icons/md";

function StoreVerify() {
  const entries = getEntries();

  // Unique dates from nurse entries
  const dates = [...new Set(entries.map((e) => e.date))];

  const [selectedDate, setSelectedDate] = useState(dates[0] || "");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [inventoryInputs, setInventoryInputs] = useState({});

  let doctorEntries = entries.filter(
    (e) => e.date === selectedDate && e.doctorId === Number(selectedDoctor)
  );

  // Update inventory qty input
  const handleInventoryChange = (entryId, itemName, value) => {
    setInventoryInputs((prev) => ({
      ...prev,
      [entryId]: {
        ...prev[entryId],
        [itemName]: value,
      },
    }));
  };

  // Save the verification
  const handleSave = (entryId, items) => {
    if (!inventoryInputs[entryId]) {
      alert("Enter item quantities first.");
      return;
    }

    const saveObj = {
      nurseEntryId: entryId,
      itemsVerified: Object.entries(inventoryInputs[entryId]).map(
        ([name, qty]) => ({
          name,
          qty: Number(qty),
        })
      ),
    };

    addInventoryRecord(saveObj);
    alert("Inventory saved successfully!");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Verify Inventory
      </h1>

      {/* Date + Doctor Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-6 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#009688] outline-none min-w-[200px]"
          >
            {dates.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#009688] outline-none min-w-[200px]"
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Entries Panel */}
      {selectedDoctor === "" ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          Please select a doctor to verify inventory.
        </div>
      ) : doctorEntries.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          No nurse entries found for this date.
        </div>
      ) : (
        <div className="space-y-8">
          {doctorEntries.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Entry ID: {entry.id}
              </h3>

              <div className="overflow-hidden rounded-lg border border-gray-200 mb-4">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                  <thead className="bg-[#E0F2F1] text-[#00796B]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Item</th>
                      <th className="px-6 py-4 font-bold">Nurse Qty</th>
                      <th className="px-6 py-4 font-bold">Inventory Qty (Enter)</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {entry.items.map((item) => (
                      <tr key={item.name} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4">{item.qty}</td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            placeholder="0"
                            value={inventoryInputs[entry.id]?.[item.name] || ""}
                            onChange={(e) =>
                              handleInventoryChange(
                                entry.id,
                                item.name,
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg p-2 w-32 focus:ring-2 focus:ring-[#009688] outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave(entry.id, entry.items)}
                  className="px-6 py-2 bg-[#009688] text-white rounded-lg shadow-md hover:bg-[#00796B] transition-colors font-medium flex items-center gap-2"
                >
                  <MdSave size={20} />
                  Save Inventory
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreVerify;
