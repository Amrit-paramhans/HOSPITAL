import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdPerson, MdAdd, MdSearch } from "react-icons/md";
import { getPatients, addPatient } from "../../data/patientsStore";

function Patients() {
    const [patients, setPatients] = useState(getPatients());
    const [showModal, setShowModal] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "Male", phone: "" });
    const [searchTerm, setSearchTerm] = useState("");

    const handleAdd = () => {
        if (!newPatient.name || !newPatient.age) return alert("Name and Age required");
        addPatient(newPatient);
        setPatients(getPatients());
        setShowModal(false);
        setNewPatient({ name: "", age: "", gender: "Male", phone: "" });
    };

    const filtered = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Patients Directory</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-[#009688] text-white rounded-lg shadow-md hover:bg-[#00796B] transition-colors flex items-center gap-2"
                >
                    <MdAdd size={20} /> Add Patient
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 relative max-w-md">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search patients..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(p => (
                    <Link to={`/patient/${p.id}`} key={p.id} className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#E0F2F1] text-[#009688] flex items-center justify-center">
                                    <MdPerson size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 group-hover:text-[#009688] transition-colors">{p.name}</h3>
                                    <p className="text-sm text-gray-500">{p.age} yrs • {p.gender}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-400">
                                Phone: {p.phone || "N/A"}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Patient</h2>
                        <div className="space-y-3">
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Name"
                                value={newPatient.name}
                                onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                            />
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Age"
                                type="number"
                                value={newPatient.age}
                                onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
                            />
                            <select
                                className="w-full p-2 border rounded"
                                value={newPatient.gender}
                                onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Phone"
                                value={newPatient.phone}
                                onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleAdd} className="px-4 py-2 bg-[#009688] text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Patients;
