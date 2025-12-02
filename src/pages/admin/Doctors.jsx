import doctors from "../../data/doctors";
import { Link } from "react-router-dom";

function Doctors() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Doctors List</h1>

      <ul className="space-y-3">
        {doctors.map((doc) => (
          <li key={doc.id} className="p-3 border rounded-md">
            <Link
              to={`/doctor/${doc.id}`}
              className="text-blue-600 font-semibold"
            >
              {doc.name} — {doc.dept}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Doctors;
