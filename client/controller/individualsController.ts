import { API_BASE_URL } from "../utils/config";
const BASE_URL = API_BASE_URL;
/**
 * Sends a POST request to create a new individual.
 *
 * @param {Object} data - Object containing individual data and accountId will be injected automatically from the JWT.
 * @param {string} data.name - The individual's name.
 * @param {number} data.age - The individual's age.
 * @param {string} data.county - The individual's county.
 * @param {"male" | "female" | "none"} data.gender - The individual's gender.
 * @returns {Promise<any>} A promise resolving to the newly created individual.
 * @throws {Error} If the user is not authenticated or the request fails.
 */
export async function createIndividualAPI(data: {
  name: string;
  age: number;
  county: string;
  gender: "male" | "female" | "none";
}): Promise<any> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  // Decode JWT to extract accountId
  const payload = JSON.parse(atob(token.split(".")[1]));
  const accountId = payload.id;

  const response = await fetch(`${BASE_URL}/individuals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data, accountId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create individual");
  }

  return result.individual;
}
