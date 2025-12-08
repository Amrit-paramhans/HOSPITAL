import { useParams } from "react-router-dom";
import { useState } from "react";
import doctors from "../../data/doctors";
import { addEntry, getEntries, updateEntry } from "../../data/entriesStore";
import { MdAdd, MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";

function DoctorDetails() {
  const { id } = useParams();
  const doctorId = parseInt(id);
  const doctor = doctors.find((d) => d.id === doctorId);

  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("2025-01-01");
  const [items, setItems] = useState([{ name: "", nurseQty: "" }]);

  // Editing state
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [editItemData, setEditItemData] = useState({ name: "", qty: "" });

  const addRow = () => {
    setItems([...items, { name: "", nurseQty: "" }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // SAVE new entry
  const handleSave = () => {
    const validItems = items.filter(
      (i) => i.name.trim() !== "" && i.nurseQty !== ""
    );

    if (validItems.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    const entry = {
      id: Date.now(),
      doctorId,
      doctorName: doctor.name,
      date,
      items: validItems.map((i) => ({
        name: i.name,
        qty: parseInt(i.nurseQty),
      })),
    };

    addEntry(entry);
    setShowModal(false);
    setItems([{ name: "", nurseQty: "" }]); // Reset form
    window.location.reload();
  };

  // Load all entries for doctor
  const allEntries = getEntries().filter((e) => e.doctorId === doctorId);

  // Handle Edit Item Click
  const startEditItem = (entry, itemIndex) => {
    setEditingEntryId(entry.id);
    setEditingItemIndex(itemIndex);
    setEditItemData({
      name: entry.items[itemIndex].name,
      qty: entry.items[itemIndex].qty,
    });
  };

  // Save Edited Item
  const saveEditItem = (entry) => {
    const updatedEntry = { ...entry };
    updatedEntry.items[editingItemIndex] = {
      name: editItemData.name,
      qty: parseInt(editItemData.qty),
    };
    updateEntry(updatedEntry);
    setEditingEntryId(null);
    setEditingItemIndex(null);
    window.location.reload();
  };

  // Delete Item
  const deleteItem = (entry, itemIndex) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedEntry = { ...entry };
      updatedEntry.items.splice(itemIndex, 1);

      // If no items left, maybe delete the entry? For now just update.
      updateEntry(updatedEntry);
      window.location.reload();
    }
  };

  if (!doctor) return <div className="p-8">Doctor not found</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="w-2 h-8 bg-[#009688] rounded-full mr-3"></span>
          Doctor: {doctor.name}
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#009688] text-white rounded-lg shadow-md hover:bg-[#00796B] transition-colors flex items-center space-x-2 font-medium"
        >
          <MdAdd size={20} />
          <span>Add Entry</span>
        </button>
      </div>

      <div className="space-y-8">
        {allEntries.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
            No entries yet. Click "Add Entry" to start.
          </div>
        ) : (
          allEntries.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Date: {entry.date}
              </h3>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                  <thead className="bg-[#E0F2F1] text-[#00796B]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Item</th>
                      <th className="px-6 py-4 font-bold">Nurse Qty</th>
                      <th className="px-6 py-4 font-bold">Inventory Qty</th>
                      <th className="px-6 py-4 font-bold">Difference</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {entry.items.map((nItem, idx) => {
                      const invQty = 0; // Placeholder as per original code
                      const diff = invQty - nItem.qty;
                      const isEditingThis = editingEntryId === entry.id && editingItemIndex === idx;

                      return (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {isEditingThis ? (
                              <input
                                type="text"
                                value={editItemData.name}
                                onChange={(e) => setEditItemData({ ...editItemData, name: e.target.value })}
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-[#009688] outline-none"
                              />
                            ) : (
                              nItem.name
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={editItemData.qty}
                                onChange={(e) => setEditItemData({ ...editItemData, qty: e.target.value })}
                                className="border border-gray-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-[#009688] outline-none"
                              />
                            ) : (
                              nItem.qty
                            )}
                          </td>
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
                          <td className="px-6 py-4 text-right">
                            {isEditingThis ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => saveEditItem(entry)}
                                  className="text-green-600 hover:bg-green-50 p-1 rounded"
                                  title="Save"
                                >
                                  <MdSave size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingEntryId(null);
                                    setEditingItemIndex(null);
                                  }}
                                  className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                                  title="Cancel"
                                >
                                  <MdCancel size={18} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => startEditItem(entry, idx)}
                                  className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                  title="Edit"
                                >
                                  <MdEdit size={18} />
                                </button>
                                <button
                                  onClick={() => deleteItem(entry, idx)}
                                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                                  title="Delete"
                                >
                                  <MdDelete size={18} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD ENTRY MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-100">
              Add Entry for {doctor.name}
            </h2>

            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#009688] outline-none"
              >
                <option value="2025-01-01">2025-01-01</option>
              </select>
            </div>

            <h3 className="font-semibold text-gray-700 mb-3">Items</h3>
            <div className="space-y-3 mb-6">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#009688] outline-none"
                  />
                  <input
                    placeholder="Qty"
                    type="number"
                    value={item.nurseQty}
                    onChange={(e) => updateItem(index, "nurseQty", e.target.value)}
                    className="w-24 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#009688] outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addRow}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-[#009688] hover:text-[#009688] transition-colors font-medium mb-6"
            >
              + Add Another Item
            </button>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#009688] text-white rounded-lg shadow-md hover:bg-[#00796B] transition-colors font-medium"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDetails;
