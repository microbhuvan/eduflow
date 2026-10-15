import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses").then((response) => setCourses(response.data));
  }, []);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-brass">Catalogue</p>
      <h1 className="mt-2 font-serif text-4xl">Courses</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink/70">Enroll on your own. Notes stay closed until you do.</p>
      <div className="mt-8 grid gap-4">
        {courses.map((course) => (
          <Link key={course.id} to={`/app/courses/${course.id}`} className="card block p-5 hover:border-pine md:flex md:items-start md:justify-between">
            <div>
              <p className="text-xs tracking-wide text-brass">{course.code}</p>
              <h2 className="mt-1 text-lg font-medium">{course.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{course.description}</p>
            </div>
            <p className="mt-4 text-sm text-pine md:mt-1 md:shrink-0">{course.enrolled ? "Enrolled" : "View course"}</p>
          </Link>
        ))}
        {courses.length === 0 && <p className="text-sm text-ink/60">No courses have been published yet.</p>}
      </div>
    </div>
  );
}
