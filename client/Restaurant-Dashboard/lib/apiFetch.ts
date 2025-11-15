import { cookies } from "next/headers";

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
    const token = (await cookies()).get("accessToken")?.value;

    const headers = {
        ...init.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
    };

    return fetch(input, { ...init, headers });
}
