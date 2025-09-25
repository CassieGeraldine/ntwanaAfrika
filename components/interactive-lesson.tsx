"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Star,
  BookOpen,
  Target,
  Coins,
  Clock
} from 'lucide-react'
import { LessonContent } from '@/hooks/use-curriculum'

interface InteractiveLessonProps {
  lesson: LessonContent
  onComplete: (skillCoinsEarned: number) => void
  onNext?: () => void
  onPrevious?: () => void
}

export function InteractiveLesson({ lesson, onComplete, onNext, onPrevious }: InteractiveLessonProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState<Record<number, boolean>>({})
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [lessonProgress, setLessonProgress] = useState(0)

  const totalSteps = 2 + lesson.content.mainContent.length + lesson.content.exercises.length + 2 // intro + main + exercises + application + summary
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  useEffect(() => {
    setLessonProgress(progressPercentage)
  }, [currentStep, progressPercentage])

  const handleExerciseAnswer = (exerciseIndex: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [exerciseIndex]: answer }))
  }

  const checkAnswer = (exerciseIndex: number) => {
    const exercise = lesson.content.exercises[exerciseIndex]
    const userAnswer = answers[exerciseIndex]
    const isCorrect = userAnswer?.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()
    
    setShowResults(prev => ({ ...prev, [exerciseIndex]: true }))
    
    // Check if all exercises are completed
    const allExercisesAnswered = lesson.content.exercises.every((_, idx) => 
      answers[idx] && showResults[idx]
    )
    
    if (allExercisesAnswered) {
      setExerciseComplete(true)
    }
    
    return isCorrect
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Lesson completed
      onComplete(lesson.skillCoins)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else if (onPrevious) {
      onPrevious()
    }
  }

  const renderIntroduction = () => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <Badge variant="outline">{lesson.difficulty}</Badge>
          <Badge className="bg-secondary">
            <Coins className="h-3 w-3 mr-1" />
            {lesson.skillCoins} coins
          </Badge>
        </div>
        <CardTitle className="text-2xl">{lesson.content.introduction.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg leading-relaxed">
          {lesson.content.introduction.content}
        </div>
        
        <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span className="font-semibold">Cultural Connection</span>
          </div>
          <p className="text-sm">{lesson.content.introduction.culturalContext}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{lesson.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>{lesson.difficulty} Level</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderMainContent = (contentIndex: number) => {
    const content = lesson.content.mainContent[contentIndex]
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {content.section}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-base leading-relaxed">
            {content.explanation}
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Example
            </h4>
            <p className="text-sm">{content.example}</p>
          </div>

          <div className="p-3 bg-muted/50 rounded border-dashed border-2">
            <p className="text-sm italic">
              💡 Visual: {content.visualDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderExercise = (exerciseIndex: number) => {
    const exercise = lesson.content.exercises[exerciseIndex]
    const userAnswer = answers[exerciseIndex]
    const showResult = showResults[exerciseIndex]
    const isCorrect = userAnswer?.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Practice Exercise {exerciseIndex + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">
            {exercise.question}
          </div>

          <div className="p-3 bg-accent/10 rounded-lg">
            <p className="text-sm">
              💡 <strong>Hint:</strong> {exercise.contextualHint}
            </p>
          </div>

          {exercise.type === 'multiple-choice' && exercise.options && (
            <RadioGroup
              value={userAnswer}
              onValueChange={(value) => handleExerciseAnswer(exerciseIndex, value)}
              disabled={showResult}
            >
              {exercise.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {exercise.type === 'fill-blank' && (
            <Input
              placeholder="Type your answer here..."
              value={userAnswer || ''}
              onChange={(e) => handleExerciseAnswer(exerciseIndex, e.target.value)}
              disabled={showResult}
            />
          )}

          {exercise.type === 'practical' && (
            <Textarea
              placeholder="Describe your solution..."
              value={userAnswer || ''}
              onChange={(e) => handleExerciseAnswer(exerciseIndex, e.target.value)}
              disabled={showResult}
              className="min-h-[100px]"
            />
          )}

          {!showResult && userAnswer && (
            <Button onClick={() => checkAnswer(exerciseIndex)}>
              Check Answer
            </Button>
          )}

          {showResult && (
            <div className={`p-4 rounded-lg border-l-4 ${
              isCorrect 
                ? 'bg-green-50 border-green-500 text-green-800' 
                : 'bg-red-50 border-red-500 text-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </span>
              </div>
              <p className="text-sm">{exercise.explanation}</p>
              {!isCorrect && (
                <p className="text-sm mt-2">
                  <strong>Correct answer:</strong> {exercise.correctAnswer}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderRealWorldApplication = () => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {lesson.content.realWorldApplication.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold">How you'll use this in real life:</h4>
          <ul className="space-y-2">
            {lesson.content.realWorldApplication.examples.map((example, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg">
          <h4 className="font-semibold mb-2">Community Connection</h4>
          <p className="text-sm">{lesson.content.realWorldApplication.communityConnection}</p>
        </div>
      </CardContent>
    </Card>
  )

  const renderSummary = () => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Lesson Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Well Done! 🎉</h3>
          <div className="flex items-center justify-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="text-lg font-semibold">+{lesson.skillCoins} Skill Coins Earned!</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Key takeaways:</h4>
          <ul className="space-y-2">
            {lesson.content.summary.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Star className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg">
          <h4 className="font-semibold mb-2">What's Next?</h4>
          <p className="text-sm">{lesson.content.summary.nextSteps}</p>
        </div>
      </CardContent>
    </Card>
  )

  const getCurrentContent = () => {
    if (currentStep === 0) {
      return renderIntroduction()
    }
    
    const mainContentStart = 1
    const exercisesStart = mainContentStart + lesson.content.mainContent.length
    const applicationStep = exercisesStart + lesson.content.exercises.length
    const summaryStep = applicationStep + 1

    if (currentStep >= mainContentStart && currentStep < exercisesStart) {
      return renderMainContent(currentStep - mainContentStart)
    }
    
    if (currentStep >= exercisesStart && currentStep < applicationStep) {
      return renderExercise(currentStep - exercisesStart)
    }
    
    if (currentStep === applicationStep) {
      return renderRealWorldApplication()
    }
    
    if (currentStep === summaryStep) {
      return renderSummary()
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <p className="text-sm text-muted-foreground">{lesson.description}</p>
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(progressPercentage)}% Complete
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="min-h-[500px]">
        {getCurrentContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button onClick={handleNext}>
          {currentStep === totalSteps - 1 ? (
            <>
              <Trophy className="h-4 w-4 mr-2" />
              Complete Lesson
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
