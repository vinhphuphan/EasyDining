import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/apiFetch"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const url = (id: string) => `${process.env.API_BASE_URL}/api/tables/${id}`

// GET table by Id
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const res = await apiFetch(url(id))
    const data = res.status === 204 ? null : await res.json()
    return NextResponse.json(data, { status: res.status })
}

// UPDATE table
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const body = await req.json()

    const res = await apiFetch(url(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })

    const data = res.status === 204 ? null : await res.json()
    return NextResponse.json(data, { status: res.status })
}

// DELETE table
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const res = await apiFetch(url(id), { method: "DELETE" })
    // Nếu server trả về 204 No Content
    if (res.status === 204) {
        return new Response(null, { status: 204 })
    }

    // Nếu server trả JSON
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
