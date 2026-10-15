import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth";

const links = [
  { to: "/app", label: "Dashboard", end: true },
  { to: "/app/courses", label: "Courses" },
  { to: "/app/notices", label: "Notices" },
  { to: "/app/questions", label: "Questions" },
  { to: "/app/profile", label: "Profile" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-serif text-2xl tracking-tight">EduFlow</Link>
        <button className="btn-ghost md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "Menu"}
        </button>
        <nav className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-16 flex-col gap-3 border-b border-line bg-paper px-5 py-4 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0`}>
          <Link to="/login" className="text-sm" onClick={() => setOpen(false)}>Sign in</Link>
          <Link to="/signup" className="btn-primary" onClick={() => setOpen(false)}>Create account</Link>
        </nav>
      </div>
    </header>
  );
}

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let seen = null;
    let timer;
    const load = async () => {
      try {
        const { data } = await api.get("/notices");
        const latest = data[0];
        if (seen && latest && latest.id !== seen) {
          setNotice(latest.title);
        }
        if (latest) seen = latest.id;
      } catch {
        // The page still works if a refresh fails.
      }
    };
    load();
    timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, []);

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-white md:flex md:flex-col">
        <Link to="/app" className="border-b border-line px-6 py-6 font-serif text-2xl">EduFlow</Link>
        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block border-l-2 px-3 py-2 text-sm ${isActive ? "border-pine bg-paper font-medium" : "border-transparent text-ink/70 hover:text-ink"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-4 text-sm">
          <p className="font-medium">{user?.name}</p>
          <p className="mt-1 text-ink/60">{user?.email}</p>
          <button className="mt-4 text-brass" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3 md:hidden">
          <Link to="/app" className="font-serif text-xl">EduFlow</Link>
          <button className="btn-ghost" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
        </header>
        {open && (
          <nav className="border-b border-line bg-white p-4 md:hidden">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className="block py-2 text-sm">
                {link.label}
              </NavLink>
            ))}
            <button className="mt-3 text-sm text-brass" onClick={signOut}>Sign out</button>
          </nav>
        )}
        {notice && (
          <div className="flex items-center justify-between gap-4 border-b border-line bg-white px-5 py-3 text-sm">
            <p>New notice: {notice}</p>
            <button className="text-brass" onClick={() => { setNotice(""); navigate("/app/notices"); }}>Read</button>
          </div>
        )}
        <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
