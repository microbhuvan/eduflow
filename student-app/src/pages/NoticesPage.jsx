import { useEffect, useState } from "react";
import api, { formatWhen } from "../api";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    api.get("/notices").then((response) => setNotices(response.data));
  }, []);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-brass">From the desk</p>
      <h1 className="mt-2 font-serif text-4xl">Notices</h1>
      <p className="mt-3 text-sm text-ink/70">Class updates posted by staff. This page also refreshes while you stay signed in.</p>
      <div className="mt-8 space-y-4">
        {notices.map((notice) => (
          <article key={notice.id} className="card p-5">
            <h2 className="text-lg font-medium">{notice.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">{notice.message}</p>
            <p className="mt-3 text-xs text-ink/45">{formatWhen(notice.createdAt)}</p>
          </article>
        ))}
        {notices.length === 0 && <p className="text-sm text-ink/60">No notices yet.</p>}
      </div>
    </div>
  );
}
