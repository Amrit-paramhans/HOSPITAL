const STORAGE_KEY = "hospital_entries";

export function getEntries() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addEntry(entry) {
  const existing = getEntries();
  existing.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}
