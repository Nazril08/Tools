import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const geminiApiKey = request.headers.get("x-gemini-api-key")
  const { prompt, samplers, stylePresets } = await request.json()

  if (!geminiApiKey) {
    return NextResponse.json({ error: "Kunci API Gemini tidak ditemukan di header." }, { status: 401 })
  }

  const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`

  const systemPrompt = `
    You are an expert AI assistant specializing in crafting detailed prompts for anime-style text-to-image models.
    Your task is to take a basic user prompt and expand it into a rich, detailed prompt.
    You must also select the most appropriate technical parameters from the provided lists and generate a suitable negative prompt.

    Rules:
    1.  The user's prompt may be in any language (e.g., Indonesian, English). First, understand its core concept. Then, expand it into a vivid description, including details about the character, clothing, background, lighting, and art style. The final enhanced prompt MUST be in English.
    2.  Based on the enhanced prompt, generate a relevant negative prompt to avoid common image generation issues (e.g., "low quality, blurry, bad anatomy, extra limbs, watermark"). The negative prompt MUST be in English.
    3.  Choose the ONE best sampler from this list: ${JSON.stringify(samplers)}.
    4.  Choose the ONE best style preset from this list: ${JSON.stringify(stylePresets)}.
    5.  You MUST return the response ONLY in a valid JSON format, with no extra text or markdown wrappers.

    Expected JSON Format:
    {
      "enhanced_prompt": "The detailed, enhanced prompt in English goes here.",
      "negative_prompt": "The generated negative prompt in English goes here.",
      "sampler": "the chosen sampler",
      "style_preset": "the chosen style preset"
    }
  `

  const requestBody = {
    contents: [{ parts: [{ text: systemPrompt }, { text: `User's basic prompt: "${prompt}"` }] }],
    generationConfig: {
      response_mime_type: "application/json",
    },
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000) // Timeout 25 detik

  try {
    const response = await fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API Error:", errorData)
      return NextResponse.json(
        { error: "Gagal berkomunikasi dengan Gemini API.", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()
    const jsonContent = data.candidates[0].content.parts[0].text
    return NextResponse.json(JSON.parse(jsonContent))
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === "AbortError") {
      console.error("Gemini API request timed out.")
      return NextResponse.json({ error: "Permintaan ke Gemini API memakan waktu terlalu lama (timeout)." }, { status: 504 })
    }
    console.error("Internal proxy error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal pada server proxy." }, { status: 500 })
  }
} 