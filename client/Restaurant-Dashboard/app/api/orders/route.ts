import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/apiFetch"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const BACKEND = "https://localhost:7184/api/orders"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const queryString = url.searchParams.toString()
    const res = await apiFetch(`${BACKEND}${queryString ? `?${queryString}` : ""}`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}

export async function POST(req: Request) {
    const body = await req.json()
    const res = await apiFetch(BACKEND, {
        method: "POST",
        body: JSON.stringify(body),
    })

    if (res.status === 204) return new Response(null, { status: 204 })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
}
