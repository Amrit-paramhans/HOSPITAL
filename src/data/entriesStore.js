// entriesStore.js

const STORAGE_KEY = "entries";

// Load entries from localStorage
export function getEntries() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save all entries back to storage
export function saveEntries(allEntries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allEntries));
}

// Add a new nurse entry
export function addEntry(entry) {
  const all = getEntries();

  const newEntry = {
    id: Date.now(), // 🔥 FIX 1: Ensure every entry has unique ID
    doctorId: entry.doctorId, // 🔥 FIX 2: include doctorId
    doctorName: entry.doctorName, // 🔥 FIX 3: include doctorName
    date: entry.date,
    items: entry.items,
  };

  all.push(newEntry);
  saveEntries(all);
}

// Update an existing entry
export function updateEntry(updatedEntry) {
  const all = getEntries();
  const index = all.findIndex((e) => e.id === updatedEntry.id);
  if (index !== -1) {
    all[index] = updatedEntry;
    saveEntries(all);
  }
}

// Delete an entry
export function deleteEntry(id) {
  const all = getEntries();
  const filtered = all.filter((e) => e.id !== id);
  saveEntries(filtered);
}

// Delete all entries for a specific doctor and return their IDs
export function deleteEntriesByDoctorId(doctorId) {
  const all = getEntries();
  const entriesToDelete = all.filter((e) => e.doctorId === doctorId);
  const deletedIds = entriesToDelete.map((e) => e.id);

  const remaining = all.filter((e) => e.doctorId !== doctorId);
  saveEntries(remaining);

  return deletedIds;
}

// Clean up entries that don't belong to any valid doctor
export function cleanupOrphanedEntries(validDoctorIds) {
  const all = getEntries();
  // Find entries where doctorId is NOT in the valid list
  const entriesToDelete = all.filter((e) => !validDoctorIds.includes(e.doctorId));
  const deletedIds = entriesToDelete.map((e) => e.id);

  const remaining = all.filter((e) => validDoctorIds.includes(e.doctorId));
  saveEntries(remaining);

  return deletedIds;
}
