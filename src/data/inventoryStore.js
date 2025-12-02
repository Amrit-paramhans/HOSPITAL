// src/data/inventoryStore.js

const KEY = "inventory_entries";

export function getInventory() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function addInventoryRecord(record) {
  const all = getInventory();

  const newRecord = {
    id: Date.now(),
    ...record,
  };

  all.push(newRecord);
  localStorage.setItem(KEY, JSON.stringify(all));

  return newRecord;
}
