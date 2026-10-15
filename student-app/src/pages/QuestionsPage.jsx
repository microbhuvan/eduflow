import { useEffect, useState } from "react";
import api, { errorText, formatWhen } from "../api";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    api.get("/questions").then((response) => setQuestions(response.data));

  useEffect(() => {
    load();
  }, []);

  const onChange = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/questions", form);
      setForm({ subject: "", message: "" });
      await load();
    } catch (err) {
      setError(errorText(err, "Could not send the question."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form onSubmit={onSubmit} className="card h-fit p-5">
        <h1 className="font-serif text-3xl">Ask the desk</h1>
        <p className="mt-2 text-sm text-ink/70">
          Staff read this on their own site and reply there.
        </p>
        <label className="mt-5 block text-sm">
          Subject
          <input
            className="field mt-1"
            name="subject"
            value={form.subject}
            onChange={onChange}
            required
          />
        </label>
        <label className="mt-4 block text-sm">
          Question
          <textarea
            className="field mt-1 min-h-32"
            name="message"
            value={form.message}
            onChange={onChange}
            required
          />
        </label>
        {error && <p className="mt-3 text-sm text-brass">{error}</p>}
        <button className="btn-primary mt-4 w-full" disabled={busy}>
          {busy ? "Sending..." : "Send question"}
        </button>
      </form>
      <div className="space-y-4">
        {questions.map((question) => (
          <article key={question.id} className="card p-5">
            <h2 className="font-medium">{question.subject}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
              {question.message}
            </p>
            <p className="mt-3 text-xs text-ink/45">
              {formatWhen(question.createdAt)}
            </p>
            <div className="mt-4 border-t border-line pt-4">
              {question.reply ? (
                <>
                  <p className="text-xs uppercase tracking-wide text-pine">
                    Reply
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                    {question.reply}
                  </p>
                </>
              ) : (
                <p className="text-sm text-ink/55">Waiting for a reply.</p>
              )}
            </div>
          </article>
        ))}
        {questions.length === 0 && (
          <p className="text-sm text-ink/60">
            You have not asked anything yet.
          </p>
        )}
      </div>
    </div>
  );
}
