"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Lightbulb,
  Volume2,
  Pause,
  Play,
  RotateCcw,
  Zap,
  Trophy,
  Star,
} from "lucide-react"

// Mock lesson data
const lessonData = {
  1: {
    title: "Fractions and Decimals",
    subject: "Mathematics",
    description: "Learn to work with parts of whole numbers",
    totalSteps: 5,
    reward: 50,
    content: [
      {
        type: "introduction",
        title: "Welcome to Fractions!",
        content: "Today we'll learn about fractions - parts of a whole number. Think of a pizza cut into slices!",
        image: "/placeholder.svg?height=200&width=300&query=pizza slices fraction",
      },
      {
        type: "lesson",
        title: "What is a Fraction?",
        content:
          "A fraction shows parts of a whole. The top number (numerator) shows how many parts we have. The bottom number (denominator) shows how many parts the whole is divided into.",
        example: "In 3/4, we have 3 parts out of 4 total parts.",
        image: "/placeholder.svg?height=200&width=300&query=fraction diagram 3/4",
      },
      {
        type: "interactive",
        title: "Practice Time!",
        question: "If you eat 2 slices of a pizza that has 8 slices total, what fraction did you eat?",
        options: ["2/8", "8/2", "2/6", "6/8"],
        correct: 0,
        explanation: "You ate 2 slices out of 8 total slices, so the fraction is 2/8!",
      },
      {
        type: "quiz",
        title: "Quick Check",
        question: "Which fraction is larger: 1/2 or 1/4?",
        options: ["1/2", "1/4", "They are equal", "Cannot tell"],
        correct: 0,
        explanation: "1/2 means half of something, while 1/4 means a quarter. Half is bigger than a quarter!",
      },
      {
        type: "completion",
        title: "Great Job!",
        content: "You've completed the lesson on fractions! You earned 50 Skill Coins and unlocked a new badge.",
        badge: "Fraction Master",
      },
    ],
  },
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lessonComplete, setLessonComplete] = useState(false)
  const router = useRouter()

  const lesson = lessonData[params.id as keyof typeof lessonData]
  const currentContent = lesson?.content[currentStep]

  useEffect(() => {
    if (!lesson) {
      router.push("/learn")
    }
  }, [lesson, router])

  if (!lesson) {
    return <div>Loading...</div>
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === currentContent.correct
    setIsCorrect(correct)
    setShowFeedback(true)

    // AI feedback simulation
    setTimeout(() => {
      if (correct) {
        // Positive reinforcement
        console.log("Great job! You're getting the hang of fractions!")
      } else {
        // Encouraging feedback
        console.log("Not quite right, but you're learning! Let's try to think about it differently.")
      }
    }, 1000)
  }

  const handleNext = () => {
    if (currentStep < lesson.content.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setIsCorrect(false)
    } else {
      setLessonComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setIsCorrect(false)
    }
  }

  const handleComplete = () => {
    // Save progress and redirect
    router.push("/learn")
  }

  const progress = ((currentStep + 1) / lesson.totalSteps) * 100

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => router.push("/learn")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{lesson.title}</h1>
              <p className="text-sm text-muted-foreground">{lesson.subject}</p>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <Zap className="h-4 w-4" />
              <span className="font-medium">{lesson.reward} coins</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {lesson.totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Lesson Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentContent.type === "interactive" && <Lightbulb className="h-5 w-5 text-secondary" />}
                {currentContent.type === "quiz" && <Trophy className="h-5 w-5 text-primary" />}
                {currentContent.type === "completion" && <Star className="h-5 w-5 text-accent" />}
                {currentContent.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Introduction/Lesson Content */}
              {(currentContent.type === "introduction" || currentContent.type === "lesson") && (
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">{currentContent.content}</p>
                  {currentContent.example && (
                    <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                      <p className="font-medium text-secondary-foreground">
                        <strong>Example:</strong> {currentContent.example}
                      </p>
                    </div>
                  )}
                  {currentContent.image && (
                    <div className="flex justify-center">
                      <img
                        src={currentContent.image || "/placeholder.svg"}
                        alt="Lesson illustration"
                        className="rounded-lg border max-w-sm w-full"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-2"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "Pause" : "Listen"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Volume2 className="h-4 w-4 mr-1" />
                      Audio
                    </Button>
                  </div>
                </div>
              )}

              {/* Interactive/Quiz Content */}
              {(currentContent.type === "interactive" || currentContent.type === "quiz") && (
                <div className="space-y-4">
                  <p className="text-lg font-medium">{currentContent.question}</p>
                  <div className="grid gap-3">
                    {currentContent.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback}
                        className={`p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswer === index
                            ? showFeedback
                              ? isCorrect
                                ? "border-accent bg-accent/10 text-accent-foreground"
                                : "border-destructive bg-destructive/10 text-destructive-foreground"
                              : "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswer === index
                                ? showFeedback
                                  ? isCorrect
                                    ? "border-accent bg-accent"
                                    : "border-destructive bg-destructive"
                                  : "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {showFeedback && selectedAnswer === index && (
                              <>
                                {isCorrect ? (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-white" />
                                )}
                              </>
                            )}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {showFeedback && (
                    <div
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? "border-accent bg-accent/10 text-accent-foreground"
                          : "border-destructive bg-destructive/10 text-destructive-foreground"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium mb-1">{isCorrect ? "Correct!" : "Not quite right"}</p>
                          <p className="text-sm">{currentContent.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!showFeedback && selectedAnswer !== null && (
                    <Button onClick={handleSubmitAnswer} className="w-full">
                      Submit Answer
                    </Button>
                  )}
                </div>
              )}

              {/* Completion Content */}
              {currentContent.type === "completion" && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-lg">{currentContent.content}</p>
                  {currentContent.badge && (
                    <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-2">
                      <Star className="h-5 w-5 text-secondary" />
                      <span className="font-medium">New Badge: {currentContent.badge}</span>
                    </div>
                  )}
                  <Button onClick={handleComplete} size="lg" className="bg-primary hover:bg-primary/90">
                    Continue Learning
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          {currentContent.type !== "completion" && (
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart
                </Button>
              </div>

              <Button
                onClick={handleNext}
                disabled={
                  (currentContent.type === "interactive" || currentContent.type === "quiz") &&
                  (!showFeedback || !isCorrect)
                }
              >
                {currentStep === lesson.content.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
