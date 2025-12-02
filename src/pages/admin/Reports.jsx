

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
    <div style={{ padding: 20 }}>
      <h1>Detailed Reports</h1>

      {dates.map((date) => (
        <div key={date} style={{ marginBottom: 60 }}>
          <h2>Date: {date}</h2>

          {grouped[date].map((entry) => {
            const invMatch = inv.find((i) => i.nurseEntryId === entry.id);

            let totalDiff = 0;

            return (
              <div
                key={entry.id}
                style={{
                  padding: 15,
                  border: "1px solid #ccc",
                  marginBottom: 25,
                }}
              >
                <h3>{entry.doctorName}</h3>

                <table border="1" width="100%" cellPadding="6">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Nurse Qty</th>
                      <th>Store Qty</th>
                      <th>Difference</th>
                    </tr>
                  </thead>

                  <tbody>
                    {entry.items.map((i) => {
                      const storeItem = invMatch?.itemsVerified.find(
                        (x) => x.name === i.name
                      );

                      const invQty = storeItem ? storeItem.qty : 0;
                      const diff = invQty - i.qty;

                      totalDiff += diff;

                      return (
                        <tr key={i.name}>
                          <td>{i.name}</td>
                          <td>{i.qty}</td>
                          <td>{invQty}</td>
                          <td style={{ color: diff !== 0 ? "red" : "green" }}>
                            {diff}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <p>
                  <b>Total Difference:</b>{" "}
                  <span style={{ color: totalDiff !== 0 ? "red" : "green" }}>
                    {totalDiff}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Reports;
