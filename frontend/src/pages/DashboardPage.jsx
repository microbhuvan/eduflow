import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, myCourses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user.role === "ADMIN") {
          const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
            api.get("/users"),
            api.get("/courses"),
            api.get("/enrollments"),
          ]);
          setStats({
            users: usersRes.data.length,
            courses: coursesRes.data.length,
            enrollments: enrollmentsRes.data.length,
            myCourses: [],
          });
        } else {
          const coursesRes = await api.get(`/users/${user.id}/courses`);
          setStats((prev) => ({ ...prev, myCourses: coursesRes.data }));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  if (user.role === "STUDENT") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/my-courses" className="bg-white rounded-md p-4 shadow hover:ring-2 ring-blue-200 transition">
            <h3 className="font-semibold text-blue-800">My courses</h3>
            <p className="text-sm text-gray-600 mt-1">Open enrolled classes, modules, and announcements.</p>
          </Link>
          <Link to="/courses" className="bg-white rounded-md p-4 shadow hover:ring-2 ring-blue-200 transition">
            <h3 className="font-semibold text-blue-800">Course catalog</h3>
            <p className="text-sm text-gray-600 mt-1">Browse all courses. Ask your admin to enroll you to unlock full content.</p>
          </Link>
        </div>
        <div className="bg-white rounded-md p-4 shadow">
          <h3 className="font-semibold mb-2">Enrolled courses</h3>
          {stats.myCourses.length === 0 ? (
            <p className="text-gray-500">No courses enrolled yet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.myCourses.map((course) => (
                <li key={course.id}>
                  <Link to={`/courses/${course.id}`} className="text-blue-600 hover:underline font-medium">
                    {course.title}
                  </Link>
                  {course.courseCode && <span className="text-gray-500 text-sm ml-2">({course.courseCode})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  const data = [
    { name: "Users", value: stats.users },
    { name: "Courses", value: stats.courses },
    { name: "Enrollments", value: stats.enrollments },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        <Link to="/students" className="bg-slate-900 text-white rounded-md p-4 text-center hover:bg-slate-800">
          Manage users
        </Link>
        <Link to="/courses" className="bg-blue-600 text-white rounded-md p-4 text-center hover:bg-blue-700">
          Courses & content
        </Link>
        <Link to="/enrollments" className="bg-indigo-600 text-white rounded-md p-4 text-center hover:bg-indigo-700">
          Enrollments
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((d) => (
          <div key={d.name} className="bg-white shadow rounded-md p-4">
            <p className="text-gray-500">{d.name}</p>
            <p className="text-3xl font-bold">{d.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-md p-4 shadow h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
