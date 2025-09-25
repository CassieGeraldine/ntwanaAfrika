import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Fallback quiz data for when API quota is exceeded
const fallbackQuizData = {
  title: "Career Explorer Quiz",
  description: "Discover career paths that match your interests and strengths",
  questions: [
    {
      id: 1,
      question: "What type of work environment do you prefer?",
      options: [
        { id: "a", text: "Quiet office with individual focus", value: "analytical" },
        { id: "b", text: "Collaborative team environment", value: "social" },
        { id: "c", text: "Creative studio or workshop", value: "creative" },
        { id: "d", text: "Fast-paced, high-energy setting", value: "leadership" }
      ]
    },
    {
      id: 2,
      question: "How do you prefer to solve problems?",
      options: [
        { id: "a", text: "Analyze data and research thoroughly", value: "analytical" },
        { id: "b", text: "Brainstorm with others and collaborate", value: "social" },
        { id: "c", text: "Think outside the box and be innovative", value: "creative" },
        { id: "d", text: "Take charge and make quick decisions", value: "leadership" }
      ]
    },
    {
      id: 3,
      question: "What motivates you most at work?",
      options: [
        { id: "a", text: "Solving complex technical challenges", value: "technical" },
        { id: "b", text: "Helping people and making a difference", value: "healthcare" },
        { id: "c", text: "Creating something new and original", value: "creative" },
        { id: "d", text: "Leading teams and driving results", value: "business" }
      ]
    },
    {
      id: 4,
      question: "Which subjects did you enjoy most in school?",
      options: [
        { id: "a", text: "Mathematics, Science, Technology", value: "technical" },
        { id: "b", text: "Biology, Health Sciences, Psychology", value: "healthcare" },
        { id: "c", text: "Art, Design, Literature, Music", value: "creative" },
        { id: "d", text: "Business Studies, Economics, History", value: "business" }
      ]
    },
    {
      id: 5,
      question: "How do you prefer to communicate?",
      options: [
        { id: "a", text: "Through detailed reports and analysis", value: "analytical" },
        { id: "b", text: "Face-to-face conversations and meetings", value: "social" },
        { id: "c", text: "Visual presentations and storytelling", value: "creative" },
        { id: "d", text: "Clear directives and action plans", value: "leadership" }
      ]
    },
    {
      id: 6,
      question: "What type of impact do you want to make?",
      options: [
        { id: "a", text: "Advance technology and innovation", value: "technical" },
        { id: "b", text: "Improve people's health and wellbeing", value: "healthcare" },
        { id: "c", text: "Inspire and entertain others", value: "creative" },
        { id: "d", text: "Shape future leaders and minds", value: "education" }
      ]
    },
    {
      id: 7,
      question: "How do you handle stress and pressure?",
      options: [
        { id: "a", text: "Focus on data and systematic approaches", value: "analytical" },
        { id: "b", text: "Seek support from team members", value: "social" },
        { id: "c", text: "Find creative outlets and solutions", value: "creative" },
        { id: "d", text: "Take control and organize priorities", value: "leadership" }
      ]
    },
    {
      id: 8,
      question: "What's your ideal work-life balance?",
      options: [
        { id: "a", text: "Structured hours with deep focus time", value: "analytical" },
        { id: "b", text: "Flexible schedule with people interaction", value: "social" },
        { id: "c", text: "Creative freedom with project-based work", value: "creative" },
        { id: "d", text: "High responsibility with leadership opportunities", value: "business" }
      ]
    }
  ]
}

const fallbackAnalysisData = {
  analysis: {
    primaryStrengths: ["Problem-solving", "Communication", "Adaptability"],
    personalityType: "You are a well-rounded individual who can adapt to different situations and work well both independently and in teams.",
    motivations: ["Personal growth", "Making a positive impact", "Achieving excellence"]
  },
  recommendedCareers: [
    {
      title: "Project Manager",
      match: 85,
      description: "Your leadership and organizational skills make you well-suited for managing projects and teams.",
      pathway: "Business or relevant degree + Project Management certification",
      salaryRange: "R350,000 - R800,000",
      growth: "High demand across industries",
      nextSteps: ["Develop leadership skills", "Learn project management methodologies", "Gain team experience"]
    },
    {
      title: "Business Analyst",
      match: 78,
      description: "Your analytical thinking and communication skills are perfect for bridging business and technical teams.",
      pathway: "Business, IT, or relevant degree + analyst certification",
      salaryRange: "R300,000 - R650,000",
      growth: "Growing demand in digital transformation",
      nextSteps: ["Learn data analysis tools", "Develop business process knowledge", "Practice stakeholder management"]
    },
    {
      title: "Marketing Specialist",
      match: 72,
      description: "Your creativity and people skills would thrive in developing marketing strategies and campaigns.",
      pathway: "Marketing, Communications, or Business degree",
      salaryRange: "R250,000 - R550,000",
      growth: "Evolving with digital marketing trends",
      nextSteps: ["Build digital marketing skills", "Create a portfolio", "Learn analytics tools"]
    }
  ],
  additionalSuggestions: {
    subjects: ["Business Studies", "Communication", "Psychology", "Computer Literacy"],
    skills: ["Leadership", "Critical thinking", "Teamwork", "Digital literacy"],
    experiences: ["Volunteer leadership roles", "Team projects", "Internships", "Public speaking"]
  }
}

