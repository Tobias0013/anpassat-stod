/**
 * Base URL for API calls.
 *
 * Priority:
 * 1) REACT_APP_API_URL (injected at build time)
 * 2) If running locally → http://localhost:3000
 * 3) Production fallback → https://anpassat-stod.onrender.com
 *
 * @constant
 */
export const API_BASE_URL: string = (() => {
  const envUrl =
    (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_URL) || "";

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

  // Hardcoded production fallback
  return "https://anpassat-stod.onrender.com";
})();


