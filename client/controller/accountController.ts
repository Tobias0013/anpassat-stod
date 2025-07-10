const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

/**
 * Fetches individuals associated with the currently logged-in account.
 *
 * @returns {Promise<any[]>} An array of individual objects.
 * @throws {Error} If the request fails or the token is missing/invalid.
 */
export async function fetchAccountIndividuals(): Promise<any[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. User not authenticated.");
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const accountId = payload.id;
  console.log("Token payload:", payload);             // 🟢 Kontrollera innehåll i token
  console.log("Account ID from token:", accountId);
  console.log("Token:", token);
  console.log("Decoded ID:", accountId);
  console.log("Calling URL:", `${BASE_URL}/accounts/${accountId}/individuals`);

  

  const response = await fetch(`${BASE_URL}/accounts/${accountId}/individuals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch individuals");
  }

  const data = await response.json();
  return data.individuals;
}
