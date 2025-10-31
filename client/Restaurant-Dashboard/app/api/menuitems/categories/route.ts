import { NextResponse } from "next/server"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export async function GET() {
  const res = await fetch("https://localhost:7184/api/menuitems/categories")
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

