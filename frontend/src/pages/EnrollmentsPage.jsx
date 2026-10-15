import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EnrollmentsPage() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
      api.get("/users"),
      api.get("/courses"),
      api.get("/enrollments"),
    ]);
    setUsers(usersRes.data.filter((u) => u.role === "STUDENT"));
    setCourses(coursesRes.data);
    setEnrollments(enrollmentsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const enroll = async () => {
    if (!studentId || !courseId) return toast.error("Select both student and course");
    try {
      await api.post("/enrollments", { studentId: Number(studentId), courseId: Number(courseId) });
      toast.success("Enrolled successfully");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Enrollment failed");
    }
  };

  const removeEnrollment = async (id) => {
    await api.delete(`/enrollments/${id}`);
    toast.success("Enrollment removed");
    await loadData();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Enrollments</h2>
      <div className="bg-white p-4 rounded-md shadow grid grid-cols-1 md:grid-cols-3 gap-3">
        <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Select Student</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <button onClick={enroll} className="bg-blue-600 text-white hover:bg-blue-700">Enroll</button>
      </div>
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-3">{e.studentName}</td>
                <td className="p-3">{e.courseTitle}</td>
                <td className="p-3">
                  <button onClick={() => removeEnrollment(e.id)} className="bg-red-500 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
