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
