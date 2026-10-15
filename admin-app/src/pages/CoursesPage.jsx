import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorText } from "../api";

const empty = { code: "", title: "", description: "" };

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.get("/courses").then((response) => setCourses(response.data));
  useEffect(() => { load(); }, []);

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/courses", form);
      navigate(`/app/courses/${data.id}`);
    } catch (err) {
      setError(errorText(err, "Could not create the course."));
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-copper">Catalogue</p>
      <h1 className="mt-2 font-serif text-4xl">Courses</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {courses.map((course) => (
            <Link key={course.id} to={`/app/courses/${course.id}`} className="card block p-5 hover:border-copper">
              <p className="text-xs tracking-wide text-copper">{course.code}</p>
              <h2 className="mt-1 text-lg">{course.title}</h2>
              <p className="mt-2 text-sm text-desk/65">{course.lessonCount} lessons</p>
            </Link>
          ))}
          {courses.length === 0 && <p className="text-sm text-desk/60">No courses yet.</p>}
        </div>
        <form onSubmit={onSubmit} className="card h-fit p-5">
          <h2 className="font-serif text-2xl">New course</h2>
          <label className="mt-4 block text-sm">Code<input className="field mt-1" name="code" value={form.code} onChange={onChange} required /></label>
          <label className="mt-4 block text-sm">Title<input className="field mt-1" name="title" value={form.title} onChange={onChange} required /></label>
          <label className="mt-4 block text-sm">Description<textarea className="field mt-1 min-h-28" name="description" value={form.description} onChange={onChange} required /></label>
          {error && <p className="mt-3 text-sm text-copper">{error}</p>}
          <button className="btn-primary mt-4 w-full" disabled={busy}>{busy ? "Creating..." : "Create course"}</button>
        </form>
      </div>
    </div>
  );
}
