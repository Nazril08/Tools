"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsPage() {
    const { toast } = useToast()
    const [geminiApiKey, setGeminiApiKey] = useState("")

    useEffect(() => {
        const savedKey = localStorage.getItem("geminiApiKey")
        if (savedKey) {
            setGeminiApiKey(savedKey)
        }
    }, [])

    const handleSaveApiKey = () => {
        localStorage.setItem("geminiApiKey", geminiApiKey)
        toast({
            title: "Success!",
            description: "Your Gemini API key has been saved.",
        })
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your application settings and API integrations here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                        <Input
                            id="gemini-api-key"
                            type="password"
                            placeholder="Enter your Gemini API key"
                            value={geminiApiKey}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                            Your API key is stored securely in your browser and is never shared.
                        </p>
                    </div>
                    <Button onClick={handleSaveApiKey}>Save</Button>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    )
} 