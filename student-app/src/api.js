import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8086" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("studentToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function errorText(error, fallback) {
  return error?.response?.data?.error || fallback;
}

export function formatWhen(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export async function downloadLessonPdf(lessonId, title) {
  const response = await api.get(`/lessons/${lessonId}/pdf`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title || "lesson"}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export default api;
