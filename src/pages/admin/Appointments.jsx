import React, { useState } from "react";
import { MdEvent, MdAdd, MdCheckCircle, MdCancel, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { getAppointments, addAppointment, updateAppointment, updateAppointmentStatus, deleteAppointment } from "../../data/appointmentsStore";
import { getEntries } from "../../data/entriesStore";
import { getPatients } from "../../data/patientsStore";
import doctors from "../../data/doctors";

function Appointments() {
    const [appointments, setAppointments] = useState(getAppointments());
    const [showModal, setShowModal] = useState(false);
    const [newApp, setNewApp] = useState({ patientName: "", doctorId: "", date: "", time: "", type: "Checkup", notes: "" });
    const [editingAppId, setEditingAppId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleOpenAdd = () => {
        setEditingAppId(null);
        setNewApp({ patientName: "", doctorId: "", date: selectedDate, time: "", type: "Checkup", notes: "" });
        setShowModal(true);
    };

    const handleOpenEdit = (app) => {
        setEditingAppId(app.id);
        setNewApp(app);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!newApp.patientName || !newApp.date) return alert("Details required");

        if (editingAppId) {
            updateAppointment(newApp);
        } else {
            addAppointment(newApp);
        }

        setAppointments(getAppointments());
        setShowModal(false);
    };

    const handleStatus = (id, status) => {
        updateAppointmentStatus(id, status);
        setAppointments(getAppointments());
    };

    const handleDelete = (id) => {
        if (window.confirm("Cancel this appointment?")) {
            deleteAppointment(id);
            setAppointments(getAppointments());
        }
    };

    // Filter data for selected date
    const filteredAppointments = appointments.filter(a => a.date === selectedDate);
    const dailyEntries = getEntries().filter(e => e.date === selectedDate);

    // Calculate Inventory Usage for the day
    const inventoryUsage = {};
    dailyEntries.forEach(entry => {
        entry.items.forEach(item => {
            if (!inventoryUsage[item.name]) inventoryUsage[item.name] = 0;
            inventoryUsage[item.name] += item.qty;
        });
    });

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Appointments & Daily Log</h1>
                    <p className="text-gray-500 mt-1">Manage schedule and view daily history</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 bg-[#009688] text-white rounded-lg shadow-md hover:bg-[#00796B] transition-colors flex items-center gap-2"
                >
                    <MdAdd size={20} /> Schedule
                </button>
            </div>

            {/* Date Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
                <span className="font-bold text-gray-700">Select Date:</span>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#009688] outline-none"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMN 1: SCHEDULE */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MdEvent /> Schedule for {selectedDate}
                    </h2>

                    {filteredAppointments.length === 0 ? (
                        <p className="text-gray-400 italic">No appointments scheduled for this day.</p>
                    ) : (
                        filteredAppointments.map(app => {
                            const doc = doctors.find(d => d.id === Number(app.doctorId));
                            return (
                                <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${app.type === 'Surgery' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <MdEvent size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">
                                                {app.patientId ? (
                                                    <Link to={`/patient/${app.patientId}`} className="hover:text-[#009688] hover:underline">
                                                        {app.patientName}
                                                    </Link>
                                                ) : (
                                                    // Fallback: Try to find by name if ID is missing
                                                    (() => {
                                                        const found = getPatients().find(p => p.name === app.patientName);
                                                        return found ? (
                                                            <Link to={`/patient/${found.id}`} className="hover:text-[#009688] hover:underline">
                                                                {app.patientName}
                                                            </Link>
                                                        ) : (
                                                            app.patientName
                                                        );
                                                    })()
                                                )}
                                            </h3>
                                            <p className="text-[#009688] font-medium">{doc?.name || "Unknown"}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-gray-500 text-sm">{app.time}</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-sm font-semibold text-gray-600">{app.type || "Checkup"}</span>
                                            </div>
                                            {app.notes && <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">Note: {app.notes}</p>}

                                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${app.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                app.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEdit(app)} className="p-2 text-gray-500 hover:bg-gray-50 rounded" title="Edit">
                                            <MdEdit size={24} />
                                        </button>
                                        {app.status === 'Scheduled' && (
                                            <>
                                                <button onClick={() => handleStatus(app.id, 'Completed')} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Complete">
                                                    <MdCheckCircle size={24} />
                                                </button>
                                                <button onClick={() => handleDelete(app.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Cancel">
                                                    <MdCancel size={24} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* COLUMN 2: DAILY SUMMARY (Inventory & Activity) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Inventory Usage</h2>
                        {Object.keys(inventoryUsage).length === 0 ? (
                            <p className="text-gray-400 italic text-sm">No inventory items used today.</p>
                        ) : (
                            <ul className="space-y-3">
                                {Object.entries(inventoryUsage).map(([item, qty]) => (
                                    <li key={item} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                                        <span className="text-gray-700 font-medium">{item}</span>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">{qty}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Surgeries</h2>
                        {filteredAppointments.filter(a => a.type === 'Surgery' && a.status === 'Scheduled').length === 0 ? (
                            <p className="text-gray-400 italic text-sm">No pending surgeries for today.</p>
                        ) : (
                            <ul className="space-y-3">
                                {filteredAppointments.filter(a => a.type === 'Surgery' && a.status === 'Scheduled').map(app => (
                                    <li key={app.id} className="bg-red-50 p-3 rounded-lg border border-red-100">
                                        <div className="font-bold text-red-800 text-sm">{app.patientName}</div>
                                        <div className="text-xs text-red-600 mt-1">{app.time} • {app.notes || "Surgery"}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                        <h2 className="text-xl font-bold mb-4">{editingAppId ? "Edit Appointment" : "Schedule Appointment"}</h2>
                        <div className="space-y-3">
                            <select
                                className="w-full p-2 border rounded"
                                value={newApp.patientId || ""}
                                onChange={e => {
                                    const p = getPatients().find(p => p.id === Number(e.target.value));
                                    setNewApp({ ...newApp, patientId: e.target.value, patientName: p ? p.name : "" });
                                }}
                            >
                                <option value="">Select Patient</option>
                                {getPatients().map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <select className="w-full p-2 border rounded" value={newApp.doctorId} onChange={e => setNewApp({ ...newApp, doctorId: e.target.value })}>
                                <option value="">Select Doctor</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <input type="date" className="w-full p-2 border rounded" value={newApp.date} onChange={e => setNewApp({ ...newApp, date: e.target.value })} />
                                <input type="time" className="w-full p-2 border rounded" value={newApp.time} onChange={e => setNewApp({ ...newApp, time: e.target.value })} />
                            </div>
                            <select className="w-full p-2 border rounded" value={newApp.type || "Checkup"} onChange={e => setNewApp({ ...newApp, type: e.target.value })}>
                                <option value="Checkup">Checkup</option>
                                <option value="Surgery">Surgery</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                            <textarea className="w-full p-2 border rounded" placeholder="Notes (Optional)" value={newApp.notes || ""} onChange={e => setNewApp({ ...newApp, notes: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-[#009688] text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Appointments;
