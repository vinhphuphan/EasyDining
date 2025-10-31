export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
    const doFetch = () => fetch(input, { ...init, credentials: "include" });

    let res = await doFetch();
    if (res.status !== 401) return res;

    // Try refresh
    const refreshRes = await fetch("/api/refresh", { method: "POST", credentials: "include" });
    if (refreshRes.ok) {
        res = await doFetch();
        if (res.status !== 401) return res;
    }

    // Refresh fail: clear client session and push login
    if (typeof window !== "undefined") {
        try { localStorage.removeItem("user"); } catch { }
        window.location.href = "/login";
    }
    return res;
}
