import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { subject, level, topic, lessonType } = await req.json()

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Define curriculum prompts based on African education context
    const curriculumPrompt = `You are an expert curriculum designer for African primary and secondary education. 
    Create engaging, culturally relevant lesson content for underprivileged students.

    Subject: ${subject}
    Level: ${level} (Primary/Secondary)
    Topic: ${topic}
    Lesson Type: ${lessonType}

    Requirements:
    - Use African contexts, examples, and cultural references
    - Make content relatable to students in South Africa, Kenya, Zimbabwe, Zambia, Malawi
    - Include practical, real-world applications
    - Use simple, clear language appropriate for the level
    - Include interactive elements and questions
    - Align with African curriculum standards
    - Be encouraging and motivational

    Generate a structured lesson with:
    1. Introduction (hook the student's interest)
    2. Main content (core concepts with examples)
    3. Interactive exercises (3-5 questions/activities)
    4. Real-world application (how this applies to daily life)
    5. Summary and key takeaways

    Format as JSON with this structure:
    {
      "title": "Engaging lesson title",
      "description": "Brief lesson description",
      "duration": "Estimated time in minutes",
      "difficulty": "Beginner/Intermediate/Advanced",
      "skillCoins": "Reward amount (20-100)",
      "content": {
        "introduction": {
          "title": "Introduction title",
          "content": "Engaging introduction text",
          "culturalContext": "African context or example"
        },
        "mainContent": [
          {
            "section": "Section name",
            "explanation": "Clear explanation",
            "example": "African-relevant example",
            "visualDescription": "Description for visual aid"
          }
        ],
        "exercises": [
          {
            "type": "multiple-choice|fill-blank|practical",
            "question": "Question text",
            "options": ["A", "B", "C", "D"] // for multiple choice
            "correctAnswer": "Correct answer",
            "explanation": "Why this is correct",
            "contextualHint": "African context hint"
          }
        ],
        "realWorldApplication": {
          "title": "How this helps in real life",
          "examples": ["Example 1", "Example 2"],
          "communityConnection": "How it connects to African communities"
        },
        "summary": {
          "keyPoints": ["Key point 1", "Key point 2"],
          "nextSteps": "What to learn next"
        }
      }
    }

    Ensure all content is educational, age-appropriate, and inspiring for African students.`

    const result = await model.generateContent(curriculumPrompt)
    const response = result.response.text()

    try {
      // Clean and parse the JSON response
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const lessonContent = JSON.parse(cleanResponse)
      
      return NextResponse.json(lessonContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json({ 
        error: "Failed to generate structured lesson content",
        rawResponse: response 
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Curriculum generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate curriculum content" },
      { status: 500 }
    )
  }
}

// GET endpoint for retrieving subject-specific topics
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const level = searchParams.get('level') || 'primary'

  if (!subject) {
    return NextResponse.json({ error: "Subject parameter required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const topicsPrompt = `Generate a comprehensive list of topics for ${subject} at ${level} level, 
    suitable for African students (South Africa, Kenya, Zimbabwe, Zambia, Malawi).

    Requirements:
    - Align with African curriculum standards
    - Progress from basic to advanced concepts
    - Include culturally relevant topics
    - Practical, real-world applications
    - Age-appropriate for ${level} students

    Format as JSON array:
    [
      {
        "id": "unique-topic-id",
        "title": "Topic Title",
        "description": "Brief description",
        "difficulty": "Beginner/Intermediate/Advanced",
        "estimatedLessons": 3-8,
        "prerequisites": ["topic-id-1", "topic-id-2"],
        "realWorldApplication": "How this applies to daily life",
        "culturalRelevance": "African context"
      }
    ]

    Generate 10-15 topics covering the full ${subject} curriculum for ${level} level.`

    const result = await model.generateContent(topicsPrompt)
    const response = result.response.text()

    try {
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const topics = JSON.parse(cleanResponse)
      
      return NextResponse.json({ subject, level, topics })
    } catch (parseError) {
      console.error('Failed to parse topics response:', parseError)
      return NextResponse.json({ 
        error: "Failed to generate topics list",
        rawResponse: response 
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Topics generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate topics" },
      { status: 500 }
    )
  }
}
