import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/apiFetch"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const BACKEND = "https://localhost:7184/api/orders/update-status"

export async function PUT(req: Request) {
    const body = await req.json()

    const res = await apiFetch(BACKEND, {
        method: "PUT",
        body: JSON.stringify(body),
    })

    // nếu server trả 204
    if (res.status === 204) return new Response(null, { status: 204 })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
}
