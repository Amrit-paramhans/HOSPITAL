// src/pages/store/StoreVerify.jsx

import { useState } from "react";
import { getEntries } from "../../data/entriesStore";
import { addInventoryRecord } from "../../data/inventoryStore";   // ✅ NEW
import doctors from "../../data/doctors";

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
          qty: Number(qty),  // Convert to number
        })
      ),
    };

    addInventoryRecord(saveObj); // ✅ Save to localStorage permanently
    alert("Inventory saved successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Verify Inventory</h1>

      {/* Date + Doctor Selection */}
      <div style={{ marginTop: "20px" }}>
        <label>Select Date: </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {dates.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <label style={{ marginLeft: "20px" }}>Select Doctor: </label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="">-- Choose --</option>

          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </div>

      <hr style={{ marginTop: "20px" }} />

      {/* Entries Panel */}
      {selectedDoctor === "" ? (
        <p>Select a doctor to continue.</p>
      ) : doctorEntries.length === 0 ? (
        <p>No nurse entries found for this date.</p>
      ) : (
        doctorEntries.map((entry) => (
          <div
            key={entry.id}
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <h3>Entry ID: {entry.id}</h3>

            <table width="100%" border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Nurse Qty</th>
                  <th>Inventory Qty</th>
                </tr>
              </thead>

              <tbody>
                {entry.items.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>
                      <input
                        type="number"
                        value={inventoryInputs[entry.id]?.[item.name] || ""}
                        onChange={(e) =>
                          handleInventoryChange(
                            entry.id,
                            item.name,
                            e.target.value
                          )
                        }
                        style={{ width: "80px" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => handleSave(entry.id, entry.items)}
              style={{
                marginTop: "12px",
                padding: "8px 14px",
                background: "#2563eb",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save Inventory
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default StoreVerify;
