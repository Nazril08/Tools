"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { Wand2 } from "lucide-react"

interface SonuResult {
    url: string;
    name: string;
    status: string;
    thumbnail_url: string;
}

export default function SonuMusicPage() {
    const [formData, setFormData] = useState({
        title: "",
        lyrics: "",
        mood: "",
        genre: "",
        gender: "",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SonuResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [aiDescription, setAiDescription] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("https://api.nzr.web.id/api/audio/sonu", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
            
            const data: SonuResult = await response.json();
            setResult(data);

        } catch (err: any) {
            setError(err.message || "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleAiFill = async () => {
        setAiLoading(true);
        setError(null);
        try {
            const geminiApiKey = localStorage.getItem("geminiApiKey");
            if (!geminiApiKey) {
                throw new Error("Gemini API key not found in local storage. Please set it in Settings.");
            }
            const response = await fetch('/api/gemini-text-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${geminiApiKey}`
                },
                body: JSON.stringify({ description: aiDescription }),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.error || `AI request failed with status: ${response.status}`);
            }

            const data = await response.json();
            setFormData({
                title: data.title || "",
                lyrics: data.lyrics || "",
                mood: data.mood || "",
                genre: data.genre || "",
                gender: data.gender || "",
            });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setAiLoading(false);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Sonu Music Generator</CardTitle>
                    <CardDescription>Generate music from text prompts using AI.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/20">
                         <Label htmlFor="ai-description" className="text-lg font-semibold flex items-center gap-2">
                           <Wand2 className="text-primary"/>
                           Generate with AI
                        </Label>
                        <Textarea
                            id="ai-description"
                            value={aiDescription}
                            onChange={(e) => setAiDescription(e.target.value)}
                            placeholder="Describe the song you want to create (e.g., 'a sad ballad about a long-lost love, with a female singer'). The AI will fill in the details below in English."
                            rows={3}
                        />
                        <Button onClick={handleAiFill} disabled={aiLoading || !aiDescription}>
                            {aiLoading ? "Thinking..." : "Auto-fill with AI"}
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Majestic Thrones" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="genre">Genre</Label>
                                <Input id="genre" name="genre" value={formData.genre} onChange={handleChange} placeholder="e.g., Classical, Pop, Rock" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mood">Mood</Label>
                                <Input id="mood" name="mood" value={formData.mood} onChange={handleChange} placeholder="e.g., Regal, Happy, Energetic" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="gender">Vocal Gender</Label>
                                <Input id="gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="e.g., Female, Male" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lyrics">Lyrics</Label>
                            <Textarea id="lyrics" name="lyrics" value={formData.lyrics} onChange={handleChange} placeholder="Enter your song lyrics here..." required rows={6} />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Generating..." : "Generate Music"}
                        </Button>
                    </form>

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {result && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>{result.name}</CardTitle>
                                <CardDescription>Status: {result.status}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {result.thumbnail_url && (
                                     <div className="relative w-full max-w-sm mx-auto">
                                        <Image
                                            src={result.thumbnail_url}
                                            alt={result.name}
                                            width={512}
                                            height={512}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                                <audio controls className="w-full" src={result.url}>
                                    Your browser does not support the audio element.
                                </audio>
                                <Button asChild className="w-full">
                                    <a href={result.url} download={result.name + '.mp3'}>Download</a>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 