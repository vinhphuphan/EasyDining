import { NextResponse } from "next/server";
import { serialize } from "cookie";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.headers.append(
        "Set-Cookie",
        serialize("accessToken", "", {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(0),
        })
    );
    response.headers.append(
        "Set-Cookie",
        serialize("refreshToken", "", {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(0),
        })
    );

    return response;
}
