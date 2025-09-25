"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { InteractiveLesson } from "@/components/interactive-lesson"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "@/components/progress-ring"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calculator,
  Beaker,
  Sprout,
  Play,
  Lock,
  Star,
  Trophy,
  Clock,
  ChevronRight,
  Target,
  Zap,
  Coins,
  Brain,
  Sparkles,
  ArrowLeft,
  RotateCcw,
} from "lucide-react"
import { useCurriculum, type LessonContent, type CurriculumTopic } from "@/hooks/use-curriculum"

const subjects = [
  {
    id: "math",
    name: "Mathematics",
    icon: Calculator,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/20",
    description: "Numbers, patterns, and problem solving",
    progress: 85,
    totalLessons: 24,
    completedLessons: 20,
    skillCoins: 1200,
    nextReward: 50,
    difficulty: "Intermediate",
  },
  {
    id: "reading",
    name: "Reading & Language",
    icon: BookOpen,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    borderColor: "border-chart-2/20",
    description: "Stories, comprehension, and vocabulary",
    progress: 92,
    totalLessons: 18,
    completedLessons: 17,
    skillCoins: 850,
    nextReward: 30,
    difficulty: "Advanced",
  },
  {
    id: "science",
    name: "Science",
    icon: Beaker,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    borderColor: "border-chart-3/20",
    description: "Experiments, nature, and discovery",
    progress: 67,
    totalLessons: 15,
    completedLessons: 10,
    skillCoins: 500,
    nextReward: 40,
    difficulty: "Beginner",
  },
  {
    id: "life-skills",
    name: "Life Skills",
    icon: Sprout,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/20",
    description: "Health, community, and personal growth",
    progress: 45,
    totalLessons: 12,
    completedLessons: 5,
    skillCoins: 250,
    nextReward: 35,
    difficulty: "Beginner",
  },
]

const featuredLessons = [
  {
    id: 1,
    title: "Fractions and Decimals",
    subject: "Mathematics",
    duration: "15 min",
    difficulty: "Intermediate",
    reward: 50,
    completed: false,
    locked: false,
    description: "Learn to work with parts of whole numbers",
  },
  {
    id: 2,
    title: "African Folk Tales",
    subject: "Reading",
    duration: "20 min",
    difficulty: "Beginner",
    reward: 40,
    completed: true,
    locked: false,
    description: "Explore traditional stories from across Africa",
  },
  {
    id: 3,
    title: "Water Cycle",
    subject: "Science",
    duration: "12 min",
    difficulty: "Intermediate",
    reward: 45,
    completed: false,
    locked: false,
    description: "Discover how water moves through our environment",
  },
  {
    id: 4,
    title: "Healthy Eating",
    subject: "Life Skills",
    duration: "10 min",
    difficulty: "Beginner",
    reward: 35,
    completed: false,
    locked: true,
    description: "Learn about nutrition and balanced meals",
  },
]

const achievements = [
  { name: "Quick Learner", description: "Complete 3 lessons in one day", progress: 2, total: 3 },
  { name: "Math Wizard", description: "Score 100% on 5 math quizzes", progress: 3, total: 5 },
  { name: "Bookworm", description: "Read 10 stories", progress: 7, total: 10 },
]

