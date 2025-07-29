import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("fileToUpload");

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    // Buat FormData baru untuk dikirim ke Catbox
    const catboxFormData = new FormData();
    catboxFormData.append("reqtype", "fileupload");
    catboxFormData.append("fileToUpload", file);

    const catboxResponse = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxFormData,
    });

    if (!catboxResponse.ok) {
        const errorText = await catboxResponse.text();
      return NextResponse.json({ error: "Gagal mengunggah ke Catbox.", details: errorText }, { status: catboxResponse.status });
    }

    const imageUrl = await catboxResponse.text();
    return NextResponse.json({ url: imageUrl }, { status: 200 });

  } catch (error: any) {
    console.error("Kesalahan internal pada proxy unggah:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal pada server." }, { status: 500 });
  }
} 