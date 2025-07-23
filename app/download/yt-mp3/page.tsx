"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function YtMp3DownloaderPage() {
  const [url, setUrl] = useState("")
  const [quality, setQuality] = useState("128k")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(
        `https://api.nzr.web.id/api/download/yt-mp3-v2?url=${encodeURIComponent(url)}&quality=${quality}`,
      )
      if (!response.ok) {
        throw new Error("Gagal mengambil data dari API")
      }
      const result = await response.json()
      if (result.error) {
        const errorMessage = typeof result.error === "string" ? result.error : "API returned an unspecified error."
        throw new Error(errorMessage)
      }
      setData(result)
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
          <CardTitle>YouTube to MP3 Downloader</CardTitle>
          <CardDescription>Ubah video YouTube menjadi file audio MP3 dengan kualitas pilihan Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="url">URL Video YouTube</Label>
                <Input
                  id="url"
                  placeholder="https://youtu.be/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="quality">Kualitas MP3</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger id="quality">
                    <SelectValue placeholder="Pilih kualitas" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="64k">64 kbps</SelectItem>
                    <SelectItem value="128k">128 kbps</SelectItem>
                    <SelectItem value="192k">192 kbps</SelectItem>
                    <SelectItem value="256k">256 kbps</SelectItem>
                    <SelectItem value="320k">320 kbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? "Memproses..." : "Execute"}
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

      {data && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{data.metadata.title}</CardTitle>
            <CardDescription>Oleh: {data.metadata.uploader}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <img src={data.thumbnail} alt={data.metadata.title} className="rounded-lg" />
            <div className="flex justify-between">
              <p>Durasi: {data.metadata.duration}</p>
              <p>Kualitas: {data.metadata.quality}</p>
            </div>
            <a href={data.download} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full">Unduh MP3</Button>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 