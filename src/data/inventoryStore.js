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

// Delete inventory records linked to specific nurse entry IDs
export function deleteInventoryByEntryIds(entryIds) {
  if (!entryIds || entryIds.length === 0) return;

  const all = getInventory();
  // Filter out any inventory record whose nurseEntryId is in the list of deleted entryIds
  const remaining = all.filter((inv) => !entryIds.includes(inv.nurseEntryId));

  localStorage.setItem(KEY, JSON.stringify(remaining));
}

// Clean up inventory records that point to non-existent nurse entries
export function cleanupOrphanedInventory(validEntryIds) {
  const all = getInventory();
  // Keep only inventory records whose nurseEntryId exists in the validEntryIds list
  const remaining = all.filter((inv) => validEntryIds.includes(inv.nurseEntryId));

  localStorage.setItem(KEY, JSON.stringify(remaining));
}

// Remove a specific item from an inventory record
export function removeItemFromInventory(nurseEntryId, itemName) {
  const all = getInventory();
  const index = all.findIndex((i) => i.nurseEntryId === nurseEntryId);

  if (index !== -1) {
    const record = all[index];
    // Filter out the item
    if (record.itemsVerified) {
      record.itemsVerified = record.itemsVerified.filter((i) => i.name !== itemName);
      all[index] = record;
      localStorage.setItem(KEY, JSON.stringify(all));
    }
  }
}
