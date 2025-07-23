"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UploadCloud, Image as ImageIcon, Download } from "lucide-react"

export default function RemoveBackgroundPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setOriginalImage(URL.createObjectURL(selectedFile))
      setProcessedImage(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
  })

  const handleRemoveBackground = async () => {
    if (!file) {
      setError("Silakan pilih gambar terlebih dahulu.")
      return
    }

    setLoading(true)
    setError(null)
    setProcessedImage(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("https://api.nzr.web.id/api/image/remove-background", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Gagal menghapus latar belakang. Silakan coba lagi.")
      }

      const imageBlob = await response.blob()
      const imageUrl = URL.createObjectURL(imageBlob)
      setProcessedImage(imageUrl)
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
          <CardTitle>Remove Background</CardTitle>
          <CardDescription>Unggah gambar untuk menghapus latar belakangnya secara otomatis.</CardDescription>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Gambar Asli</h3>
                <img src={originalImage} alt="Original" className="rounded-lg w-full" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Hasil</h3>
                <div className="w-full h-auto min-h-[200px] bg-muted rounded-lg flex items-center justify-center">
                  {processedImage ? (
                    <img src={processedImage} alt="Processed" className="rounded-lg w-full" />
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
            <Button onClick={handleRemoveBackground} disabled={!originalImage || loading}>
              {loading ? "Memproses..." : "Hapus Latar Belakang"}
            </Button>
            {processedImage && (
              <a href={processedImage} download={`removed_bg_${file?.name || "image.png"}`}>
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