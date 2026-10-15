import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((response) => setStats(response.data));
  }, []);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-copper">Overview</p>
      <h1 className="mt-2 font-serif text-4xl">Staff desk</h1>
      <p className="mt-3 max-w-2xl text-sm text-desk/70">Courses you publish, students who enrolled themselves, and questions still waiting.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Students" value={stats?.students ?? "—"} />
        <Stat label="Courses" value={stats?.courses ?? "—"} />
        <Stat label="Enrollments" value={stats?.enrollments ?? "—"} />
        <Stat label="Open questions" value={stats?.openQuestions ?? "—"} />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/app/courses" className="btn-primary">Manage courses</Link>
        <Link to="/app/questions" className="btn-ghost">Open questions</Link>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-desk/45">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
