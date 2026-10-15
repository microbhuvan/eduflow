import { useEffect, useState } from "react";
import api, { errorText, formatWhen } from "../api";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);

  const load = () => api.get("/questions").then((response) => setQuestions(response.data));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-copper">Inbox</p>
      <h1 className="mt-2 font-serif text-4xl">Student questions</h1>
      <div className="mt-8 space-y-4">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} onReplied={load} />
        ))}
        {questions.length === 0 && <p className="text-sm text-desk/60">No questions yet.</p>}
      </div>
    </div>
  );
}

function QuestionCard({ question, onReplied }) {
  const [reply, setReply] = useState(question.reply || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post(`/questions/${question.id}/reply`, { reply });
      onReplied();
    } catch (err) {
      setError(errorText(err, "Could not send the reply."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="card p-5">
      <p className="text-sm text-desk/55">{question.studentName} · {question.studentEmail}</p>
      <h2 className="mt-1 text-lg">{question.subject}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-desk/75">{question.message}</p>
      <p className="mt-3 text-xs text-desk/45">{formatWhen(question.createdAt)}</p>
      <form onSubmit={send} className="mt-4 border-t border-desk/10 pt-4">
        <textarea className="field min-h-24" value={reply} onChange={(event) => setReply(event.target.value)} required />
        {error && <p className="mt-2 text-sm text-copper">{error}</p>}
        <button className="btn-primary mt-3" disabled={busy}>{question.reply ? "Update reply" : "Send reply"}</button>
      </form>
    </article>
  );
}
