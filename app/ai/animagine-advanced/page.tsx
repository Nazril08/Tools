"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Image as ImageIcon, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AnimagineAdvancedPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    prompt: "",
    negative_prompt: "",
    width: 1024,
    height: 1024,
    guidance_scale: 7.5,
    num_inference_steps: 28,
    sampler: "DPM++ 2M Karras",
    aspect_ratio: "1:1",
    style_preset: "Anim4gine",
    use_upscaler: false,
    strength: 0.6,
    upscale_by: 1.5,
    add_quality_tags: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGeminiFill, setIsGeminiFill] = useState(false)
  const [geminiLoading, setGeminiLoading] = useState(false)

  const stylePresets = [
    "(None)",
    "Anim4gine",
    "Painting",
    "Pixel art",
    "1980s",
    "1990s",
    "2000s",
    "Toon",
    "Lineart",
    "Art Nouveau",
    "Western Comics",
    "3D",
    "Realistic",
    "Neonpunk",
  ]
  const samplers = ["DPM++ 2M Karras", "DPM++ SDE Karras", "DPM++ 2M SDE Karras", "Euler", "Euler a", "DDIM"]
  const aspectRatios = ["1:1", "9:7", "7:9", "19:13", "13:19", "7:4", "4:7", "12:5", "5:12"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }

  const handleGeminiFill = async () => {
    const geminiApiKey = localStorage.getItem("geminiApiKey")
    if (!geminiApiKey) {
      toast({
        variant: "destructive",
        title: "Kunci API Diperlukan",
        description: "Silakan masukkan Kunci API Gemini Anda di halaman Pengaturan.",
      })
      return
    }

    if (!formData.prompt) {
      toast({
        variant: "destructive",
        title: "Prompt Diperlukan",
        description: "Silakan masukkan prompt dasar terlebih dahulu.",
      })
      return
    }

    setGeminiLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/gemini-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          samplers: samplers,
          stylePresets: stylePresets.filter((p) => p !== "(None)"),
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Gagal Generate dari Gemini.")
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        prompt: data.enhanced_prompt,
        negative_prompt: data.negative_prompt,
        sampler: data.sampler,
        style_preset: data.style_preset,
      }))

      toast({
        title: "Sukses!",
        description: "Formulir telah diisi otomatis oleh Gemini.",
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGeminiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setGeneratedImage(null)

    const params = new URLSearchParams()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, String(value))
      }
    })

    try {
      const response = await fetch(`https://api.nzr.web.id/api/ai-image/animagine?${params.toString()}`)

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
          <CardTitle>Animagine (Advanced)</CardTitle>
          <CardDescription>Hasilkan gambar dengan kontrol penuh atas semua parameter.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="gemini-fill" checked={isGeminiFill} onCheckedChange={setIsGeminiFill} />
              <Label htmlFor="gemini-fill">Auto Fill with Gemini</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea id="prompt" value={formData.prompt} onChange={handleChange} required rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="negative_prompt">Negative Prompt</Label>
                <Textarea id="negative_prompt" value={formData.negative_prompt} onChange={handleChange} rows={4} />
              </div>
            </div>
            {isGeminiFill && (
              <Button type="button" onClick={handleGeminiFill} disabled={geminiLoading} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                {geminiLoading ? "Generating..." : "Generate with Gemini"}
              </Button>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input id="width" type="number" value={formData.width} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" type="number" value={formData.height} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guidance_scale">Guidance Scale</Label>
                <Input id="guidance_scale" type="number" step="0.1" value={formData.guidance_scale} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="num_inference_steps">Inference Steps</Label>
                <Input id="num_inference_steps" type="number" value={formData.num_inference_steps} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sampler">Sampler</Label>
                <Select value={formData.sampler} onValueChange={(value) => handleSelectChange("sampler", value)}>
                  <SelectTrigger id="sampler">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {samplers.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="style_preset">Style Preset</Label>
                <Select value={formData.style_preset} onValueChange={(value) => handleSelectChange("style_preset", value)}>
                  <SelectTrigger id="style_preset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stylePresets.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aspect_ratio">Aspect Ratio</Label>
                <Select value={formData.aspect_ratio} onValueChange={(value) => handleSelectChange("aspect_ratio", value)}>
                  <SelectTrigger id="aspect_ratio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="use_upscaler"
                  checked={formData.use_upscaler}
                  onCheckedChange={(checked) => handleSwitchChange("use_upscaler", checked)}
                />
                <Label htmlFor="use_upscaler">Gunakan Upscaler</Label>
              </div>
              {formData.use_upscaler && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="strength">Strength</Label>
                    <Input id="strength" type="number" step="0.1" value={formData.strength} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upscale_by">Upscale By</Label>
                    <Input id="upscale_by" type="number" step="0.1" value={formData.upscale_by} onChange={handleChange} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="add_quality_tags" checked={formData.add_quality_tags} onCheckedChange={(checked) => handleSwitchChange("add_quality_tags", checked)} />
              <Label htmlFor="add_quality_tags">Add Quality Tags</Label>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Menghasilkan..." : "Execute"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />

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
            <a href={generatedImage} download={`animagine_${formData.prompt.slice(0, 20).replace(/\s+/g, "_")}.png`}>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Unduh Gambar
              </Button>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 