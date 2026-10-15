import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/users/${user.id}/courses`);
      setCourses(data);
      setLoading(false);
    };
    load();
  }, [user.id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My courses</h2>
      <p className="text-gray-600 text-sm max-w-2xl">
        Each course has its own classroom: syllabus, learning outcomes, weekly-style modules, and announcements. Open a course
        to explore content your instructor has published.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-5 rounded-lg shadow border border-gray-100 flex flex-col">
            <div className="flex-1">
              {course.courseCode && (
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{course.courseCode}</span>
              )}
              <h3 className="font-semibold text-lg mt-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">{course.description || "No short description."}</p>
              <p className="text-xs text-gray-500 mt-2">{course.credits ?? 3} credits</p>
            </div>
            <Link
              to={`/courses/${course.id}`}
              className="mt-4 inline-flex justify-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Enter classroom
            </Link>
          </div>
        ))}
        {courses.length === 0 && <p className="text-gray-500">No enrolled courses. Ask your administrator to enroll you.</p>}
      </div>
    </div>
  );
}
