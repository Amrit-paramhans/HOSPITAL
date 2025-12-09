const KEY = "hospital_patients";

// Mock Data
const initialPatients = [
    {
        id: 1,
        name: "John Doe",
        age: 45,
        gender: "Male",
        phone: "555-0123",
        history: [
            { date: "2023-11-15", doctorId: 101, diagnosis: "Hypertension", prescription: "Lisinopril 10mg" },
            { date: "2023-12-20", doctorId: 102, diagnosis: "Flu", prescription: "Tamiflu" }
        ]
    },
    {
        id: 2,
        name: "Jane Smith",
        age: 32,
        gender: "Female",
        phone: "555-0456",
        history: [
            { date: "2024-01-10", doctorId: 101, diagnosis: "Routine Checkup", prescription: "Vitamins" }
        ]
    }
];

export function getPatients() {
    const data = localStorage.getItem(KEY);
    if (!data) {
        localStorage.setItem(KEY, JSON.stringify(initialPatients));
        return initialPatients;
    }
    return JSON.parse(data);
}

export function savePatients(patients) {
    localStorage.setItem(KEY, JSON.stringify(patients));
}

export function addPatient(patient) {
    const patients = getPatients();
    const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    const newPatient = { ...patient, id: newId, history: [] };
    patients.push(newPatient);
    savePatients(patients);
    return newPatient;
}

export function updatePatient(updatedPatient) {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
        patients[index] = updatedPatient;
        savePatients(patients);
    }
}

export function deletePatient(id) {
    const patients = getPatients();
    const filtered = patients.filter(p => p.id !== id);
    savePatients(filtered);
}
