"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      const response = await fetch(
        `https://api.nzr.web.id/api/download/tiktok?url=${encodeURIComponent(url)}`
      )
      const result = await response.json()

      // Assuming a successful response will have an 'aweme_id'
      if (response.status !== 200 || !result.aweme_id) {
        throw new Error(result.message || "Gagal mengunduh video TikTok.")
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
          <CardDescription>
            Unduh video atau audio dari TikTok tanpa watermark.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="url">URL TikTok</Label>
              <Input
                id="url"
                placeholder="https://vt.tiktok.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
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

      {data && (
        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={data.author.avatar} alt={data.author.nickname} />
                <AvatarFallback>{data.author.nickname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{data.author.nickname}</CardTitle>
                <CardDescription className="truncate">{data.title}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img src={data.cover} alt={data.title} className="rounded-lg max-w-xs w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {data.hdplay && (
                <Link href={data.hdplay} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">Unduh Video (HD)</Button>
                </Link>
              )}
               {data.play && (
                <Link href={data.play} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="w-full">Video (WM)</Button>
                </Link>
              )}
              {data.music && (
                <Link href={data.music} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">Unduh Audio</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 