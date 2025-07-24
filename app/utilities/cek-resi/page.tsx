"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function CekResiPage() {
  const [resi, setResi] = useState("")
  const [courier, setCourier] = useState("jne")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const couriers = [
    "jne",
    "jnt",
    "shopee express",
    "kurir rekomendasi tokopedia",
    "sicepat",
    "tiki",
    "anteraja",
    "wahana",
    "ninja",
    "lion",
    "pos",
    "pcp",
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(
        `https://api.nzr.web.id/api/utilities/track-shipping?resi=${resi}&courier=${courier}`,
      )
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.result.error || "Gagal melacak resi.")
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
          <CardTitle>Cek Resi Pengiriman</CardTitle>
          <CardDescription>Lacak status dan lokasi paket Anda dari berbagai kurir.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="resi">Nomor Resi</Label>
                <Input
                  id="resi"
                  placeholder="Masukkan nomor resi"
                  value={resi}
                  onChange={(e) => setResi(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="courier">Kurir</Label>
                <Select value={courier} onValueChange={setCourier}>
                  <SelectTrigger id="courier">
                    <SelectValue placeholder="Pilih kurir" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {couriers.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Melacak..." : "Lacak Paket"}
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

      {data && data.history && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Hasil Pelacakan</CardTitle>
            <CardDescription>
              {data.courier} - {data.resi}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Status: {data.status}</h3>
              <p className="text-sm text-muted-foreground">{data.message}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Riwayat Perjalanan</h3>
              <div className="space-y-4">
                {data.history.map((h: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(h.timestamp).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="relative w-full">
                      <div className="absolute left-[-11px] top-0 h-full w-0.5 bg-border" />
                      <div className="absolute left-[-14px] top-2 h-3 w-3 rounded-full bg-primary" />
                      <p className="pl-4">{h.description}</p>
                    </div>
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