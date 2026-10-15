import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth";

const links = [
  { to: "/app", label: "Dashboard", end: true },
  { to: "/app/courses", label: "Courses" },
  { to: "/app/students", label: "Students" },
  { to: "/app/enrollments", label: "Enrollments" },
  { to: "/app/notices", label: "Notices" },
  { to: "/app/questions", label: "Questions" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative border-b border-white/10 bg-desk text-ivory">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-serif text-2xl">EduFlow Desk</Link>
        <button className="border border-white/20 px-3 py-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "Menu"}
        </button>
        <Link to="/login" className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-16 border-b border-white/10 bg-desk px-5 py-4 text-sm md:static md:block md:border-0 md:bg-transparent md:p-0 md:shrink-0`}>
          Sign in
        </Link>
      </div>
    </header>
  );
}

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 bg-desk text-ivory md:flex md:flex-col">
        <Link to="/app" className="border-b border-white/10 px-6 py-6 font-serif text-2xl">EduFlow Desk</Link>
        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm ${isActive ? "bg-white/10 text-ivory" : "text-mist hover:text-ivory"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 text-sm">
          <p>{user?.name}</p>
          <p className="mt-1 text-mist">{user?.email}</p>
          <button className="mt-4 text-copper" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between bg-desk px-4 py-3 text-ivory md:hidden">
          <Link to="/app" className="font-serif text-xl">EduFlow Desk</Link>
          <button className="border border-white/20 px-3 py-2 text-sm" onClick={() => setOpen((value) => !value)}>
            {open ? "Close" : "Menu"}
          </button>
        </header>
        {open && (
          <nav className="bg-panel p-4 text-ivory md:hidden">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className="block py-2 text-sm">
                {link.label}
              </NavLink>
            ))}
            <button className="mt-3 text-sm text-copper" onClick={signOut}>Sign out</button>
          </nav>
        )}
        <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
