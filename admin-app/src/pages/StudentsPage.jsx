import { useEffect, useState } from "react";
import api, { errorText } from "../api";

const empty = { name: "", email: "", password: "" };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.get("/students").then((response) => setStudents(response.data));
  useEffect(() => { load(); }, []);

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/students", form);
      setForm(empty);
      await load();
    } catch (err) {
      setError(errorText(err, "Could not add the student."));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (student) => {
    if (!window.confirm(`Remove ${student.name}? Their enrollment and questions will go with the account.`)) return;
    await api.delete(`/students/${student.id}`);
    await load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form onSubmit={onSubmit} className="card h-fit p-5">
        <h1 className="font-serif text-3xl">Add a student</h1>
        <p className="mt-2 text-sm text-desk/65">This always creates a student account. It cannot create another admin.</p>
        <label className="mt-5 block text-sm">Name<input className="field mt-1" name="name" value={form.name} onChange={onChange} required /></label>
        <label className="mt-4 block text-sm">Email<input className="field mt-1" type="email" name="email" value={form.email} onChange={onChange} required /></label>
        <label className="mt-4 block text-sm">Password<input className="field mt-1" type="password" name="password" minLength={8} value={form.password} onChange={onChange} required /></label>
        {error && <p className="mt-3 text-sm text-copper">{error}</p>}
        <button className="btn-primary mt-4 w-full" disabled={busy}>{busy ? "Saving..." : "Add student"}</button>
      </form>
      <div>
        <h2 className="font-serif text-3xl">Students</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-desk/10 text-xs uppercase tracking-wide text-desk/45">
              <tr><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Email</th><th className="py-3"></th></tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-desk/10">
                  <td className="py-3 pr-4">{student.name}</td>
                  <td className="py-3 pr-4">{student.email}</td>
                  <td className="py-3 text-right"><button className="text-copper" onClick={() => remove(student)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <p className="mt-4 text-sm text-desk/60">No students yet. They can also create their own account on the student site.</p>}
        </div>
      </div>
    </div>
  );
}
