// -------------------------------
// DOCTORS DATA WITH LOCALSTORAGE
// -------------------------------

// Default initial doctors list
const defaultDoctors = [
  { id: 101, name: "Dr. Amrit Raj", dept: "Medicine" },
  { id: 102, name: "Dr. Shibvanshu", dept: "Surgery" },
  { id: 103, name: "Dr. Rohit", dept: "Ortho" },
];

// Load doctors from localStorage OR use default ones
export function getDoctors() {
  const saved = localStorage.getItem("doctors");
  return saved ? JSON.parse(saved) : defaultDoctors;
}

// Save updated doctor list to localStorage
export function saveDoctors(updatedList) {
  localStorage.setItem("doctors", JSON.stringify(updatedList));
}

// Export the loaded doctors list
const doctors = getDoctors();
export default doctors;
