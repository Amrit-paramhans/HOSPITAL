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
    <div style={{ padding: "25px", width: "100%" }}>
      <h1
        style={{
          fontSize: "38px",
          fontWeight: "bold",
          color: "#103151",
          marginBottom: "20px",
        }}
      >
        Compare All Doctors
      </h1>

      {/* DATE SELECT */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            fontSize: "16px",
            fontWeight: "600",
            marginRight: "10px",
            color: "#103151",
          }}
        >
          Select Date:
        </label>

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "8px 14px",
            border: "1px solid #C7D0D9",
            borderRadius: "6px",
            background: "#ffffff",
          }}
        >
          {uniqueDates.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <hr style={{ marginBottom: "25px" }}></hr>

      {/* ---------------------------
          DISPLAY PER DOCTOR
      --------------------------- */}
      {doctors.map((doc, idx) => {
        const nurseEntries = allEntries.filter(
          (e) => e.doctorId === doc.doctorId && e.date === selectedDate
        );

        return (
          <div key={idx} style={{ marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#103151",
                marginBottom: "10px",
              }}
            >
              {doc.doctorName}
            </h2>

            {nurseEntries.length === 0 ? (
              <p style={{ color: "#555" }}>No entries for selected date</p>
            ) : (
              nurseEntries.map((entry) => {
                const inv = invAll.find((i) => i.nurseEntryId === entry.id);

                return (
                  <div key={entry.id} style={{ marginBottom: "30px" }}>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "10px",
                      }}
                    >
                      Date: {entry.date}
                    </p>

                    {/* TABLE */}
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#ffffff",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: "#F1F1EB",
                            color: "#103151",
                            textAlign: "left",
                          }}
                        >
                          <th style={{ padding: "12px" }}>Item</th>
                          <th style={{ padding: "12px" }}>Nurse Qty</th>
                          <th style={{ padding: "12px" }}>Store Qty</th>
                          <th style={{ padding: "12px" }}>Difference</th>
                        </tr>
                      </thead>

                      <tbody>
                        {entry.items.map((x) => {
                          const invMatch = inv?.itemsVerified.find(
                            (i) => i.name === x.name
                          );

                          const storeQty = invMatch ? invMatch.qty : 0;
                          const diff = storeQty - x.qty;

                          return (
                            <tr
                              key={x.name}
                              style={{
                                borderBottom: "1px solid #E5E7EB",
                              }}
                            >
                              <td style={{ padding: "10px" }}>{x.name}</td>
                              <td style={{ padding: "10px" }}>{x.qty}</td>
                              <td style={{ padding: "10px" }}>{storeQty}</td>
                              <td
                                style={{
                                  padding: "10px",
                                  color: diff !== 0 ? "red" : "green",
                                  fontWeight: "600",
                                }}
                              >
                                {diff}
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
