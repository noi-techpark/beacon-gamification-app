import { to } from 'await-to-js';

export const API_SERVER_URL = "http://157.230.18.122/api/v1";

export async function fetchBeaconsApi<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const [error, httpResponse] = await to(fetch(input, init));

    if (!httpResponse) {
        throw error;
    }

    const [parseError, parsedResponse] = await to(httpResponse.json());

    if (!parsedResponse) {
        throw parseError;
    }

    return parsedResponse;
}