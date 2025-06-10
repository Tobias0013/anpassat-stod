// Development only: using localhost. For production, set REACT_APP_API_URL in environment variables or some other suitable way
const port = process.env.PORT;

/**
 * Sends a POST request to create a new caregiver with the specified name and county.
 *
 * @param name - The name of the caregiver to be created.
 * @param county - The county where the caregiver is located.
 * @returns The response data from the server, representing the created caregiver.
 * @throws Will throw an error if the request fails or the server responds with an error.
 * 
 */
export const createCaregiver = async (name: string, county: string) => {
    const apiUrl = `http://localhost:${port}`;
    const response = await fetch(`${apiUrl}/care-givers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, county }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create caregiver");
    }
  
    return response.json();
  };