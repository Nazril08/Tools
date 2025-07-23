"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Image as ImageIcon } from "lucide-react"

export default function AnimaginePage() {
  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const aspectRatios = ["1:1", "9:7", "7:9", "19:13", "13:19", "7:4", "4:7", "12:5", "5:12"]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch(
        `https://api.nzr.web.id/api/ai-image/animagine-v2?prompt=${encodeURIComponent(prompt)}&aspect_ratio=${encodeURIComponent(aspectRatio)}`,
      )

      if (!response.ok) {
        throw new Error("Gagal menghasilkan gambar. Silakan coba lagi.")
      }

      const imageBlob = await response.blob()
      if (imageBlob.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(imageBlob)
        setGeneratedImage(imageUrl)
      } else {
        const result = await imageBlob.text()
        const errorData = JSON.parse(result)
        throw new Error(errorData.error || "API mengembalikan respons yang tidak valid.")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Animagine v2</CardTitle>
          <CardDescription>Hasilkan gambar gaya anime dari deskripsi teks Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Contoh: a mysterious sorceress standing on a cliff..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                rows={4}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger id="aspect-ratio">
                  <SelectValue placeholder="Pilih rasio aspek" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {aspectRatios.map((ratio) => (
                    <SelectItem key={ratio} value={ratio}>
                      {ratio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Menghasilkan..." : "Execute"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mt-4 bg-destructive">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {generatedImage && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Gambar yang Dihasilkan</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <img src={generatedImage} alt="Generated" className="rounded-lg mx-auto" />
            <a href={generatedImage} download={`animagine_${prompt.slice(0, 20).replace(/\s+/g, "_")}.png`}>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Unduh Gambar
              </Button>
            </a>
          </CardContent>
        </Card>
      )}

      {!loading && !generatedImage && !error && (
        <div className="mt-4 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/50 rounded-lg p-8">
          <ImageIcon className="h-16 w-16 mb-4" />
          <h3 className="text-lg font-semibold">Hasil Anda Akan Muncul di Sini</h3>
          <p className="text-sm">Masukkan prompt dan klik "Execute" untuk memulai.</p>
        </div>
      )}
    </div>
  )
} 