"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AIOdownloaderPage() {
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
      const response = await fetch(`https://api.nzr.web.id/api/download/aio?url=${encodeURIComponent(url)}`)
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
          <CardTitle>AIO Downloader</CardTitle>
          <CardDescription>
            Unduh konten dari berbagai platform media sosial seperti Spotify, YouTube, Instagram, dan lainnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://open.spotify.com/track/3rPtS4nfpy7PsARctAWpzd"
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
            <CardDescription>Oleh: {data.author}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <img src={data.thumbnail} alt={data.title} className="rounded-lg" />
            <p>Durasi: {data.duration}</p>
            <div>
              <h3 className="font-semibold">Media:</h3>
              <div className="mt-2 space-y-2">
                {data.medias.map((media: any, index: number) => (
                  <div key={index} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p>Kualitas: {media.quality}</p>
                      <p className="text-sm text-muted-foreground">Ekstensi: {media.extension}</p>
                    </div>
                    <a href={media.url} target="_blank" rel="noopener noreferrer">
                      <Button>Unduh</Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 