import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "learning", label: "Syllabus & outcomes" },
  { id: "modules", label: "Modules" },
  { id: "announcements", label: "Announcements" },
  { id: "roster", label: "Class roster", adminOnly: true },
];

const emptyModule = { title: "", content: "", sortOrder: "" };
const emptyAnnouncement = { title: "", message: "" };

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [moduleModal, setModuleModal] = useState(false);
  const [announceModal, setAnnounceModal] = useState(false);
  const [moduleForm, setModuleForm] = useState(emptyModule);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [announceForm, setAnnounceForm] = useState(emptyAnnouncement);

  const load = async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}/workspace`);
      setWorkspace(data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not load course");
      navigate(user?.role === "STUDENT" ? "/my-courses" : "/courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const saveModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) return toast.error("Module title is required");
    const body = {
      title: moduleForm.title,
      content: moduleForm.content,
      sortOrder: moduleForm.sortOrder === "" ? null : Number(moduleForm.sortOrder),
    };
    try {
      if (editingModuleId) {
        await api.put(`/courses/${courseId}/modules/${editingModuleId}`, body);
        toast.success("Module updated");
      } else {
        await api.post(`/courses/${courseId}/modules`, body);
        toast.success("Module added");
      }
      setModuleModal(false);
      setModuleForm(emptyModule);
      setEditingModuleId(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Save failed");
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Remove this module?")) return;
    await api.delete(`/courses/${courseId}/modules/${id}`);
    toast.success("Module removed");
    await load();
  };

  const postAnnouncement = async (e) => {
    e.preventDefault();
    if (!announceForm.title.trim() || !announceForm.message.trim()) {
      return toast.error("Title and message are required");
    }
    try {
      await api.post(`/courses/${courseId}/announcements`, announceForm);
      toast.success("Announcement posted");
      setAnnounceModal(false);
      setAnnounceForm(emptyAnnouncement);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post");
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    await api.delete(`/courses/${courseId}/announcements/${id}`);
    toast.success("Removed");
    await load();
  };

  if (loading || !workspace) return <LoadingSpinner />;

  const c = workspace.course;
  const visibleTabs = TABS.filter((t) => !t.adminOnly || user?.role === "ADMIN");

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/courses" className="text-sm text-blue-600 hover:underline">
            ← Back to courses
          </Link>
          <h1 className="text-3xl font-bold mt-1">{c.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
            {c.courseCode && (
              <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">{c.courseCode}</span>
            )}
            <span>{c.credits ?? 3} credits</span>
            <span>{workspace.enrolledCount} enrolled</span>
            {user?.role === "STUDENT" && workspace.enrolled && (
              <span className="text-green-700 font-medium">You are enrolled</span>
            )}
          </div>
        </div>
        {user?.role === "ADMIN" && (
          <div className="flex flex-wrap gap-2">
            <button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                setEditingModuleId(null);
                setModuleForm(emptyModule);
                setModuleModal(true);
              }}
            >
              Add module
            </button>
            <button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => {
                setAnnounceForm(emptyAnnouncement);
                setAnnounceModal(true);
              }}
            >
              Post announcement
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-2">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              tab === t.id ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this course</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{c.description || "No description yet."}</p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="border rounded-lg p-4 bg-slate-50">
              <p className="font-medium text-gray-800">Quick facts</p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>Catalog code: {c.courseCode || "—"}</li>
                <li>Credits: {c.credits ?? 3}</li>
                <li>Modules: {workspace.modules?.length ?? 0}</li>
                <li>Announcements: {workspace.announcements?.length ?? 0}</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-blue-50 text-blue-900 text-sm">
              Tip for your demo: walk through <strong>Modules</strong> and <strong>Announcements</strong> to show structured
              content inside each course, not just a title row in a table.
            </div>
          </div>
        </div>
      )}

      {tab === "learning" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Syllabus</h2>
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {c.syllabus || "No syllabus added yet. An admin can edit the course to add one."}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Learning outcomes</h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
              {(c.learningOutcomes || "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              {!c.learningOutcomes?.trim() && <li className="list-none pl-0 text-gray-500">No outcomes listed yet.</li>}
            </ul>
          </div>
        </div>
      )}

      {tab === "modules" && (
        <div className="space-y-4">
          {workspace.modules?.length === 0 ? (
            <p className="text-gray-500 bg-white rounded-lg shadow p-6">No modules yet.</p>
          ) : (
            workspace.modules.map((m, idx) => (
              <div key={m.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-gray-50 border-b">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Module {idx + 1}</span>
                    <h3 className="font-semibold text-lg">{m.title}</h3>
                  </div>
                  {user?.role === "ADMIN" && (
                    <div className="flex gap-2">
                      <button
                        className="text-sm bg-amber-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setEditingModuleId(m.id);
                          setModuleForm({
                            title: m.title,
                            content: m.content || "",
                            sortOrder: m.sortOrder ?? "",
                          });
                          setModuleModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button className="text-sm bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteModule(m.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4 text-sm text-gray-700 whitespace-pre-wrap">{m.content || "No content for this module."}</div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "announcements" && (
        <div className="space-y-3">
          {workspace.announcements?.length === 0 ? (
            <p className="text-gray-500 bg-white rounded-lg shadow p-6">No announcements yet.</p>
          ) : (
            workspace.announcements.map((a) => (
              <div key={a.id} className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4 justify-between">
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                  </p>
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap text-sm">{a.message}</p>
                </div>
                {user?.role === "ADMIN" && (
                  <button className="self-start text-sm bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteAnnouncement(a.id)}>
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "roster" && user?.role === "ADMIN" && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Student</th>
                <th className="text-left p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {(workspace.roster || []).map((r) => (
                <tr key={r.studentId} className="border-t">
                  <td className="p-3">{r.studentName}</td>
                  <td className="p-3">{r.studentEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(workspace.roster || []).length === 0 && <p className="p-4 text-gray-500">No students enrolled in this course yet.</p>}
        </div>
      )}

      <Modal isOpen={moduleModal} title={editingModuleId ? "Edit module" : "Add module"} onClose={() => setModuleModal(false)}>
        <form onSubmit={saveModule} className="space-y-3">
          <input placeholder="Title" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} />
          <textarea
            rows={6}
            placeholder="Content (readings, labs, links…)"
            className="w-full border rounded-md px-3 py-2"
            value={moduleForm.content}
            onChange={(e) => setModuleForm({ ...moduleForm, content: e.target.value })}
          />
          <input
            type="number"
            placeholder="Order (optional)"
            value={moduleForm.sortOrder}
            onChange={(e) => setModuleForm({ ...moduleForm, sortOrder: e.target.value })}
          />
          <button className="w-full bg-blue-600 text-white">{editingModuleId ? "Save changes" : "Add module"}</button>
        </form>
      </Modal>

      <Modal isOpen={announceModal} title="Post announcement" onClose={() => setAnnounceModal(false)}>
        <form onSubmit={postAnnouncement} className="space-y-3">
          <input placeholder="Title" value={announceForm.title} onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })} />
          <textarea
            rows={4}
            placeholder="Message"
            className="w-full border rounded-md px-3 py-2"
            value={announceForm.message}
            onChange={(e) => setAnnounceForm({ ...announceForm, message: e.target.value })}
          />
          <button className="w-full bg-indigo-600 text-white">Publish</button>
        </form>
      </Modal>
    </div>
  );
}
