import { useEffect, useState } from "react";
import api, { formatWhen } from "../api";

export default function EnrollmentsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/enrollments").then((response) => setRows(response.data));
  }, []);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-copper">Self enrollment</p>
      <h1 className="mt-2 font-serif text-4xl">Who joined</h1>
      <p className="mt-3 text-sm text-desk/70">Students enroll from their own portal. This list is read only.</p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-desk/10 text-xs uppercase tracking-wide text-desk/45">
            <tr>
              <th className="py-3 pr-4">Student</th>
              <th className="py-3 pr-4">Course</th>
              <th className="py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-desk/10">
                <td className="py-3 pr-4">
                  <p>{row.studentName}</p>
                  <p className="text-desk/50">{row.studentEmail}</p>
                </td>
                <td className="py-3 pr-4">{row.courseCode} — {row.courseTitle}</td>
                <td className="py-3">{formatWhen(row.enrolledAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="mt-4 text-sm text-desk/60">No one has enrolled yet.</p>}
      </div>
    </div>
  );
}
