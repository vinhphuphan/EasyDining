import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/apiFetch"

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tables/${id}/checkout`, {
        method: "POST",
    })

    if (res.status === 204) {
        return new Response(null, { status: 204 })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
