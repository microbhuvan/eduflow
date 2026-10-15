import { useEffect, useState } from "react";
import api, { errorText } from "../api";
import { useAuth } from "../auth";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const { data } = await api.put("/me", { name });
      setUser(data);
      setMessage("Name updated.");
    } catch (err) {
      setMessage(errorText(err, "Could not update your name."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg">
      <p className="text-xs uppercase tracking-[0.18em] text-brass">Account</p>
      <h1 className="mt-2 font-serif text-4xl">Profile</h1>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-5">
        <label className="block text-sm">
          Name
          <input className="field mt-1" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="block text-sm">
          Email
          <input className="field mt-1 bg-paper" value={user?.email || ""} disabled />
        </label>
        <p className="text-sm text-ink/60">Role: Student. This cannot be changed from the portal.</p>
        {message && <p className="text-sm">{message}</p>}
        <button className="btn-primary" disabled={busy}>{busy ? "Saving..." : "Save name"}</button>
      </form>
    </div>
  );
}
