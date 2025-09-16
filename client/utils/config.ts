/**
 * Base URL for API calls.
 * 1) REACT_APP_API_URL (build-time env via webpack)
 * 2) local → http://localhost:3000
 * 3) fallback → https://anpassat-stod.onrender.com
 */
export const API_BASE_URL: string = (() => {
  const envUrl =
    (process as any)?.env?.REACT_APP_API_URL || "";
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
