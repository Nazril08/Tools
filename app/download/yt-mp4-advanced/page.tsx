"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function YtMp4AdvancedPage() {
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
        `https://api.nzr.web.id/api/download/ytmp4-advanced?url=${encodeURIComponent(url)}`
      )
      const result = await response.json()
      if (response.status !== 200) {
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
          <CardTitle>YouTube to MP4 Downloader (Advanced)</CardTitle>
          <CardDescription>
            Unduh video dari YouTube sebagai file MP4. Mendukung video hingga 6 jam.
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
            <CardTitle>Unduhan Siap</CardTitle>
            <CardDescription>{data.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={data.download_url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full">Unduh MP4</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 