import { useParams } from "react-router-dom";
import { useState } from "react";
import doctors from "../../data/doctors";

// NEW imports
import { addEntry, getEntries } from "../../data/entriesStore";

function DoctorDetails() {
  const { id } = useParams();
  const doctorId = parseInt(id);
  const doctor = doctors.find((d) => d.id === doctorId);

  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("2025-01-01");
  const [items, setItems] = useState([{ name: "", nurseQty: "" }]);

  const addRow = () => {
    setItems([...items, { name: "", nurseQty: "" }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // SAVE nurse entry 
  const handleSave = () => {
    const validItems = items.filter(
      (i) => i.name.trim() !== "" && i.nurseQty !== ""
    );

    if (validItems.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    const entry = {
      id: Date.now(), // <-- IMPORTANT FIX
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
    alert("Entry saved!");
  };

  // Load all entries for doctor
  const allEntries = getEntries().filter((e) => e.doctorId === doctorId);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 30, fontWeight: "bold" }}>
        Doctor: {doctor.name}
      </h1>

      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: "10px 16px",
          background: "#2563eb",
          color: "white",
          borderRadius: 6,
          marginTop: 20,
          cursor: "pointer",
        }}
      >
        ➕ Add Entry
      </button>

      <h2 style={{ marginTop: 30, fontSize: 22 }}>Entries</h2>

      {allEntries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        allEntries.map((entry) => (
          <div key={entry.id} style={{ marginBottom: 40 }}>
            <h3 style={{ marginTop: 20 }}>
              Date: <b>{entry.date}</b>
            </h3>

            <table width="100%" border="1" cellPadding="8">
              <thead>
                <tr style={{ background: "#f2f2f2" }}>
                  <th>Item</th>
                  <th>Nurse Qty</th>
                  <th>Inventory Qty</th>
                  <th>Difference</th>
                </tr>
              </thead>

              <tbody>
                {entry.items.map((nItem) => {
                  const invQty = 0;
                  const diff = invQty - nItem.qty;

                  return (
                    <tr key={nItem.name}>
                      <td>{nItem.name}</td>
                      <td>{nItem.qty}</td>
                      <td>{invQty}</td>
                      <td style={{ color: diff !== 0 ? "red" : "green" }}>
                        {diff}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: 400,
              background: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>
              Add Entry for {doctor.name}
            </h3>

            <label>Date:</label>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 12 }}
            >
              <option value="2025-01-01">2025-01-01</option>
            </select>

            <h4>Items:</h4>
            {items.map((item, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: 10, marginBottom: 8 }}
              >
                <input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) =>
                    updateItem(index, "name", e.target.value)
                  }
                  style={{ flex: 1, padding: 8 }}
                />

                <input
                  placeholder="Qty"
                  type="number"
                  value={item.nurseQty}
                  onChange={(e) =>
                    updateItem(index, "nurseQty", e.target.value)
                  }
                  style={{ width: 80, padding: 8 }}
                />
              </div>
            ))}

            <button
              onClick={addRow}
              style={{
                background: "#10b981",
                color: "white",
                padding: "6px 10px",
                borderRadius: 6,
                marginBottom: 20,
              }}
            >
              ➕ Add Item
            </button>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleSave}
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: 6,
                }}
              >
                Save
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "gray",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: 6,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDetails;
