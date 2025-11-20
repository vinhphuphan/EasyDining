import { NextResponse } from "next/server";
import { serialize } from "cookie";
export async function POST(req: Request) {
    const body = await req.json();

    // Call API backend ASP.NET Core
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });

    const { user, accessToken, refreshToken } = data.data;

    // Response trả về client
    const response = NextResponse.json({
        success: true,
        user,
    });

    // Lưu token vào cookie
    response.headers.append(
        "Set-Cookie",
        serialize("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15, // 15 phút
        })
    );

    response.headers.append(
        "Set-Cookie",
        serialize("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 ngày
        })
    );

    response.headers.append(
        "Set-Cookie",
        serialize("uid", String(user.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        })
    );

    return response;
}
