import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("studentToken"));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!localStorage.getItem("studentToken"));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }
    api.get("/me")
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem("studentToken");
        setToken(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, [token]);

  const login = (data) => {
    localStorage.setItem("studentToken", data.token);
    setToken(data.token);
    setUser({ id: data.userId, name: data.name, email: data.email, role: data.role });
  };

  const logout = () => {
    localStorage.removeItem("studentToken");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, ready, login, logout, setUser }),
    [token, user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
