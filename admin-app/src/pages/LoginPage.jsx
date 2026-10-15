import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../auth";
import { PublicHeader } from "../components/Chrome";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate("/app");
    } catch (err) {
      setError(errorText(err, "Sign in failed."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-desk text-ivory">
      <PublicHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <h1 className="font-serif text-4xl">Staff sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-ivory/70">Student accounts are turned away. There is no signup on this site.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input className="field mt-1 text-desk" name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label className="block text-sm">
            Password
            <input className="field mt-1 text-desk" name="password" type="password" value={form.password} onChange={onChange} required />
          </label>
          {error && <p className="text-sm text-copper">{error}</p>}
          <button className="btn w-full bg-ivory text-desk" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="mt-8 border border-white/10 px-4 py-3 text-sm text-mist">
          Demo desk: admin@eduflow.com / Admin@12345
        </p>
      </main>
    </div>
  );
}
