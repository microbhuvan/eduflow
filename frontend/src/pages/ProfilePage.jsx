import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get(`/users/${user.id}`);
        setProfile(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user.id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-2xl font-bold">My profile</h2>
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div>
          <p className="text-xs uppercase text-gray-500">Name</p>
          <p className="text-lg font-medium">{profile?.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Email</p>
          <p className="text-lg">{profile?.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Role</p>
          <p className="text-lg">{profile?.role}</p>
        </div>
        <p className="text-sm text-gray-500 pt-2">
          Profile updates are managed by an administrator from the Students screen.
        </p>
      </div>
    </div>
  );
}
