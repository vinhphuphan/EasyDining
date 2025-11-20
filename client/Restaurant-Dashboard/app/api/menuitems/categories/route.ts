import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/menuitems/categories`)
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

