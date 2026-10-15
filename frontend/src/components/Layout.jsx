import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/students", label: "Students", adminOnly: true },
  { to: "/courses", label: "Courses" },
  { to: "/enrollments", label: "Enrollments", adminOnly: true },
  { to: "/my-courses", label: "My Courses", studentOnly: true },
  { to: "/profile", label: "Profile" },
];

function navMatch(pathname, to) {
  if (pathname === to) return true;
  if (to === "/courses" && pathname.startsWith("/courses/")) return true;
  return false;
}

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-900 text-white p-4 hidden md:block shrink-0">
        <h1 className="text-xl font-bold mb-6">EduFlow</h1>
        <nav className="space-y-2">
          {navItems
            .filter((item) => {
              if (item.adminOnly) return user?.role === "ADMIN";
              if (item.studentOnly) return user?.role === "STUDENT";
              return true;
            })
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded ${
                  navMatch(pathname, item.to) ? "bg-slate-700" : "hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>
          <button onClick={logout} className="bg-red-500 text-white hover:bg-red-600 shrink-0">
            Logout
          </button>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
