import { NextResponse } from "next/server"
import { cookies } from "next/headers"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const url = (id: string) => `https://localhost:7184/api/menuitems/${id}`

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(url(params.id))
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const accessToken = cookies().get("accessToken")?.value
  const body = await req.json()
  const res = await fetch(url(params.id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  })
  // Backend often returns 204 No Content for PUT
  if (res.status === 204) return new Response(null, { status: 204 })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const accessToken = cookies().get("accessToken")?.value
  const res = await fetch(url(params.id), {
    method: "DELETE",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  })
  if (res.status === 204) return new Response(null, { status: 204 })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

