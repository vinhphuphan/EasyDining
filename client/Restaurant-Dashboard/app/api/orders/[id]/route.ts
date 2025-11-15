import { NextResponse } from "next/server"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const BACKEND = "https://localhost:7184/api/orders"

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const res = await fetch(`${BACKEND}/${params.id}`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}