/**
 * Base URL for API calls.
 *
 * Source:
 * - REACT_APP_API_URL (must be set in .env)
 * - If local, defaults to http://localhost:3000
 */
export const API_BASE_URL: string = (() => {
  const envUrl =
    (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_URL) || "";
  if (envUrl) return envUrl;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.") || host.endsWith(".local");
    if (isLocal) return "http://localhost:3000";
  }

  throw new Error("API base URL not configured. Set REACT_APP_API_URL in .env");
})();
