import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const emptyForm = { name: "", email: "", password: "", role: "STUDENT" };

export default function StudentsPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Name and email are required");
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
        toast.success("User updated");
      } else {
        if (!form.password) return toast.error("Password is required");
        await api.post("/users", form);
        toast.success("User created");
      }
      setForm(emptyForm);
      setEditingId(null);
      setOpen(false);
      await loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save user");
    }
  };

  const onEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    toast.success("User deleted");
    await loadUsers();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Students / Users</h2>
      <button
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => {
          setEditingId(null);
          setForm(emptyForm);
          setOpen(true);
        }}
      >
        Add User
      </button>
      <Modal isOpen={open} title={editingId ? "Edit User" : "Add User"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="STUDENT">STUDENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button className="bg-blue-600 text-white hover:bg-blue-700">{editingId ? "Update" : "Add"} User</button>
        </form>
      </Modal>
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => onEdit(u)} className="bg-amber-500 text-white">Edit</button>
                  <button onClick={() => onDelete(u.id)} className="bg-red-500 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
