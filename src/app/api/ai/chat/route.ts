import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are ChatFresh AI, a friendly and helpful AI assistant. Be concise, helpful, and friendly.`;

interface Message {
    role: "user" | "assistant";
    content: string;
}

function generateFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        return "Hello! 👋 I'm ChatFresh AI. How can I help you today?";
    }

    if (lowerMessage.includes("joke")) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything! 😄",
            "What do you call a fake noodle? An impasta! 🍝",
            "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (lowerMessage.includes("help")) {
        return "I can help with answering questions, writing, brainstorming, and more! Just ask me anything.";
    }

    if (lowerMessage.includes("thank")) {
        return "You're welcome! 😊 Anything else I can help with?";
    }

    if (lowerMessage.includes("time") || lowerMessage.includes("date")) {
        const now = new Date();
        return `It's ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. 🕐`;
    }

    return "I'm here to help! Configure GEMINI_API_KEY for advanced AI responses. Try asking me to tell a joke!";
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message, history = [] } = body;

        if (!message) {
            return NextResponse.json(
                { success: false, message: "Message is required" },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                success: true,
                response: generateFallbackResponse(message),
                suggestions: ["Tell me a joke", "What can you do?", "Hello!"],
            });
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const conversationHistory = history
                .slice(-10)
                .map((msg: Message) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
                .join("\n");

            const prompt = `${SYSTEM_PROMPT}\n\nConversation:\n${conversationHistory}\n\nUser: ${message}\n\nRespond helpfully and concisely:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return NextResponse.json({
                success: true,
                response: text,
                suggestions: ["Tell me more", "Thanks!", "What else?"],
            });
        } catch (aiError) {
            console.error("Gemini AI error:", aiError);
            return NextResponse.json({
                success: true,
                response: generateFallbackResponse(message),
                suggestions: ["Try again", "Tell me a joke"],
            });
        }
    } catch (error) {
        console.error("AI chat error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
