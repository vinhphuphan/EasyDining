import { NextResponse } from "next/server"
import { cookies } from "next/headers"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const BACKEND = "https://localhost:7184/api/menuitems"

export async function GET() {
  const res = await fetch(BACKEND)
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(req: Request) {
  const accessToken = cookies().get("accessToken")?.value
  const body = await req.json()
  const res = await fetch(BACKEND, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

