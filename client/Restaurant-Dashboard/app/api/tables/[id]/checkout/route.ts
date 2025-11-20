import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/apiFetch"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const res = await apiFetch(`${process.env.API_BASE_URL}/api/tables/${id}/checkout`, {
        method: "POST",
    })

    if (res.status === 204) {
        return new Response(null, { status: 204 })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
