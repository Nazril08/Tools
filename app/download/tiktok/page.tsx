"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function TikTokDownloaderPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(`https://api.nzr.web.id/api/download/tiktok?url=${encodeURIComponent(url)}`)
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
          <CardTitle>TikTok Downloader</CardTitle>
          <CardDescription>Unduh video atau audio dari tautan TikTok.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="url">URL Video TikTok</Label>
                <Input
                  id="url"
                  placeholder="https://vt.tiktok.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
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
            <CardTitle>{data.title}</CardTitle>
            <CardDescription>Oleh: {data.author.nickname}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <img src={data.cover} alt={data.title} className="rounded-lg" />
            <div className="grid grid-cols-2 gap-2 text-sm text-center">
              <div>
                <p className="font-semibold">Likes</p>
                <p>{data.digg_count.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">Plays</p>
                <p>{data.play_count.toLocaleString()}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <a href={data.hdplay} target="_blank" rel="noopener noreferrer" className="w-full block">
                <Button className="w-full">Unduh Video (HD)</Button>
              </a>
              <a href={data.wmplay} target="_blank" rel="noopener noreferrer" className="w-full block">
                <Button variant="secondary" className="w-full">
                  Unduh Video (Watermark)
                </Button>
              </a>
              <a href={data.music} target="_blank" rel="noopener noreferrer" className="w-full block">
                <Button variant="outline" className="w-full">
                  Unduh Audio Saja
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 