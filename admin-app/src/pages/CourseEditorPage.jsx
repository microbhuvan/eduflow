import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorText } from "../api";

export default function CourseEditorPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({ code: "", title: "", description: "" });
  const [lesson, setLesson] = useState({ title: "", notes: "" });
  const [error, setError] = useState("");

  const load = () => api.get(`/courses/${courseId}`).then((response) => {
    setCourse(response.data);
    setForm({
      code: response.data.code,
      title: response.data.title,
      description: response.data.description || "",
    });
  });

  useEffect(() => { load(); }, [courseId]);

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const saveCourse = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.put(`/courses/${courseId}`, form);
      await load();
    } catch (err) {
      setError(errorText(err, "Could not save the course."));
    }
  };

  const addLesson = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post(`/courses/${courseId}/lessons`, lesson);
      setLesson({ title: "", notes: "" });
      await load();
    } catch (err) {
      setError(errorText(err, "Could not add the lesson."));
    }
  };

  const removeCourse = async () => {
    if (!window.confirm("Delete this course, its lessons, and its enrollments?")) return;
    await api.delete(`/courses/${courseId}`);
    navigate("/app/courses");
  };

  if (!course) return <p className="text-sm text-desk/60">Loading course...</p>;

  return (
    <div>
      <Link to="/app/courses" className="text-sm text-copper">All courses</Link>
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <h1 className="font-serif text-4xl">{course.title}</h1>
        <button className="text-sm text-copper" onClick={removeCourse}>Delete course</button>
      </div>
      <form onSubmit={saveCourse} className="card mt-6 grid gap-4 p-5 md:grid-cols-2">
        <label className="text-sm">Code<input className="field mt-1" name="code" value={form.code} onChange={onChange} required /></label>
        <label className="text-sm">Title<input className="field mt-1" name="title" value={form.title} onChange={onChange} required /></label>
        <label className="text-sm md:col-span-2">Description<textarea className="field mt-1 min-h-24" name="description" value={form.description} onChange={onChange} required /></label>
        <button className="btn-primary md:col-span-2 md:w-fit">Save course</button>
      </form>
      {error && <p className="mt-3 text-sm text-copper">{error}</p>}
      <h2 className="mt-10 font-serif text-2xl">Lessons</h2>
      <div className="mt-4 space-y-4">
        {course.lessons.map((item) => (
          <LessonCard key={item.id} lesson={item} onChanged={load} />
        ))}
      </div>
      <form onSubmit={addLesson} className="card mt-6 space-y-4 p-5">
        <h3 className="font-medium">Add a lesson</h3>
        <label className="block text-sm">Title<input className="field mt-1" value={lesson.title} onChange={(event) => setLesson({ ...lesson, title: event.target.value })} required /></label>
        <label className="block text-sm">Notes<textarea className="field mt-1 min-h-32" value={lesson.notes} onChange={(event) => setLesson({ ...lesson, notes: event.target.value })} required /></label>
        <button className="btn-ghost">Add lesson</button>
      </form>
    </div>
  );
}

function LessonCard({ lesson, onChanged }) {
  const [title, setTitle] = useState(lesson.title);
  const [notes, setNotes] = useState(lesson.notes || "");
  const [message, setMessage] = useState("");

  const save = async () => {
    setMessage("");
    try {
      await api.put(`/lessons/${lesson.id}`, { title, notes });
      setMessage("Saved.");
      onChanged();
    } catch (err) {
      setMessage(errorText(err, "Could not save the lesson."));
    }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    setMessage("");
    try {
      await api.post(`/lessons/${lesson.id}/pdf`, body);
      setMessage("PDF attached.");
      onChanged();
    } catch (err) {
      setMessage(errorText(err, "Could not attach the PDF."));
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this lesson?")) return;
    await api.delete(`/lessons/${lesson.id}`);
    onChanged();
  };

  return (
    <article className="card p-5">
      <label className="block text-sm">Title<input className="field mt-1" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label className="mt-3 block text-sm">Notes<textarea className="field mt-1 min-h-28" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm">
          {lesson.hasPdf ? "Replace PDF" : "Attach PDF"}
          <input className="mt-1 block text-sm" type="file" accept="application/pdf" onChange={upload} />
        </label>
        <div className="flex gap-4">
          <button className="text-sm" onClick={save}>Save lesson</button>
          <button className="text-sm text-copper" onClick={remove}>Delete</button>
        </div>
      </div>
      {message && <p className="mt-3 text-sm text-desk/70">{message}</p>}
    </article>
  );
}
