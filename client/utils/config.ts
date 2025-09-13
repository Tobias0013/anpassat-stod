/**
 * Base URL for API calls.
 *
 * Prefers `REACT_APP_API_URL` (set during build/deploy).
 * Falls back to `http://localhost:3000` for local development.
 *
 * @constant
 */
export const API_BASE_URL: string =
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_URL) ||
  "http://localhost:3000";


