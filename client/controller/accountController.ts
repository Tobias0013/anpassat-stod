import { API_BASE_URL } from "../utils/config";
const BASE_URL = API_BASE_URL;
/**
 * Fetches individuals associated with the currently logged-in account.
 *
 * Reads the JWT from localStorage, decodes the account ID,
 * and performs an authenticated request to the backend.
 *
 * @returns {Promise<any[]>} A promise resolving to an array of individual objects.
 * @throws {Error} If no token is found, the token is invalid, or the request fails.
 */
export async function fetchAccountIndividuals(): Promise<any[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. User not authenticated.");
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const accountId = payload.id;

  console.log("Calling URL:", `${BASE_URL}/accounts/${accountId}/individuals`);

  const response = await fetch(`${BASE_URL}/accounts/${accountId}/individuals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = "Failed to fetch individuals";
    try {
      const error = await response.json();
      if (error?.message) message = error.message;
    } catch {
      // Ignore parsing error, keep default message
    }
    throw new Error(message);
  }

  const data = await response.json();
  return data.individuals;
}