export default function Learn() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [loadingLesson, setLoadingLesson] = useState(false)
  
  const {
    getSubjectTopics,
    generateLesson,
    saveProgress,
    getProgress,
    generateSampleLesson,
    isLoading: curriculumLoading
  } = useCurriculum()

  const [subjectTopics, setSubjectTopics] = useState<string[]>([])
  const [loadingTopics, setLoadingTopics] = useState(false)

  // Simple in-memory progress tracking
  const [progressData, setProgressData] = useState<Record<string, Record<string, number>>>({})

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-accent border-accent/20 bg-accent/10"
      case "Intermediate":
        return "text-secondary border-secondary/20 bg-secondary/10"
      case "Advanced":
        return "text-destructive border-destructive/20 bg-destructive/10"
      default:
        return "text-muted-foreground border-border bg-muted/10"
    }
  }

  const handleSubjectSelect = async (subjectId: string) => {
    setSelectedSubject(subjectId)
    setSelectedTopic(null)
    setCurrentLesson(null)
    setLoadingTopics(true)
    
    try {
      const curriculum = await getSubjectTopics(subjectId)
      const topicTitles = curriculum.topics.map(topic => topic.title)
      setSubjectTopics(topicTitles)
    } catch (error) {
      console.error('Failed to load topics:', error)
      // Fallback topics
      const fallbackTopics = {
        mathematics: ['Basic Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions'],
        science: ['Plants and Animals', 'Weather', 'Solar System', 'Human Body', 'Materials'],
        reading: ['Phonics', 'Vocabulary', 'Comprehension', 'Story Structure', 'Poetry'],
        'life-skills': ['Personal Hygiene', 'Community Helpers', 'Safety Rules', 'Healthy Eating', 'Emotions']
      }
      setSubjectTopics(fallbackTopics[subjectId as keyof typeof fallbackTopics] || [])
    } finally {
      setLoadingTopics(false)
    }
  }

  const handleTopicSelect = async (topic: string) => {
    setSelectedTopic(topic)
    setLoadingLesson(true)
    
    try {
      const lesson = await generateLesson(selectedSubject!, topic, 'primary', 'Beginner')
      setCurrentLesson(lesson)
    } catch (error) {
      console.error('Failed to generate lesson:', error)
      // Use sample lesson as fallback from hook
      const sampleLesson = generateSampleLesson(selectedSubject!, topic)
      setCurrentLesson(sampleLesson)
    } finally {
      setLoadingLesson(false)
    }
  }

  const handleLessonComplete = (score: number) => {
    if (selectedSubject && selectedTopic) {
      // Save progress in local state
      setProgressData(prev => ({
        ...prev,
        [selectedSubject]: {
          ...prev[selectedSubject],
          [selectedTopic]: score
        }
      }))
      
      // Also save to localStorage via the hook
      const lessonId = `${selectedSubject}_${selectedTopic.replace(/\s+/g, '_').toLowerCase()}`
      saveProgress(lessonId, score, score >= 70)
    }
    
    // Return to topic selection
    setCurrentLesson(null)
    setSelectedTopic(null)
  }

  const getSubjectProgressPercentage = (subjectId: string) => {
    const subjectProgress = progressData[subjectId] || {}
    const totalTopics = subjectTopics.length || 5
    const completedTopics = Object.keys(subjectProgress).length
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
  }

  const getTotalStats = () => {
    const allProgress = Object.values(progressData)
    const totalCompleted = allProgress.reduce((acc, subject) => acc + Object.keys(subject).length, 0)
    const totalScore = allProgress.reduce((acc, subject) => 
      acc + Object.values(subject).reduce((sum, score) => sum + score, 0), 0
    )
    const highScores = allProgress.reduce((acc, subject) => 
      acc + Object.values(subject).filter(score => score >= 80).length, 0
    )
    const avgScore = totalCompleted > 0 ? Math.round(totalScore / totalCompleted) : 0
    
    return { totalCompleted, totalScore, highScores, avgScore }
  }

  // If showing a lesson
  if (currentLesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentLesson(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>
            <InteractiveLesson 
              lesson={currentLesson}
              onComplete={handleLessonComplete}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Learning Center</h1>
            <p className="text-muted-foreground">
              {selectedSubject 
                ? `Choose a topic in ${subjects.find(s => s.id === selectedSubject)?.name} to start learning!`
                : 'Choose your subject and start earning Skill Coins!'
              }
            </p>
          </div>

          {/* Navigation breadcrumbs */}
          {selectedSubject && (
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedSubject(null)
                  setSelectedTopic(null)
                  setCurrentLesson(null)
                }}
              >
                All Subjects
              </Button>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-foreground">
                {subjects.find(s => s.id === selectedSubject)?.name}
              </span>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{getTotalStats().totalCompleted}</div>
                <div className="text-xs text-muted-foreground">Topics Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-6 w-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">{getTotalStats().totalScore}</div>
                <div className="text-xs text-muted-foreground">Total Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">{getTotalStats().highScores}</div>
                <div className="text-xs text-muted-foreground">High Scores (80%+)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold">{getTotalStats().avgScore}%</div>
                <div className="text-xs text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>
          </div>

          {!selectedSubject ? (
            /* Subject Selection */
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Choose Your Subject</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjects.map((subject) => {
                  const Icon = subject.icon
                  const progress = getSubjectProgressPercentage(subject.id)
                  const subjectProgressData = progressData[subject.id] || {}
                  const completedTopics = Object.keys(subjectProgressData).length
                  
                  return (
                    <Card
                      key={subject.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${subject.borderColor} ${subject.bgColor}`}
                      onClick={() => handleSubjectSelect(subject.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${subject.bgColor}`}>
                            <Icon className={`h-6 w-6 ${subject.color}`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{subject.name}</CardTitle>
                            <Badge variant="outline" className={getDifficultyColor(subject.difficulty)}>
                              {subject.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{subject.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {completedTopics} topics completed
                            </span>
                            <div className="flex items-center gap-1 text-secondary">
                              <Zap className="h-3 w-3" />
                              <span className="font-medium">AI Powered</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Topic Selection */
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {subjects.find(s => s.id === selectedSubject)?.name} Topics
                </h2>
                {loadingTopics && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                    Loading topics...
                  </div>
                )}
              </div>
              
              {loadingLesson && (
                <Card className="mb-4">
                  <CardContent className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                    <h3 className="font-semibold mb-2">Creating Your Personalized Lesson</h3>
                    <p className="text-muted-foreground">
                      Our AI tutor is preparing a lesson tailored to South African students...
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectTopics.map((topic, index) => {
                  const subjectProgressData = progressData[selectedSubject!] || {}
                  const topicScore = subjectProgressData[topic]
                  const isCompleted = topicScore !== undefined
                  
                  return (
                    <Card
                      key={index}
                      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                      onClick={() => !loadingLesson && handleTopicSelect(topic)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{topic}</CardTitle>
                          {isCompleted && (
                            <Badge className="bg-accent text-accent-foreground">
                              {topicScore}%
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {isCompleted ? 'Completed' : 'Ready to learn'}
                          </span>
                          <Button 
                            size="sm" 
                            disabled={loadingLesson}
                            className={isCompleted ? "bg-secondary hover:bg-secondary/90" : ""}
                          >
                            {loadingLesson ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            ) : isCompleted ? (
                              <>
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Retry
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {subjectTopics.length === 0 && !loadingTopics && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-muted-foreground mb-4">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No topics available for this subject yet.</p>
                      <p className="text-sm mt-1">Please try again later or select a different subject.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Achievement Progress - Show when not in subject view */}
          {!selectedSubject && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-secondary" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.slice(0, 3).map((subject) => {
                    const progress = getSubjectProgressPercentage(subject.id)
                    const subjectProgressData = progressData[subject.id] || {}
                    const completedTopics = Object.keys(subjectProgressData).length
                    
                    return (
                      <div key={subject.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <ProgressRing progress={progress} size={60}>
                          <div className="text-center">
                            <div className="text-sm font-bold">{progress}</div>
                            <div className="text-xs text-muted-foreground">%</div>
                          </div>
                        </ProgressRing>
                        <div className="flex-1">
                          <h4 className="font-semibold">{subject.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {completedTopics} topics completed
                          </p>
                          <Progress value={progress} className="mt-2 h-2" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
