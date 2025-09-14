/**
 * Base URL for API calls.
 *
 * Source:
 * - REACT_APP_API_URL (must be set in env)
 * - If local, defaults to http://localhost:3000
 */
export const API_BASE_URL: string = (() => {
  const envUrl = process.env.REACT_APP_API_URL || "";
  if (envUrl) return envUrl.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    const isLocal =
      h === "localhost" ||
      h === "127.0.0.1" ||
      h.startsWith("192.168.") ||
      h.endsWith(".local");
    if (isLocal) return "http://localhost:3000";
  }

  throw new Error("API base URL not configured. Set REACT_APP_API_URL in .env");
})();
