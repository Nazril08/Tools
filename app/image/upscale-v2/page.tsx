"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useDropzone } from "react-dropzone"
import { UploadCloud, Image as ImageIcon, Download } from "lucide-react"

export default function UpscaleV2Page() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setOriginalImage(URL.createObjectURL(selectedFile))
      setResultUrl(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
  })
  
  const handleSubmit = async () => {
    if (!file) {
      setError("Silakan pilih gambar terlebih dahulu.")
      return
    }

    setLoading(true)
    setError(null)
    setResultUrl(null)

    try {
      // 1. Upload via our own proxy
      setLoadingMessage("Mengunggah gambar...")
      const formData = new FormData()
      formData.append("fileToUpload", file)

      const proxyResponse = await fetch("/api/upload-proxy", {
        method: "POST",
        body: formData,
      })
      
      const proxyResult = await proxyResponse.json();
      if (!proxyResponse.ok) {
        throw new Error(proxyResult.error || "Gagal mengunggah gambar melalui server.")
      }
      const imageUrl = proxyResult.url

      // 2. Call the upscale API with the URL
      setLoadingMessage("Meningkatkan resolusi gambar...")
      const upscaleResponse = await fetch(
        `https://api.nzr.web.id/api/image/upscale-4k?url=${encodeURIComponent(imageUrl)}`
      )
      const result = await upscaleResponse.json()

      if (!upscaleResponse.ok || !result.url) {
        throw new Error(result.message || "Gagal melakukan upscale gambar.")
      }
      setResultUrl(result.url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMessage("")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Image Upscaler V2 (4K)</CardTitle>
          <CardDescription>
            Seret & letakkan gambar untuk meningkatkan resolusinya ke kualitas 4K.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div
            {...getRootProps()}
            className={`flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary"}`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2">
                {isDragActive ? "Letakkan gambar di sini" : "Seret & letakkan gambar, atau klik untuk memilih"}
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, WEBP</p>
            </div>
          </div>

          {originalImage && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                    <h3 className="font-semibold text-center">Gambar Asli</h3>
                    <img src={originalImage} alt="Original" className="rounded-lg border" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-center">Gambar 4K</h3>
                    <div className="w-full h-auto min-h-[200px] bg-muted rounded-lg flex items-center justify-center">
                        {resultUrl ? (
                             <img src={resultUrl} alt="Upscaled" className="rounded-lg border" />
                        ) : (
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                    </div>
                </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4">
             <Button onClick={handleSubmit} disabled={!originalImage || loading}>
              {loading ? loadingMessage : "Tingkatkan Resolusi"}
            </Button>
            {resultUrl && (
              <a href={resultUrl} download={`upscaled_4k_${file?.name || "image.png"}`}>
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Unduh Hasil
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 