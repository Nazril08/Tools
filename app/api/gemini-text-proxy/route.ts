import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { description } = await req.json();
        const geminiApiKey = req.headers.get('Authorization')?.replace('Bearer ', '');

        if (!geminiApiKey) {
            return NextResponse.json({ error: 'Gemini API key is missing. Please set it in the Settings page.' }, { status: 401 });
        }
        if (!description) {
            return NextResponse.json({ error: 'Description is required.' }, { status: 400 });
        }

        const prompt = `
You are a creative assistant for a music generation service.
A user will provide a description of a song they want to create. This description can be in any language.
Your task is to analyze this description and generate the necessary parameters to create the song, following very strict rules.

Follow these rules strictly:
1.  All output parameters MUST be in English.
2.  The 'lyrics' must be short and concise, approximately 4 to 6 lines in total. Think of it as a summary or the core idea of the song.
3.  The 'lyrics' value must be ONLY the raw text of the song.
    - It MUST NOT contain any section labels like '[Verse]', '(Chorus)', 'Bridge:', etc.
    - It MUST NOT contain any empty lines or double newlines (\\n\\n). All lyric lines must be consecutive.
4.  The output must be a single JSON string where each line of the lyric is separated by a single newline character (\\n).
5.  The 'title', 'mood', and 'genre' should be concise and relevant.
6.  The 'gender' must be ONLY "Male" or "Female".
7.  Your final output MUST be ONLY a single, valid JSON object with the following structure and no other text, explanations, or markdown formatting.

    Example of a PERFECT output:
    {
      "title": "Winds of Destiny",
      "lyrics": "No words, just winds through marble halls.\\nTrumpets rise, destiny calls.\\nStrings of fate, and drums of time.\\nA song of power, pure and prime.",
      "mood": "Epic",
      "genre": "Orchestral",
      "gender": "Male"
    }

User's song description: "${description}"
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Gemini API Error:", errorBody);
            throw new Error(errorBody.error.message || 'Failed to fetch from Gemini API');
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts[0].text) {
             throw new Error("Invalid response structure from Gemini API.");
        }

        const textResponse = data.candidates[0].content.parts[0].text;
        
        const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const parsedJson = JSON.parse(jsonString);

        return NextResponse.json(parsedJson);

    } catch (error: any) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "An error occurred while processing your request: " + error.message }, { status: 500 });
    }
} 