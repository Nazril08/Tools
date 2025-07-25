"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

function formatTimestamp(seconds: number) {
  const floorSeconds = Math.floor(seconds)
  const minutes = Math.floor(floorSeconds / 60)
  const remainingSeconds = floorSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function TikTokTranscriptPage() {
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
        `https://api.nzr.web.id/api/ai-experience/tiktok-transcript?url=${encodeURIComponent(url)}`
      )
      const result = await response.json()

      if (!result.status) {
        throw new Error(result.message || "Gagal mendapatkan transkrip.")
      }
      setData(result.result)
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
          <CardTitle>TikTok Video Transcript</CardTitle>
          <CardDescription>
            Dapatkan transkrip lengkap dari video TikTok.
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
            <CardTitle>Hasil Transkrip</CardTitle>
            <div className="flex items-center gap-2 pt-2">
                 <Badge variant="outline">Durasi: {data.duration.toFixed(2)}s</Badge>
                 <Badge variant="outline">Bahasa: {data.language.toUpperCase()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold mb-2">Transkrip Lengkap</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{data.text}</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Segmen</h3>
                <Accordion type="single" collapsible className="w-full">
                    {data.segments.map((segment: any, index: number) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4">
                                    <span>Segmen {index + 1}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatTimestamp(segment.start)} - {formatTimestamp(segment.end)}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {segment.text}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 