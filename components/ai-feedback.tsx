"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, ThumbsUp, ThumbsDown, Lightbulb, Sparkles } from "lucide-react"

interface AIFeedbackProps {
  isCorrect: boolean
  explanation: string
  encouragement?: string
  hint?: string
}

export function AIFeedback({ isCorrect, explanation, encouragement, hint }: AIFeedbackProps) {
  const [showHint, setShowHint] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState<"up" | "down" | null>(null)

  const feedbackMessages = {
    correct: [
      "Excellent work! You're really getting the hang of this! 🌟",
      "Perfect! Your understanding is growing stronger! 💪",
      "Outstanding! You solved that like a true scholar! 🎓",
      "Brilliant! Keep up this amazing progress! ✨",
    ],
    incorrect: [
      "Don't worry, learning takes practice! Let's try a different approach. 🤔",
      "That's okay! Every mistake is a step closer to understanding. 💡",
      "No problem! Even the best learners make mistakes. Let's learn together! 🌱",
      "It's alright! Your effort is what matters most. Let's figure this out! 🚀",
    ],
  }

  const getRandomMessage = (type: "correct" | "incorrect") => {
    const messages = feedbackMessages[type]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <Card className={`border-2 ${isCorrect ? "border-accent bg-accent/5" : "border-primary bg-primary/5"}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${isCorrect ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}
          >
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isCorrect ? "default" : "secondary"} className="bg-secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Tutor
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {isCorrect ? "Celebrating your success!" : "Here to help you learn!"}
                </span>
              </div>
              <p className="font-medium text-sm mb-2">{getRandomMessage(isCorrect ? "correct" : "incorrect")}</p>
              <p className="text-sm text-muted-foreground">{explanation}</p>
            </div>

            {encouragement && (
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
                <p className="text-sm font-medium text-secondary-foreground">{encouragement}</p>
              </div>
            )}

            {!isCorrect && hint && (
              <div className="space-y-2">
                {!showHint ? (
                  <Button variant="outline" size="sm" onClick={() => setShowHint(true)}>
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Need a hint?
                  </Button>
                ) : (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-accent mt-0.5" />
                      <p className="text-sm font-medium text-accent-foreground">{hint}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-xs text-muted-foreground">Was this helpful?</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFeedbackRating("up")}
                className={`h-6 px-2 ${feedbackRating === "up" ? "bg-accent/20 text-accent" : ""}`}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFeedbackRating("down")}
                className={`h-6 px-2 ${feedbackRating === "down" ? "bg-destructive/20 text-destructive" : ""}`}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
