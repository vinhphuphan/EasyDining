import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { cookies } from "next/headers";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST() {
    const store = cookies();
    const uid = (await store).get("uid")?.value;
    const accessToken = (await store).get("accessToken")?.value;

    if (uid && accessToken) {
        await fetch("https://localhost:7184/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(uid),
        }).catch(() => { });
    }

    const response = NextResponse.json({ success: true });
    const clear = (name: string) =>
        serialize(name, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", expires: new Date(0) });

    response.headers.append("Set-Cookie", clear("accessToken"));
    response.headers.append("Set-Cookie", clear("refreshToken"));
    response.headers.append("Set-Cookie", clear("uid"));
    return response;
}
