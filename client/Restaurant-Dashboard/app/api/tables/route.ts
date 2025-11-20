import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/apiFetch";

const BACKEND = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tables`

export async function GET() {
    const res = await apiFetch(BACKEND);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
    const body = await req.json();

    const res = await apiFetch(BACKEND, {
        method: "POST",
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}