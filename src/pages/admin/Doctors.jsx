import React, { useState } from "react";
import doctors from "../../data/doctors";
import { saveDoctors } from "../../data/doctors"; // <-- required
import { Link } from "react-router-dom";

function Doctors() {
  const [showModal, setShowModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    id: "",
    name: "",
    dept: "",
  });

  // Add new doctor
  const handleAddDoctor = () => {
    if (!newDoctor.id || !newDoctor.name || !newDoctor.dept) {
      alert("Please fill all fields");
      return;
    }

    doctors.push({
      id: Number(newDoctor.id),
      name: newDoctor.name,
      dept: newDoctor.dept,
    });

    saveDoctors(doctors); // update localStorage

    setNewDoctor({ id: "", name: "", dept: "" });
    setShowModal(false);
    window.location.reload(); // refresh list
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#103151]">
          Doctors List
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-[#A0CAF0] text-[#103151] rounded-lg shadow hover:bg-[#8bb8e6]"
        >
          + Add Doctor
        </button>
      </div>

      {/* LIST CONTAINER */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <ul className="space-y-4">
          {doctors.map((doc) => (
            <li
              key={doc.id}
              className="p-4 border rounded-lg hover:shadow-md transition bg-[#F8F8F5]"
            >
              <Link
                to={`/doctor/${doc.id}`}
                className="text-[#6365B8] font-semibold text-lg underline hover:text-[#4c4fb2]"
              >
                {doc.name}
              </Link>

              <p className="text-[#103151] text-sm mt-1">
                Department:{" "}
                <span className="font-medium text-[#8E99E7]">{doc.dept}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ADD DOCTOR MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-[#103151]">
              Add New Doctor
            </h2>

            <input
              type="number"
              placeholder="Doctor ID"
              value={newDoctor.id}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, id: e.target.value })
              }
              className="border p-2 w-full rounded mb-3"
            />

            <input
              type="text"
              placeholder="Doctor Name"
              value={newDoctor.name}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, name: e.target.value })
              }
              className="border p-2 w-full rounded mb-3"
            />

            <input
              type="text"
              placeholder="Department"
              value={newDoctor.dept}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, dept: e.target.value })
              }
              className="border p-2 w-full rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddDoctor}
                className="px-5 py-2 bg-[#A2FCF5] text-[#103151] rounded shadow hover:bg-[#8cf0e8]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
