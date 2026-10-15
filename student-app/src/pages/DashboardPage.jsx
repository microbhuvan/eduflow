import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { formatWhen } from "../api";
import { useAuth } from "../auth";

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    api.get("/me/courses").then((response) => setCourses(response.data));
    api.get("/notices").then((response) => setNotices(response.data.slice(0, 3)));
  }, []);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-brass">Dashboard</p>
      <h1 className="mt-2 font-serif text-4xl">Good to see you, {user?.name?.split(" ")[0]}.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
        Your courses, the latest class notices, and a direct way back into the notes.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Enrolled courses" value={courses.length} />
        <Stat label="Latest notices" value={notices.length} />
        <Stat label="Portal" value="Student" />
      </div>
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl">Continue</h2>
          <Link to="/app/courses" className="text-sm text-pine">All courses</Link>
        </div>
        {courses.length === 0 ? (
          <p className="card mt-4 px-5 py-6 text-sm text-ink/70">You have not enrolled yet. Open the course list and join one.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Link key={course.id} to={`/app/courses/${course.courseId}`} className="card block p-5 hover:border-pine">
                <p className="text-xs tracking-wide text-brass">{course.code}</p>
                <p className="mt-2 font-medium">{course.title}</p>
                <p className="mt-3 text-xs text-ink/50">Enrolled {formatWhen(course.enrolledAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl">Notices</h2>
          <Link to="/app/notices" className="text-sm text-pine">View all</Link>
        </div>
        <div className="mt-4 space-y-3">
          {notices.length === 0 && <p className="text-sm text-ink/60">No notices yet.</p>}
          {notices.map((notice) => (
            <article key={notice.id} className="card p-5">
              <p className="font-medium">{notice.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{notice.message}</p>
              <p className="mt-3 text-xs text-ink/45">{formatWhen(notice.createdAt)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
