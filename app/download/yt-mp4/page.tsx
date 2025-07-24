"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function YtMp4Page() {
  const [url, setUrl] = useState("")
  const [quality, setQuality] = useState("1080p")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const qualityOptions = ["1080p", "720p", "480p", "360p"]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(
        `https://api.nzr.web.id/api/download/yt-mp4?url=${encodeURIComponent(url)}&quality=${quality}`
      )
      const result = await response.json()
      if (response.status !== 200 || !result.metadata) {
        throw new Error(result.message || "Gagal mengunduh video.")
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
          <CardTitle>YouTube to MP4 Downloader</CardTitle>
          <CardDescription>
            Unduh video dari YouTube sebagai file MP4 dengan kualitas pilihan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="url">URL YouTube</Label>
              <Input
                id="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quality">Kualitas Video</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger id="quality">
                  <SelectValue placeholder="Pilih kualitas" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {qualityOptions.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Memproses..." : "Proses"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && data.metadata && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Unduhan Siap</CardTitle>
            <CardDescription>{data.metadata.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <img src={data.thumbnail} alt={data.metadata.title} className="rounded-lg" />
            <Link href={data.download} target="_blank" rel="noopener noreferrer">
              <Button className="w-full">Unduh MP4 ({data.metadata.quality})</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 