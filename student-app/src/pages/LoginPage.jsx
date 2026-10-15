import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    setError("");
    setBusy(true);
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
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <h1 className="font-serif text-4xl">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">Use the account you created on this site. Staff accounts are refused here.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input className="field mt-1" name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label className="block text-sm">
            Password
            <input className="field mt-1" name="password" type="password" value={form.password} onChange={onChange} required />
          </label>
          {error && <p className="text-sm text-brass">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="mt-6 text-sm text-ink/70">
          New here? <Link to="/signup" className="text-pine underline">Create an account</Link>
        </p>
      </main>
    </div>
  );
}
