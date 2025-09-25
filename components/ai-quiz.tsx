"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  BookOpen,
  Star,
  Award,
  Clock,
  Brain,
  ArrowRight,
} from "lucide-react"

interface QuizOption {
  id: string
  text: string
  value: string
}

interface QuizQuestion {
  id: number
  question: string
  options: QuizOption[]
}

interface QuizData {
  title: string
  description: string
  questions: QuizQuestion[]
  fallbackMessage?: string
}

interface QuizAnswer {
  questionId: number
  selectedOption: string
  value: string
}

interface CareerRecommendation {
  title: string
  match: number
  description: string
  pathway: string
  salaryRange: string
  growth: string
  nextSteps: string[]
}

interface AnalysisResult {
  analysis: {
    primaryStrengths: string[]
    personalityType: string
    motivations: string[]
  }
  recommendedCareers: CareerRecommendation[]
  additionalSuggestions: {
    subjects: string[]
    skills: string[]
    experiences: string[]
  }
  fallbackMessage?: string
}

interface AIQuizProps {
  interests: string[]
  onComplete?: () => void
}

export function AIQuiz({ interests, onComplete }: AIQuizProps) {
  const [currentStep, setCurrentStep] = useState<"loading" | "quiz" | "results">("loading")
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateQuiz = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generate",
          quizType: "career-exploration",
          interests,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate quiz")
      }

      const data = await response.json()
      setQuizData(data)
      setCurrentStep("quiz")
      
      // Show notification if using fallback
      if (data.fallbackMessage) {
        console.info("Quiz fallback:", data.fallbackMessage)
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
      // Fallback quiz data
      setQuizData({
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
              { id: "d", text: "Fast-paced, high-energy setting", value: "leadership" },
            ],
          },
        ],
      })
      setCurrentStep("quiz")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (optionId: string, value: string) => {
    setSelectedAnswer(optionId)
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion + 1,
      selectedOption: optionId,
      value,
    }
    
    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion + 1)
    updatedAnswers.push(newAnswer)
    setAnswers(updatedAnswers)
  }

  const goToNextQuestion = () => {
    if (currentQuestion < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
      const existingAnswer = answers.find(a => a.questionId === currentQuestion + 2)
      setSelectedAnswer(existingAnswer?.selectedOption || "")
    } else {
      // Quiz completed, analyze results
      analyzeResults()
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      const existingAnswer = answers.find(a => a.questionId === currentQuestion)
      setSelectedAnswer(existingAnswer?.selectedOption || "")
    }
  }

  const analyzeResults = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "analyze",
          previousAnswers: answers,
          interests,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze results")
      }

      const data = await response.json()
      setAnalysisResult(data)
      setCurrentStep("results")
      
      // Show notification if using fallback
      if (data.fallbackMessage) {
        console.info("Analysis fallback:", data.fallbackMessage)
      }
    } catch (error) {
      console.error("Error analyzing results:", error)
      // Fallback analysis
      setAnalysisResult({
        analysis: {
          primaryStrengths: ["Problem-solving", "Communication", "Creativity"],
          personalityType: "You prefer collaborative environments and enjoy helping others achieve their goals.",
          motivations: ["Making a difference", "Continuous learning", "Financial stability"],
        },
        recommendedCareers: [
          {
            title: "Software Developer",
            match: 92,
            description: "Your analytical thinking and interest in technology make this a great fit.",
            pathway: "Computer Science degree or coding bootcamp",
            salaryRange: "R400,000 - R1,200,000",
            growth: "Very high demand",
            nextSteps: ["Learn programming basics", "Build a portfolio", "Apply for internships"],
          },
        ],
        additionalSuggestions: {
          subjects: ["Mathematics", "Computer Science", "Physics"],
          skills: ["Critical thinking", "Problem-solving", "Communication"],
          experiences: ["Coding projects", "Team collaborations", "Online courses"],
        },
      })
      setCurrentStep("results")
    } finally {
      setIsLoading(false)
    }
  }

  const restartQuiz = () => {
    setCurrentStep("loading")
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer("")
    setAnalysisResult(null)
    setQuizData(null)
  }

  // Initial load effect
  useEffect(() => {
    if (currentStep === "loading" && !quizData && !isLoading) {
      generateQuiz()
    }
  }, [currentStep, quizData, isLoading])

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {currentStep === "loading" ? "Generating your personalized quiz..." : "Analyzing your responses..."}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "results" && analysisResult) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Results Header */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Career Analysis</h2>
            <p className="text-muted-foreground">
              Based on your responses, here are personalized career recommendations
            </p>
            {analysisResult.fallbackMessage && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  ℹ️ {analysisResult.fallbackMessage}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-secondary" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.analysis.primaryStrengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-accent" />
                Work Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {analysisResult.analysis.personalityType}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Motivations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysisResult.analysis.motivations.map((motivation, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {motivation}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Career Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recommended Career Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResult.recommendedCareers.map((career, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{career.title}</h3>
                    <p className="text-sm text-muted-foreground">{career.description}</p>
                  </div>
                  <Badge variant="default" className="bg-primary/10 text-primary">
                    {career.match}% match
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="font-medium">Education Path:</p>
                    <p className="text-muted-foreground">{career.pathway}</p>
                  </div>
                  <div>
                    <p className="font-medium">Salary Range:</p>
                    <p className="text-muted-foreground">{career.salaryRange}</p>
                  </div>
                  <div>
                    <p className="font-medium">Job Market:</p>
                    <p className="text-muted-foreground">{career.growth}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">Next Steps:</p>
                  <div className="flex flex-wrap gap-2">
                    {career.nextSteps.map((step, stepIndex) => (
                      <Badge key={stepIndex} variant="secondary" className="text-xs">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {step}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Suggestions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-secondary" />
                Focus Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysisResult.additionalSuggestions.subjects.map((subject, index) => (
                  <Badge key={index} variant="outline">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-accent" />
                Develop Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysisResult.additionalSuggestions.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Get Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysisResult.additionalSuggestions.experiences.map((experience, index) => (
                  <Badge key={index} variant="default">
                    {experience}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={restartQuiz} variant="outline">
            Take Quiz Again
          </Button>
          <Button onClick={onComplete}>
            Explore Careers
          </Button>
        </div>
      </div>
    )
  }

  if (currentStep === "quiz" && quizData) {
    const question = quizData.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{quizData.title}</h2>
              <p className="text-sm text-muted-foreground">{quizData.description}</p>
              {quizData.fallbackMessage && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    ℹ️ {quizData.fallbackMessage}
                  </p>
                </div>
              )}
            </div>
            <Badge variant="secondary">
              {currentQuestion + 1} of {quizData.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            
            <RadioGroup
              value={selectedAnswer}
              onValueChange={(value) => {
                const option = question.options.find(opt => opt.id === value)
                if (option) {
                  handleAnswerSelect(value, option.value)
                }
              }}
            >
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label 
                      htmlFor={option.id} 
                      className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={goToNextQuestion}
              disabled={!selectedAnswer}
            >
              {currentQuestion === quizData.questions.length - 1 ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Results
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}