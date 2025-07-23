import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    const apiResponse = await fetch(`https://api.nzr.web.id/api/download/aio?url=${encodeURIComponent(url)}`)

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json()
      return NextResponse.json({ error: errorData.error || "Gagal mengambil data dari API eksternal" }, { status: apiResponse.status })
    }

    const data = await apiResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan internal pada server" }, { status: 500 })
  }
} 