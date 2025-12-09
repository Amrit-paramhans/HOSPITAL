import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdHistory, MdAdd, MdEdit, MdSave, MdClose } from "react-icons/md";
import { getPatients, updatePatient, deletePatient } from "../../data/patientsStore";
import { getEntries, updateEntry } from "../../data/entriesStore";
import doctors from "../../data/doctors";

function PatientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);

    // History Modal State
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyForm, setHistoryForm] = useState({ date: "", doctorId: "", diagnosis: "", prescription: "" });
    const [editingHistoryIndex, setEditingHistoryIndex] = useState(null); // null = adding new

    // Profile Edit Modal State
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: "", age: "", gender: "", phone: "" });

    useEffect(() => {
        const all = getPatients();
        const found = all.find(p => p.id === Number(id));
        if (found) {
            setPatient(found);
            setProfileForm({ name: found.name, age: found.age, gender: found.gender, phone: found.phone });
        } else {
            navigate("/patients");
        }
    }, [id, navigate]);

    // --- HISTORY HANDLERS ---
    const handleOpenAddHistory = () => {
        setEditingHistoryIndex(null);
        setHistoryForm({ date: new Date().toISOString().split('T')[0], doctorId: "", diagnosis: "", prescription: "" });
        setShowHistoryModal(true);
    };

    const handleOpenEditHistory = (index, historyItem) => {
        setEditingHistoryIndex(index);
        setHistoryForm(historyItem);
        setShowHistoryModal(true);
    };

    const handleSaveHistory = () => {
        if (!historyForm.date || !historyForm.diagnosis) return alert("Date and Diagnosis required");

        let updatedHistory = [...patient.history];
        if (editingHistoryIndex !== null) {
            // Edit existing
            updatedHistory[editingHistoryIndex] = historyForm;
        } else {
            // Add new
            updatedHistory = [historyForm, ...updatedHistory];
        }

        const updatedPatient = { ...patient, history: updatedHistory };
        updatePatient(updatedPatient);
        setPatient(updatedPatient);
        setShowHistoryModal(false);
    };

    // --- PROFILE HANDLERS ---
    const handleSaveProfile = () => {
        if (!profileForm.name || !profileForm.age) return alert("Name and Age required");

        const updatedPatient = { ...patient, ...profileForm };
        updatePatient(updatedPatient);
        setPatient(updatedPatient);
        setShowProfileModal(false);
    };

    const handleDelete = () => {
        if (window.confirm("Delete this patient?")) {
            deletePatient(patient.id);
            navigate("/patients");
        }
    };

    // --- ENTRY EDIT HANDLERS ---
    const [showEntryEditModal, setShowEntryEditModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [entryDiagnosis, setEntryDiagnosis] = useState("");

    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
        setEntryDiagnosis(entry.diagnosis || "");
        setShowEntryEditModal(true);
    };

    const handleSaveEntryDiagnosis = () => {
        if (!editingEntry) return;

        const updatedEntry = { ...editingEntry, diagnosis: entryDiagnosis };
        updateEntry(updatedEntry);

        setShowEntryEditModal(false);
        setEditingEntry(null);
        // Force re-render or reload to show changes
        window.location.reload();
    };

    if (!patient) return <div>Loading...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <button onClick={() => navigate("/patients")} className="flex items-center text-gray-500 hover:text-[#009688] mb-6">
                <MdArrowBack className="mr-2" /> Back to Patients
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#009688] hover:bg-gray-50 rounded-full transition-colors"
                            title="Edit Profile"
                        >
                            <MdEdit size={20} />
                        </button>

                        <div className="w-20 h-20 rounded-full bg-[#E0F2F1] text-[#009688] flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl font-bold">{patient.name.charAt(0)}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">{patient.name}</h1>
                        <p className="text-center text-gray-500 mb-6">{patient.age} years • {patient.gender}</p>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Phone</span>
                                <span className="font-medium">{patient.phone || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">ID</span>
                                <span className="font-medium">#{patient.id}</span>
                            </div>
                        </div>

                        <button onClick={handleDelete} className="w-full mt-6 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                            Delete Patient
                        </button>
                    </div>
                </div>

                {/* Medical History & Inventory Log */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. MANUAL HISTORY (Notes) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <MdHistory /> Medical Notes
                            </h2>
                            <button
                                onClick={handleOpenAddHistory}
                                className="px-3 py-1 bg-[#009688] text-white rounded-lg text-sm flex items-center gap-1"
                            >
                                <MdAdd /> Add Note
                            </button>
                        </div>

                        <div className="space-y-6">
                            {patient.history.length === 0 && <p className="text-gray-400 italic">No notes recorded.</p>}
                            {patient.history.map((h, i) => {
                                const docName = doctors.find(d => d.id === Number(h.doctorId))?.name || "Unknown Doctor";
                                return (
                                    <div key={i} className="relative pl-6 border-l-2 border-gray-200 pb-6 last:pb-0 group">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#009688]"></div>

                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-sm text-gray-400 mb-1">{h.date}</div>
                                                <h3 className="font-bold text-gray-800 text-lg">{h.diagnosis}</h3>
                                                <p className="text-[#009688] text-sm mb-2">{docName}</p>
                                            </div>
                                            <button
                                                onClick={() => handleOpenEditHistory(i, h)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-[#009688] transition-opacity"
                                                title="Edit Note"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                                            <span className="font-semibold">Rx:</span> {h.prescription}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. INVENTORY USAGE LOG (Auto-linked) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <MdHistory /> Treatment & Inventory Log
                        </h2>

                        {getEntries().filter(e => e.patientId === patient.id).length === 0 ? (
                            <p className="text-gray-400 italic">No inventory usage recorded for this patient.</p>
                        ) : (
                            <div className="space-y-4">
                                {getEntries().filter(e => e.patientId === patient.id).map(entry => (
                                    <div key={entry.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-800">{entry.diagnosis || "No Diagnosis"}</h3>
                                                    <button
                                                        onClick={() => handleEditEntry(entry)}
                                                        className="text-gray-400 hover:text-[#009688] opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Edit Diagnosis"
                                                    >
                                                        <MdEdit size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-[#009688] text-sm font-medium">{entry.doctorName}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{entry.date}</span>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Medicines / Tools Used:</p>
                                            <ul className="space-y-1">
                                                {entry.items.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-700 flex justify-between">
                                                        <span>• {item.name}</span>
                                                        <span className="font-mono text-gray-500">x{item.qty}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* HISTORY MODAL */}
            {showHistoryModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                        <h2 className="text-xl font-bold mb-4">{editingHistoryIndex !== null ? "Edit Medical Note" : "Add Medical Note"}</h2>
                        <div className="space-y-3">
                            <input type="date" className="w-full p-2 border rounded" value={historyForm.date} onChange={e => setHistoryForm({ ...historyForm, date: e.target.value })} />
                            <select className="w-full p-2 border rounded" value={historyForm.doctorId} onChange={e => setHistoryForm({ ...historyForm, doctorId: e.target.value })}>
                                <option value="">Select Doctor</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <input className="w-full p-2 border rounded" placeholder="Diagnosis" value={historyForm.diagnosis} onChange={e => setHistoryForm({ ...historyForm, diagnosis: e.target.value })} />
                            <textarea className="w-full p-2 border rounded" placeholder="Prescription" value={historyForm.prescription} onChange={e => setHistoryForm({ ...historyForm, prescription: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowHistoryModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleSaveHistory} className="px-4 py-2 bg-[#009688] text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PROFILE EDIT MODAL */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Patient Profile</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500">Name</label>
                                <input className="w-full p-2 border rounded" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-1/2">
                                    <label className="text-xs text-gray-500">Age</label>
                                    <input type="number" className="w-full p-2 border rounded" value={profileForm.age} onChange={e => setProfileForm({ ...profileForm, age: e.target.value })} />
                                </div>
                                <div className="w-1/2">
                                    <label className="text-xs text-gray-500">Gender</label>
                                    <select className="w-full p-2 border rounded" value={profileForm.gender} onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Phone</label>
                                <input className="w-full p-2 border rounded" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowProfileModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleSaveProfile} className="px-4 py-2 bg-[#009688] text-white rounded">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ENTRY DIAGNOSIS EDIT MODAL */}
            {showEntryEditModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Diagnosis</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500">Diagnosis / Problem</label>
                                <input
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#009688] outline-none"
                                    value={entryDiagnosis}
                                    onChange={e => setEntryDiagnosis(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowEntryEditModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleSaveEntryDiagnosis} className="px-4 py-2 bg-[#009688] text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientDetails;
