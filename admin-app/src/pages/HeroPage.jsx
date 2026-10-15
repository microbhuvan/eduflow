import { Link } from "react-router-dom";
import { PublicHeader } from "../components/Chrome";

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-desk text-ivory">
      <PublicHeader />
      <section className="mx-auto grid max-w-6xl items-end gap-12 px-5 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="text-xs uppercase tracking-[0.22em] text-copper">Staff only</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-7xl">
            The desk that runs the coaching.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">
            Publish courses, attach class notes, post a notice, and answer student questions. Students enroll themselves on a different site. Their login does not open this one.
          </p>
          <Link to="/login" className="btn mt-8 bg-ivory text-desk hover:bg-white">Staff sign in</Link>
        </div>
        <aside className="border border-white/10 md:col-span-5">
          <p className="border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.18em] text-mist">What you do here</p>
          <ul className="divide-y divide-white/10 text-sm leading-relaxed">
            <li className="px-6 py-5">Write the course and the lesson notes. Attach a PDF when you have one.</li>
            <li className="px-6 py-5">Post a class notice. Students who are signed in see it without refreshing the page.</li>
            <li className="px-6 py-5">Read questions and reply. You do not enroll students. They do that themselves.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
