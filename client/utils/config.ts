// utils/config.ts
/**
 * Base URL for API calls.
 *
 * Priority:
 * 1) CRA:  process.env.REACT_APP_API_URL
 * 2) Vite: import.meta.env.VITE_API_URL
 * 3) Local dev → http://localhost:3000
 * 4) Fallback → https://anpassat-stod.onrender.com
 */
export const API_BASE_URL: string = (() => {
  const cra =
    (typeof process !== "undefined" &&
      (process as any)?.env?.REACT_APP_API_URL) ||
    "";
  let vite = "";
  try {
    vite = ((import.meta as any).env?.VITE_API_URL as string) || "";
  } catch {
  }

  const envUrl = cra || vite;
  if (envUrl) return envUrl;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.endsWith(".local");
    if (isLocal) return "http://localhost:3000";
  }

  return "https://anpassat-stod.onrender.com";
})();