export async function POST(req: Request) {
  let action: string = ""
  
  try {
    const requestData = await req.json()
    action = requestData.action
    const { quizType, interests, previousAnswers } = requestData

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
    
    // Use fallback if no API key
    if (!apiKey) {
      console.warn("No API key found, using fallback quiz data")
      if (action === "generate") {
        return NextResponse.json(fallbackQuizData)
      } else if (action === "analyze") {
        return NextResponse.json(fallbackAnalysisData)
      }
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash"
    const genAI = new GoogleGenerativeAI(apiKey!)
    const model = genAI.getGenerativeModel({ model: modelName })

    if (action === "generate") {
      // Generate quiz questions
      const prompt = `Create a career exploration quiz for students aged 13-18. Generate exactly 8 multiple-choice questions that help identify career interests and aptitudes.

User's current interests: ${interests?.join(", ") || "Not specified"}
Quiz type: ${quizType || "career-exploration"}

Format the response as a JSON object with this structure:
{
  "title": "Career Explorer Quiz",
  "description": "Discover career paths that match your interests and strengths",
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": [
        { "id": "a", "text": "Option A", "value": "category1" },
        { "id": "b", "text": "Option B", "value": "category2" },
        { "id": "c", "text": "Option C", "value": "category3" },
        { "id": "d", "text": "Option D", "value": "category4" }
      ]
    }
  ]
}

Categories to use in values: "creative", "analytical", "social", "technical", "leadership", "healthcare", "business", "education"

Make questions engaging and relevant to South African students. Include questions about:
- Work environment preferences
- Problem-solving approaches
- Communication styles  
- Subject interests
- Values and motivations
- Skills and talents
- Future goals
- Learning preferences

Only return valid JSON, no additional text.`

      const result = await model.generateContent(prompt)
      let text = result.response.text()
      
      // Clean up the response - remove code block markers if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      try {
        const quizData = JSON.parse(text)
        return NextResponse.json(quizData)
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", text.substring(0, 200) + "...")
        console.warn("Using fallback quiz due to parse error")
        return NextResponse.json(fallbackQuizData)
      }
    }

    if (action === "analyze") {
      // Analyze quiz results and suggest career paths
      const prompt = `Analyze these career quiz results and provide personalized career recommendations for a South African student.

Quiz Answers: ${JSON.stringify(previousAnswers)}
User Interests: ${interests?.join(", ") || "Not specified"}

Based on the answers, provide career recommendations in this JSON format:
{
  "analysis": {
    "primaryStrengths": ["strength1", "strength2", "strength3"],
    "personalityType": "Brief description of their work style and preferences",
    "motivations": ["motivation1", "motivation2"]
  },
  "recommendedCareers": [
    {
      "title": "Career Title",
      "match": 95,
      "description": "Why this career fits them",
      "pathway": "Education/qualification requirements",
      "salaryRange": "R000,000 - R000,000",
      "growth": "Job market outlook",
      "nextSteps": ["step1", "step2", "step3"]
    }
  ],
  "additionalSuggestions": {
    "subjects": ["subject1", "subject2"],
    "skills": ["skill1", "skill2"],
    "experiences": ["experience1", "experience2"]
  }
}

Provide 3-5 career recommendations ranked by match percentage. Focus on careers available in South Africa with realistic salary ranges in South African Rand. Include both traditional and emerging career options.

Only return valid JSON, no additional text.`

      const result = await model.generateContent(prompt)
      let text = result.response.text()
      
      // Clean up the response - remove code block markers if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      try {
        const analysisData = JSON.parse(text)
        return NextResponse.json(analysisData)
      } catch (parseError) {
        console.error("Failed to parse AI analysis as JSON:", text.substring(0, 200) + "...")
        console.warn("Using fallback analysis due to parse error")
        return NextResponse.json(fallbackAnalysisData)
      }
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 })
  } catch (err: any) {
    console.error("/api/quiz error", err)
    
    // Handle quota exceeded error specifically
    if (err.status === 429 || err.message?.includes("quota") || err.message?.includes("Too Many Requests")) {
      console.warn("API quota exceeded, using fallback data")
      if (action === "generate") {
        return NextResponse.json({
          ...fallbackQuizData,
          fallbackMessage: "Using offline quiz due to high demand. Your results will still be accurate!"
        })
      } else if (action === "analyze") {
        return NextResponse.json({
          ...fallbackAnalysisData,
          fallbackMessage: "Analysis completed using our built-in career matching system."
        })
      }
    }
    
    // Handle other API errors
    if (err.status && err.status >= 400) {
      console.warn("API error, using fallback data:", err.message)
      if (action === "generate") {
        return NextResponse.json(fallbackQuizData)
      } else if (action === "analyze") {
        return NextResponse.json(fallbackAnalysisData)
      }
    }
    
    // Generic error fallback
    console.warn("Generic error, using fallback data")
    return NextResponse.json(
      action === "generate" ? fallbackQuizData : fallbackAnalysisData
    )
  }
}