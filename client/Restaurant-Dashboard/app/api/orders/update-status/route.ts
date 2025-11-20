import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/apiFetch"

const BASE_URL = process.env.API_BASE_URL;

export async function PUT(req: Request) {
    const body = await req.json()

    const res = await apiFetch(`${BASE_URL}/api/orders/update-status`, {
        method: "PUT",
        body: JSON.stringify(body),
    })

    // nếu server trả 204
    if (res.status === 204) return new Response(null, { status: 204 })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
}
