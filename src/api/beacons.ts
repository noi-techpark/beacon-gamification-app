import to from "await-to-js";
import { Beacon } from "../models/beacon";
import { API_SERVER_URL, fetchBeaconsApi } from "./apiFetcher";

export async function getBeacons(token: string): Promise<any> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/beacons/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        })
    );

    if (!response) {
        throw error;
    }

    return response;
}

export async function getBeaconById(token: string, beaconId: number): Promise<Beacon> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/beacons/${beaconId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        })
    );

    if (!response) {
        throw error;
    }

    return response;
}