import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth";
import { AppShell } from "./components/Chrome";
import HeroPage from "./pages/HeroPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import NoticesPage from "./pages/NoticesPage";
import QuestionsPage from "./pages/QuestionsPage";
import ProfilePage from "./pages/ProfilePage";

function Private({ children }) {
  const { token, ready } = useAuth();
  if (!ready) return <p className="p-8 text-sm">Opening your portal...</p>;
  if (!token) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

function Guest({ children }) {
  const { token, ready } = useAuth();
  if (!ready) return null;
  if (token) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Guest><HeroPage /></Guest>} />
      <Route path="/login" element={<Guest><LoginPage /></Guest>} />
      <Route path="/signup" element={<Guest><SignupPage /></Guest>} />
      <Route path="/app" element={<Private><DashboardPage /></Private>} />
      <Route path="/app/courses" element={<Private><CoursesPage /></Private>} />
      <Route path="/app/courses/:courseId" element={<Private><CoursePage /></Private>} />
      <Route path="/app/notices" element={<Private><NoticesPage /></Private>} />
      <Route path="/app/questions" element={<Private><QuestionsPage /></Private>} />
      <Route path="/app/profile" element={<Private><ProfilePage /></Private>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
