import React, { useState } from "react";
import doctors from "../../data/doctors";
import { saveDoctors } from "../../data/doctors";
import { deleteEntriesByDoctorId, cleanupOrphanedEntries, getEntries } from "../../data/entriesStore";
import { deleteInventoryByEntryIds, cleanupOrphanedInventory } from "../../data/inventoryStore";
import { Link } from "react-router-dom";
import { MdAdd, MdPerson, MdLocalHospital, MdEdit, MdDelete, MdCleaningServices } from "react-icons/md";

function Doctors() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    id: "",
    name: "",
    dept: "",
  });

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor? This will also delete all their reports and data.")) {
      // 1. Delete associated entries and get their IDs
      const deletedEntryIds = deleteEntriesByDoctorId(id);

      // 2. Delete associated inventory records using those IDs
      deleteInventoryByEntryIds(deletedEntryIds);

      // 3. Delete the doctor from the list
      const index = doctors.findIndex((d) => d.id === id);
      if (index !== -1) {
        doctors.splice(index, 1);
        saveDoctors(doctors);
        window.location.reload();
      }
    }
  };

  // Handle Cleanup
  const handleCleanup = () => {
    if (window.confirm("This will remove all data (reports, analytics) for doctors that no longer exist. Continue?")) {
      // 1. Get valid doctor IDs
      const validDoctorIds = doctors.map(d => d.id);

      // FAILSAFE: If no doctors exist, clear EVERYTHING
      if (validDoctorIds.length === 0) {
        localStorage.setItem("entries", "[]");
        localStorage.setItem("inventory_entries", "[]");
        alert("All data cleared since no doctors exist.");
        window.location.reload();
        return;
      }

      // 2. Remove entries for invalid doctors
      cleanupOrphanedEntries(validDoctorIds);

      // 3. Get UPDATED valid entry IDs (after step 2)
      const validEntries = getEntries();
      const validEntryIds = validEntries.map(e => e.id);

      // 4. Remove inventory records that point to invalid entries
      cleanupOrphanedInventory(validEntryIds);

      alert("Cleanup complete! Orphaned data removed.");
      window.location.reload();
    }
  };

  // Handle Edit Click
  const handleEdit = (doctor) => {
    setNewDoctor({
      id: doctor.id,
      name: doctor.name,
      dept: doctor.dept,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    setNewDoctor({ id: "", name: "", dept: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  // Save (Add or Update)
  const handleSaveDoctor = () => {
    if (!newDoctor.id || !newDoctor.name || !newDoctor.dept) {
      alert("Please fill all fields");
      return;
    }

    if (isEditing) {
      // Update existing
      const index = doctors.findIndex((d) => d.id === Number(newDoctor.id));
      if (index !== -1) {
        doctors[index] = {
          id: Number(newDoctor.id),
          name: newDoctor.name,
          dept: newDoctor.dept,
        };
        saveDoctors(doctors);
      }
    } else {
      // Add new
      doctors.push({
        id: Number(newDoctor.id),
        name: newDoctor.name,
        dept: newDoctor.dept,
      });
      saveDoctors(doctors);
    }

    setNewDoctor({ id: "", name: "", dept: "" });
    setShowModal(false);
    setIsEditing(false);
    window.location.reload();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">
          Doctors List
        </h1>

        <div className="flex gap-3">
          <button
            onClick={handleCleanup}
            className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg shadow-sm hover:bg-orange-200 transition-colors flex items-center space-x-2 font-medium"
            title="Remove data for deleted doctors"
          >
            <MdCleaningServices size={20} />
            <span>Clean Data</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#009688] text-white rounded-lg shadow-md hover:bg-[#00796B] transition-colors flex items-center space-x-2 font-medium"
          >
            <MdAdd size={20} />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* LIST CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="p-3 rounded-lg bg-[#E0F2F1] text-[#009688]">
                <MdPerson size={24} />
              </div>

              <div className="flex-1">
                <Link
                  to={`/doctor/${doc.id}`}
                  className="text-lg font-bold text-gray-800 hover:text-[#009688] transition-colors block mb-1"
                >
                  {doc.name}
                </Link>

                <p className="text-gray-500 text-sm flex items-center">
                  <MdLocalHospital className="mr-1 text-gray-400" />
                  {doc.dept}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end space-x-2 mt-auto pt-4 border-t border-gray-50">
              <button
                onClick={() => handleEdit(doc)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <MdEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-100">
              {isEditing ? "Edit Doctor" : "Add New Doctor"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
                <input
                  type="number"
                  placeholder="e.g. 101"
                  value={newDoctor.id}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, id: e.target.value })
                  }
                  disabled={isEditing} // Disable ID editing to prevent dupes/issues
                  className={`w-full border border-gray-300 p-2 rounded-lg outline-none transition-all ${isEditing ? 'bg-gray-100 text-gray-500' : 'focus:ring-2 focus:ring-[#009688] focus:border-[#009688]'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Smith"
                  value={newDoctor.name}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, name: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-[#009688] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology"
                  value={newDoctor.dept}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, dept: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-[#009688] outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveDoctor}
                className="px-6 py-2 bg-[#009688] text-white rounded-lg shadow-md hover:bg-[#00796B] transition-colors font-medium"
              >
                {isEditing ? "Update Doctor" : "Save Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
