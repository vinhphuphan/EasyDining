import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_BASE_URL;

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!BASE_URL) {
        return NextResponse.json(
            { error: "API_BASE_URL is not configured" },
            { status: 500 }
        );
    }

    const { id } = await context.params;
    const token = (await cookies()).get("accessToken")?.value;

    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
        cache: "no-store",
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    return NextResponse.json(data, { status: res.status });
}
