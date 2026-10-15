import { Link } from "react-router-dom";
import { PublicHeader } from "../components/Chrome";

export default function HeroPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto grid max-w-6xl items-end gap-12 px-5 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="text-xs uppercase tracking-[0.22em] text-brass">Student portal</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-ink md:text-7xl">
            Study the class. Not the clutter.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            EduFlow is where you enroll, read the notes your instructor posted, and keep every class notice in one place. The staff desk is a separate site.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="btn-primary">Create account</Link>
            <Link to="/login" className="btn-ghost">Sign in</Link>
          </div>
        </div>
        <aside className="card md:col-span-5">
          <p className="border-b border-line px-6 py-4 text-xs uppercase tracking-[0.18em] text-ink/50">Inside the portal</p>
          <ul className="divide-y divide-line">
            <li className="px-6 py-5">
              <p className="font-medium">Enroll yourself</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">Open a course and join it. Nobody at the desk has to add you.</p>
            </li>
            <li className="px-6 py-5">
              <p className="font-medium">Notes and PDFs</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">Each lesson is written notes, with a PDF when the instructor attaches one.</p>
            </li>
            <li className="px-6 py-5">
              <p className="font-medium">Notices and questions</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">A new class notice appears while you are signed in. Send a question when you are stuck.</p>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
