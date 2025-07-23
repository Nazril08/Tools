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
    // Siapkan header untuk permintaan eksternal
    const fetchHeaders = new Headers()

    // Daftar header yang akan diteruskan dari permintaan klien
    const headersToForward = [
      "accept",
      "accept-language",
      "user-agent",
      "range",
      "referer",
    ]

    // Salin header dari permintaan asli ke permintaan fetch yang baru
    headersToForward.forEach((headerName) => {
      const headerValue = request.headers.get(headerName)
      if (headerValue) {
        fetchHeaders.set(headerName, headerValue)
      }
    })

    // Lakukan fetch ke URL eksternal dengan header yang sudah disesuaikan
    const fileResponse = await fetch(fileUrl, {
      headers: fetchHeaders,
    })

    if (!fileResponse.ok) {
      console.error(`External fetch failed with status: ${fileResponse.status} for URL: ${fileUrl}`)
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