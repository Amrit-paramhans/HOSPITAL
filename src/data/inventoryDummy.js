// src/data/inventoryDummy.js

let inventoryData = [];

export function saveInventory(record) {
  // Remove existing entry for that nurseEntryId
  inventoryData = inventoryData.filter(
    (i) => i.nurseEntryId !== record.nurseEntryId
  );

  // Add new one
  inventoryData.push(record);
}

export function getInventory() {
  return inventoryData;
}

export default inventoryData;
