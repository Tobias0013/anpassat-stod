/**
 * Base URL for API calls.
 *
 * Uses REACT_APP_API_URL injected at build time.
 * Falls back to http://localhost:3000 for local dev.
 *
 * @constant
 */
export const API_BASE_URL: string =
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_URL) ||
  "http://localhost:3000";


