import { useState } from "react";
import doctors from "../../data/doctors";
import { addInventoryEntry } from "../../data/inventoryStore";

export default function AddInventoryEntry() {
  const [date, setDate] = useState("2025-01-01");
  const [doctorId, setDoctorId] = useState("");
  const [items, setItems] = useState([{ name: "", qty: "" }]);

  const addRow = () => {
    setItems([...items, { name: "", qty: "" }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSave = () => {
    const validItems = items.filter((i) => i.name && i.qty);

    if (!doctorId || validItems.length === 0) {
      alert("Fill all fields properly.");
      return;
    }

    addInventoryEntry({
      id: Date.now(),
      doctorId: parseInt(doctorId),
      date,
      items: validItems.map((i) => ({
        name: i.name,
        qty: parseInt(i.qty),
      })),
    });

    alert("Inventory entry saved!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Add Inventory Entry</h1>

      <label>Select Doctor:</label>
      <select
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 15 }}
      >
        <option value="">Select Doctor</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>

      <label>Date:</label>
      <select
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 15 }}
      >
        <option value="2025-01-01">2025-01-01</option>
      </select>

      <h3>Items:</h3>

      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input
            placeholder="Item name"
            value={item.name}
            onChange={(e) => updateItem(index, "name", e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />

          <input
            placeholder="Qty"
            type="number"
            value={item.qty}
            onChange={(e) => updateItem(index, "qty", e.target.value)}
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

      <button
        onClick={handleSave}
        style={{
          background: "#2563eb",
          color: "white",
          padding: "10px 16px",
          borderRadius: 6,
        }}
      >
        Save Inventory Entry
      </button>
    </div>
  );
}
