import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileUrl = searchParams.get("url")
  const title = searchParams.get("title") || "download"
  const ext = searchParams.get("ext") || "mp4"

  if (!fileUrl) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    const fileResponse = await fetch(fileUrl)

    if (!fileResponse.ok) {
      return NextResponse.json({ error: "Gagal mengunduh file dari URL eksternal" }, { status: fileResponse.status })
    }

    // Mengambil body sebagai ReadableStream, bukan mem-buffer seluruhnya
    const body = fileResponse.body

    // Membuat header baru untuk respons streaming
    const headers = new Headers()
    headers.set("Content-Type", fileResponse.headers.get("Content-Type") || "application/octet-stream")
    headers.set("Content-Disposition", `attachment; filename="${title}.${ext}"`)
    if (fileResponse.headers.has("content-length")) {
      headers.set("Content-Length", fileResponse.headers.get("content-length")!)
    }

    // Mengalirkan respons kembali ke klien
    return new NextResponse(body, { status: 200, headers })
  } catch (error) {
    console.error("Download proxy error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal saat memproses unduhan" }, { status: 500 })
  }
} 