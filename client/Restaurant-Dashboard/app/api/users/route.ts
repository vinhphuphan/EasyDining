import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/apiFetch"

const BACKEND = `${process.env.API_BASE_URL}/api/user`

// GET users
export async function GET() {
    const res = await apiFetch(BACKEND)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}

// CREATE user (requires token)
export async function POST(req: Request) {
    const body = await req.json()

    const res = await apiFetch(BACKEND, {
        method: "POST",
        body: JSON.stringify(body),
    })

    const data = res.status === 204 ? null : await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
}
