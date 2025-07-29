"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Send, User, Bot, PlusSquare, Trash2, MessageSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SelectGroup, SelectLabel } from "@/components/ui/select";

const modelGroups = [
    {
        label: "OpenAI",
        models: ["gpt-4.1-nano", "gpt-4.1-mini", "gpt-4.1", "gpt-4o", "gpt-4o-mini", "o4-mini", "o3"]
    },
    {
        label: "Anthropic",
        models: ["claude-3.7"]
    },
    {
        label: "Google",
        models: ["gemini-2.0"]
    },
    {
        label: "Meta",
        models: ["llama-3.3"]
    },
    {
        label: "DeepSeek",
        models: ["deepseek-r1", "deepseek-v3"]
    },
    {
        label: "xAI",
        models: ["grok-3-mini"]
    },
    {
        label: "Alibaba",
        models: ["qwen-qwq-32b"]
    }
];

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
}

export default function AiChatPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [model, setModel] = useState("gpt-4.1-nano");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedSessions = localStorage.getItem("chatSessions");
        if (savedSessions) {
            const parsedSessions = JSON.parse(savedSessions);
            setSessions(parsedSessions);
            if (parsedSessions.length > 0) {
                setActiveSessionId(parsedSessions[0].id);
            }
        }
    }, []);

    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem("chatSessions", JSON.stringify(sessions));
        } else {
            localStorage.removeItem("chatSessions");
        }
    }, [sessions]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [sessions, activeSessionId]);

    const activeSession = sessions.find(s => s.id === activeSessionId);

    const handleNewChat = () => {
        const newSession: ChatSession = {
            id: Date.now().toString(),
            title: "New Chat",
            messages: []
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setInput("");
        setSystemPrompt("");
    };

     const deleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation(); // Prevent triggering the session selection
        if (window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
            setSessions(prev => {
                const newSessions = prev.filter(s => s.id !== sessionId);
                if (activeSessionId === sessionId) {
                    // If the active session is deleted, switch to the first available session or none
                    setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
                }
                return newSessions;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { sender: 'user', text: input };
        
        let currentSessionId = activeSessionId;
        // If there's no active session, create a new one
        if (!activeSession) {
            const newSession: ChatSession = {
                id: Date.now().toString(),
                // Generate title from the first message
                title: input.length > 30 ? input.substring(0, 27) + "..." : input,
                messages: [userMessage]
            };
            setSessions(prev => [newSession, ...prev]);
            setActiveSessionId(newSession.id);
            currentSessionId = newSession.id;
        } else {
             setSessions(prev => prev.map(s => 
                s.id === activeSessionId 
                ? { ...s, messages: [...s.messages, userMessage] } 
                : s
            ));
        }
        
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(`https://api.nzr.web.id/api/ai/chat?question=${encodeURIComponent(input)}&model=${model}&system_prompt=${encodeURIComponent(systemPrompt)}`);
            
            if (!response.ok) {
                 const errorText = await response.text();
                 throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const botMessage: Message = { sender: 'bot', text: result.response };
            
            setSessions(prev => prev.map(s => 
                s.id === currentSessionId 
                ? { ...s, messages: [...s.messages, botMessage] } 
                : s
            ));

        } catch (err: any) {
            const errorMessage: Message = { sender: 'bot', text: `Sorry, something went wrong: ${err.message}` };
             setSessions(prev => prev.map(s => 
                s.id === currentSessionId
                ? { ...s, messages: [...s.messages, errorMessage] } 
                : s
            ));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 flex h-[calc(100vh-2rem)]">
             <Card className="w-64 hidden md:flex flex-col mr-4">
                <CardHeader>
                    <CardTitle>Chats</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-2">
                    {sessions.map(session => (
                        <Button
                            key={session.id}
                            variant={activeSessionId === session.id ? "secondary" : "ghost"}
                            className="w-full justify-between truncate pr-2"
                            onClick={() => setActiveSessionId(session.id)}
                        >
                            <span className="truncate flex-1 text-left">{session.title}</span>
                             <span onClick={(e) => deleteSession(e, session.id)}>
                                <Trash2 
                                    size={16} 
                                    className="text-muted-foreground hover:text-destructive flex-shrink-0 cursor-pointer"
                                />
                            </span>
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <Card className="flex-1 flex flex-col">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>AI Chat</CardTitle>
                        <CardDescription>Obrolan langsung dengan model AI pilihan Anda.</CardDescription>
                    </div>
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <MessageSquare size={20} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Chats</SheetTitle>
                                </SheetHeader>
                                <div className="py-4 space-y-2">
                                     {sessions.map(session => (
                                        <Button
                                            key={session.id}
                                            variant={activeSessionId === session.id ? "secondary" : "ghost"}
                                            className="w-full justify-between truncate pr-2"
                                            onClick={() => setActiveSessionId(session.id)}
                                        >
                                            <span className="truncate flex-1 text-left">{session.title}</span>
                                            <span onClick={(e) => deleteSession(e, session.id)}>
                                                <Trash2 
                                                    size={16} 
                                                    className="text-muted-foreground hover:text-destructive flex-shrink-0 cursor-pointer"
                                                />
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                         <Button variant="outline" size="icon" onClick={handleNewChat} title="New Chat">
                            <PlusSquare size={20} />
                        </Button>
                        <div className="flex-1">
                            <Select value={model} onValueChange={setModel} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modelGroups.map((group) => (
                                        <SelectGroup key={group.label}>
                                            <SelectLabel className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground tracking-wider">{group.label}</SelectLabel>
                                            {group.models.map((m) => (
                                                <SelectItem key={m} value={m}>
                                                    {m}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeSession?.messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`rounded-lg p-3 max-w-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <div className="prose dark:prose-invert prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            {msg.sender === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User size={20} /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                     {loading && (
                        <div className="flex items-start gap-3">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot size={20} /></AvatarFallback>
                            </Avatar>
                             <div className="rounded-lg p-3 bg-muted">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                             </div>
                        </div>
                    )}
                    {!activeSession && !loading && (
                        <div className="text-center text-muted-foreground pt-10">
                            Mulai percakapan baru atau pilih salah satu dari daftar.
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-4 border-t space-y-2">
                     <Textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="System Prompt (Opsional)..."
                        className="text-xs"
                        rows={2}
                        disabled={loading}
                    />
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pesan Anda..."
                            disabled={loading}
                        />
                        <Button type="submit" disabled={loading || !input.trim()}>
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            </Card>
            <style jsx>{`
                .typing-indicator {
                    display: flex;
                    padding: 8px;
                }
                .typing-indicator span {
                    height: 8px;
                    width: 8px;
                    background-color: #9E9E9E;
                    border-radius: 50%;
                    display: inline-block;
                    margin: 0 2px;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .typing-indicator span:nth-of-type(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-of-type(2) { animation-delay: -0.16s; }
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
            `}</style>
        </div>
    );
} 