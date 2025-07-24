"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function FacebookDownloaderPage() {
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
        `https://api.nzr.web.id/api/download/facebook?url=${encodeURIComponent(url)}`
      )
      const result = await response.json()

      if (response.status !== 200 || (!result.sd && !result.hd)) {
        throw new Error(result.message || "Gagal mengunduh video Facebook.")
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
          <CardTitle>Facebook Downloader</CardTitle>
          <CardDescription>
            Unduh video atau audio dari tautan Facebook.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="url">URL Facebook</Label>
              <Input
                id="url"
                placeholder="https://www.facebook.com/..."
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
            <CardDescription>Pilih format yang ingin Anda unduh.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {data.hd && (
              <Link href={data.hd} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">Video (HD)</Button>
              </Link>
            )}
            {data.sd && (
              <Link href={data.sd} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full">Video (SD)</Button>
              </Link>
            )}
            {data.audio && (
              <Link href={data.audio} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">Audio</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 