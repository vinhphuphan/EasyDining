import { NextResponse } from "next/server"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export async function GET() {
    const res = await fetch("https://localhost:7184/api/tables")
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}

export async function POST(req: Request) {
    const body = await req.json()
    const res = await fetch("https://localhost:7184/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
