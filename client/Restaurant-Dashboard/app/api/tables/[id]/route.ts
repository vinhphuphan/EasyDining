import { NextResponse } from "next/server"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const url = (id: string) => `https://localhost:7184/api/tables/${id}`

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const res = await fetch(url(params.id))
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}

// Update/Delete:
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const res = await fetch(url(params.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    // Backend trả 204 NoContent => trả rỗng
    return NextResponse.json(null, { status: res.status })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const res = await fetch(url(params.id), { method: "DELETE" })
    return NextResponse.json(null, { status: res.status })
}
