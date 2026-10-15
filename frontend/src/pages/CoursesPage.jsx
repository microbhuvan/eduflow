import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const emptyForm = {
  title: "",
  description: "",
  courseCode: "",
  credits: 3,
  syllabus: "",
  learningOutcomes: "",
};

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    const { data } = await api.get("/courses");
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.courseCode || "").toLowerCase().includes(q)
    );
  }, [courses, query]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title is required");
    const payload = {
      title: form.title,
      description: form.description || null,
      courseCode: form.courseCode?.trim() || null,
      credits: form.credits ? Number(form.credits) : 3,
      syllabus: form.syllabus || null,
      learningOutcomes: form.learningOutcomes || null,
    };
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        toast.success("Course updated");
      } else {
        await api.post("/courses", payload);
        toast.success("Course created");
      }
      setForm(emptyForm);
      setEditingId(null);
      setOpen(false);
      await loadCourses();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save course");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this course and all its modules, announcements, and enrollments?")) return;
    await api.delete(`/courses/${id}`);
    toast.success("Course deleted");
    await loadCourses();
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      description: c.description || "",
      courseCode: c.courseCode || "",
      credits: c.credits ?? 3,
      syllabus: c.syllabus || "",
      learningOutcomes: c.learningOutcomes || "",
    });
    setOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Courses</h2>
        {user.role === "ADMIN" && (
          <button
            className="bg-blue-600 text-white hover:bg-blue-700 w-fit"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setOpen(true);
            }}
          >
            Add course
          </button>
        )}
      </div>

      <input
        type="search"
        placeholder="Search by title, code, or description…"
        className="max-w-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {user.role === "ADMIN" && (
        <Modal isOpen={open} title={editingId ? "Edit course" : "Add course"} onClose={() => setOpen(false)}>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 max-h-[70vh] overflow-y-auto pr-1">
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input
              placeholder="Course code (e.g. CS101)"
              value={form.courseCode}
              onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
            />
            <label className="text-sm text-gray-600">
              Credits
              <input
                type="number"
                min={1}
                max={30}
                className="mt-1"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
              />
            </label>
            <textarea
              rows={3}
              placeholder="Short description"
              className="w-full border rounded-md px-3 py-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <textarea
              rows={4}
              placeholder="Syllabus (week-by-week or topics)"
              className="w-full border rounded-md px-3 py-2"
              value={form.syllabus}
              onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
            />
            <textarea
              rows={4}
              placeholder="Learning outcomes (one per line)"
              className="w-full border rounded-md px-3 py-2"
              value={form.learningOutcomes}
              onChange={(e) => setForm({ ...form, learningOutcomes: e.target.value })}
            />
            <button className="bg-blue-600 text-white hover:bg-blue-700">{editingId ? "Save changes" : "Create course"}</button>
          </form>
        </Modal>
      )}

      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Code</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Credits</th>
              <th className="text-left p-3">Classroom</th>
              {user.role === "ADMIN" && <th className="text-left p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-mono text-gray-700">{c.courseCode || "—"}</td>
                <td className="p-3 font-medium">{c.title}</td>
                <td className="p-3">{c.credits ?? 3}</td>
                <td className="p-3">
                  <Link to={`/courses/${c.id}`} className="text-blue-600 hover:underline">
                    Open
                  </Link>
                </td>
                {user.role === "ADMIN" && (
                  <td className="p-3 space-x-2 whitespace-nowrap">
                    <button type="button" onClick={() => openEdit(c)} className="bg-amber-500 text-white">
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete(c.id)} className="bg-red-500 text-white">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-4 text-gray-500">No courses match your search.</p>}
      </div>
    </div>
  );
}
