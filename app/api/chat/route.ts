import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { messages = [], subject } = await req.json()

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_API_KEY (or GEMINI_API_KEY) in environment." }, { status: 500 })
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash"

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: modelName })

    // Build history excluding the latest user turn (we'll send that as the message)
    const sanitizedHistory = Array.isArray(messages) ? messages : []
    const history = sanitizedHistory
      .slice(0, -1)
      .filter((m: any) => m && typeof m.content === "string" && (m.sender === "user" || m.sender === "ai"))
      .map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.content as string }],
      }))

    const last = sanitizedHistory[sanitizedHistory.length - 1]
    const userInput = (last && typeof last.content === "string") ? last.content : ""

    const systemPreamble = `You are a friendly, supportive AI tutor for primary and secondary school students.
- Be clear, step-by-step, and concise.
- Ask clarifying questions when needed.
- Encourage understanding over memorization.
- Offer small examples and checks for understanding.
${subject ? `- The subject is: ${subject}.` : ""}`

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(`${systemPreamble}\n\nStudent: ${userInput}`)
    const text = result.response.text()

    return NextResponse.json({ text })
  } catch (err) {
    console.error("/api/chat error", err)
    return NextResponse.json({ error: "Failed to fetch response from Gemini." }, { status: 500 })
  }
}
