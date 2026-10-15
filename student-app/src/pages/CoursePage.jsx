import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { downloadLessonPdf, errorText } from "../api";

export default function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.get(`/courses/${courseId}`).then((response) => setCourse(response.data));

  useEffect(() => {
    load();
  }, [courseId]);

  const enroll = async () => {
    setBusy(true);
    setError("");
    try {
      await api.post(`/courses/${courseId}/enroll`);
      await load();
    } catch (err) {
      setError(errorText(err, "Could not enroll."));
    } finally {
      setBusy(false);
    }
  };

  if (!course) {
    return <p className="text-sm text-ink/60">Loading course...</p>;
  }

  return (
    <div>
      <Link to="/app/courses" className="text-sm text-pine">All courses</Link>
      <p className="mt-4 text-xs tracking-wide text-brass">{course.code}</p>
      <h1 className="mt-2 font-serif text-4xl">{course.title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/75">{course.description}</p>
      {!course.enrolled && (
        <div className="mt-6">
          <button className="btn-primary" onClick={enroll} disabled={busy}>
            {busy ? "Enrolling..." : "Enroll in this course"}
          </button>
          {error && <p className="mt-3 text-sm text-brass">{error}</p>}
        </div>
      )}
      {course.enrolled && <p className="mt-6 text-sm text-pine">You are enrolled. The notes below are open.</p>}
      <div className="mt-8 space-y-4">
        {course.lessons.map((lesson, index) => (
          <article key={lesson.id} className="card p-5">
            <p className="text-xs text-ink/45">Lesson {index + 1}</p>
            <h2 className="mt-1 text-lg font-medium">{lesson.title}</h2>
            {course.enrolled ? (
              <>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">{lesson.notes}</p>
                {lesson.hasPdf && (
                  <button className="btn-ghost mt-4" onClick={() => downloadLessonPdf(lesson.id, lesson.title)}>
                    Download PDF
                  </button>
                )}
              </>
            ) : (
              <p className="mt-3 text-sm text-ink/60">Enroll to read the notes and download any PDF.</p>
            )}
          </article>
        ))}
        {course.lessons.length === 0 && <p className="text-sm text-ink/60">No lessons have been posted for this course yet.</p>}
      </div>
    </div>
  );
}
