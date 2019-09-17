import to from "await-to-js";
import { API_SERVER_URL, fetchBeaconsApi } from "./apiFetcher";

export async function getAuthToken(username: string, password: string): Promise<any> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/api-token-auth/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
    );

    if (!response) {
        throw error;
    }

    return response;
}