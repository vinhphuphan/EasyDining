import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serialize } from "cookie";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST() {
    const store = cookies();
    const uid = (await store).get("uid")?.value;
    const refreshToken = (await store).get("refreshToken")?.value;

    if (!uid || !refreshToken) {
        return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const res = await fetch("https://localhost:7184/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(uid), refreshToken }),
    });

    const data = await res.json();
    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data;
    const response = NextResponse.json({ success: true });

    const secure = process.env.NODE_ENV === "production";

    response.headers.append(
        "Set-Cookie",
        serialize("accessToken", accessToken, {
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        })
    );
    response.headers.append(
        "Set-Cookie",
        serialize("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        })
    );

    return response;
}
