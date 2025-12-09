const KEY = "hospital_appointments";

const initialAppointments = [
    { id: 1, patientName: "John Doe", doctorId: 101, date: "2024-03-20", time: "10:00", status: "Scheduled" },
    { id: 2, patientName: "Jane Smith", doctorId: 102, date: "2024-03-21", time: "14:30", status: "Completed" }
];

export function getAppointments() {
    const data = localStorage.getItem(KEY);
    if (!data) {
        localStorage.setItem(KEY, JSON.stringify(initialAppointments));
        return initialAppointments;
    }
    return JSON.parse(data);
}

export function saveAppointments(apps) {
    localStorage.setItem(KEY, JSON.stringify(apps));
}

export function addAppointment(app) {
    const apps = getAppointments();
    const newId = apps.length > 0 ? Math.max(...apps.map(a => a.id)) + 1 : 1;
    const newApp = {
        ...app,
        id: newId,
        status: "Scheduled",
        type: app.type || "Checkup", // NEW: Surgery, Follow-up, etc.
        notes: app.notes || "",      // NEW: Notes
        patientId: app.patientId || null // NEW: Link to Patient
    };
    apps.push(newApp);
    saveAppointments(apps);
    return newApp;
}

export function updateAppointmentStatus(id, status) {
    const apps = getAppointments();
    const index = apps.findIndex(a => a.id === id);
    if (index !== -1) {
        apps[index].status = status;
        saveAppointments(apps);
    }
}

export function updateAppointment(updatedApp) {
    const apps = getAppointments();
    const index = apps.findIndex(a => a.id === updatedApp.id);
    if (index !== -1) {
        apps[index] = { ...apps[index], ...updatedApp };
        saveAppointments(apps);
    }
}

export function deleteAppointment(id) {
    const apps = getAppointments();
    const filtered = apps.filter(a => a.id !== id);
    saveAppointments(filtered);
}
