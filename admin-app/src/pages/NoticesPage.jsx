import { useEffect, useState } from "react";
import api, { errorText, formatWhen } from "../api";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.get("/notices").then((response) => setNotices(response.data));
  useEffect(() => { load(); }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/notices", form);
      setForm({ title: "", message: "" });
      await load();
    } catch (err) {
      setError(errorText(err, "Could not post the notice."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form onSubmit={onSubmit} className="card h-fit p-5">
        <h1 className="font-serif text-3xl">Post a notice</h1>
        <p className="mt-2 text-sm text-desk/65">Students who have the portal open will see this within a few seconds.</p>
        <label className="mt-5 block text-sm">Title<input className="field mt-1" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
        <label className="mt-4 block text-sm">Message<textarea className="field mt-1 min-h-32" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required /></label>
        {error && <p className="mt-3 text-sm text-copper">{error}</p>}
        <button className="btn-primary mt-4 w-full" disabled={busy}>{busy ? "Posting..." : "Post notice"}</button>
      </form>
      <div className="space-y-4">
        {notices.map((notice) => (
          <article key={notice.id} className="card p-5">
            <h2 className="font-medium">{notice.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-desk/75">{notice.message}</p>
            <p className="mt-3 text-xs text-desk/45">{formatWhen(notice.createdAt)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
