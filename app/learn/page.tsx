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
  Volume2,
  Palette,
} from "lucide-react"
import { useCurriculum, type LessonContent, type CurriculumTopic } from "@/hooks/use-curriculum"
import { ProtectedRoute } from "@/components/protected-route"
import { useUserData } from "@/hooks/use-user-data"

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

const achievements = [
  { name: "Quick Learner", description: "Complete 3 lessons in one day", progress: 2, total: 3 },
  { name: "Math Wizard", description: "Score 100% on 5 math quizzes", progress: 3, total: 5 },
  { name: "Bookworm", description: "Read 10 stories", progress: 7, total: 10 },
]

const learningModes = [
  { name: 'Standard', icon: BookOpen, description: 'Default text and visual-based learning.' },
  { name: 'Auditory/Blind', icon: Volume2, description: 'Highly descriptive content optimized for screen readers and listening. (Blind/Visually Impaired)' },
  { name: 'Dyslexia-Friendly', icon: Palette, description: 'Simplified language and clear structure. (Dyslexia/Cognitive)' },
  { name: 'ADHD/Kinesthetic', icon: Zap, description: 'Short, engaging chunks with mental exercises and activities. (ADHD/Kinesthetic)' },
]

export default function Learn() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [loadingLesson, setLoadingLesson] = useState(false)
  const [selectedMode, setSelectedMode] = useState<string>('Standard')
  
  const {
    getSubjectTopics,
    generateLesson,
    saveProgress,
    getProgress,
    generateSampleLesson,
    isLoading: curriculumLoading
  } = useCurriculum()

  const { userProfile, completeLesson } = useUserData()

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

  const getModeStyle = () => {
    if (selectedMode === 'Dyslexia-Friendly') {
      return {
        fontFamily: 'Open Dyslexic, sans-serif',
        lineHeight: 1.8,
        letterSpacing: '0.1em',
        backgroundColor: '#FFFFEE',
        color: '#333',
      }
    }
    return {}
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
      const lesson = await generateLesson(selectedSubject!, topic, 'primary', selectedMode)
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
      // Allocate points to user in Firebase
      const lessonId = `${selectedSubject}_${selectedTopic.replace(/\s+/g, '_').toLowerCase()}`
      const coinsAwarded = score // Or use your own logic for coins
      completeLesson(lessonId, coinsAwarded)
    }
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

  const getSystemInstruction = (mode: string) => {
    switch (mode) {
      case 'Auditory/Blind':
        return "You are a detailed, descriptive auditory tutor. Provide a step-by-step, highly clear, and detailed explanation suitable for someone listening to a screen reader. Avoid complex visual jargon and use concrete language. Structure the content with clear headings and enumerated lists for easy navigation.";
      case 'Dyslexia-Friendly':
        return "You are a clear and concise tutor. Use short sentences, simple vocabulary (Grade 5 reading level), and break the content into very short paragraphs. Maintain a highly organized, bulleted list or short section format. Focus on one core concept at a time.";
      case 'ADHD/Kinesthetic':
        return "You are an energetic and engaging activity guide. Deliver the lesson in highly focused, action-oriented chunks. Every 1-2 paragraphs, include a 'Quick Challenge' or 'Do This Now' section that requires mental or physical participation to maintain engagement. Keep the tone lively.";
      case 'Standard':
      default:
        return "You are a friendly, expert tutor. Generate an educational lesson about the following topic.";
    }
  };

  // Dynamic featured lessons state
  const [featuredLessons, setFeaturedLessons] = useState<any[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  useEffect(() => {
    async function fetchFeaturedLessons() {
      setLoadingFeatured(true);
      try {
        // Example: fetch topics for all subjects, then generate lessons for each
        const systemInstruction = getSystemInstruction(selectedMode);
        const lessons: any[] = [];
        for (const subject of subjects) {
          const curriculum = await getSubjectTopics(subject.id);
          const topics = curriculum.topics.slice(0, 1); // Just one featured topic per subject for demo
          for (const topic of topics) {
            const lesson = await generateLesson(subject.id, topic.title, 'primary', selectedMode, systemInstruction);
            lessons.push({
              id: `${subject.id}_${topic.title}`,
              title: lesson.title || topic.title,
              subject: subject.name,
              duration: lesson.duration || '10 min',
              difficulty: lesson.difficulty || subject.difficulty,
              reward: lesson.reward || 30,
              completed: !!progressData[subject.id]?.[topic.title],
              locked: false, // Add logic if needed
              description: lesson.description || '',
              contentTypes: lesson.contentTypes || [],
            });
          }
        }
        setFeaturedLessons(lessons);
      } catch (err) {
        setFeaturedLessons([]);
      } finally {
        setLoadingFeatured(false);
      }
    }
    fetchFeaturedLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMode, progressData]);

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
            <div className="flex items-center space-x-2 mb-6 p-3 bg-accent/20 border-l-4 border-accent rounded-lg">
              <Target className="w-5 h-5 text-accent" />
              <p className="text-sm font-medium">
                Viewing content in <span className="font-semibold">{selectedMode} Mode</span> optimized for your learning style.
              </p>
            </div>
            <div style={getModeStyle()}>
              <InteractiveLesson 
                lesson={currentLesson}
                onComplete={handleLessonComplete}
                selectedMode={selectedMode}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
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

            {/* Learning Mode Selector */}
            <div className="my-8">
              <h3 className="text-xl font-semibold mb-4">Choose Your Learning Mode (Accessibility Settings)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {learningModes.map(mode => {
                  const Icon = mode.icon
                  return (
                    <button
                      key={mode.name}
                      onClick={() => setSelectedMode(mode.name)}
                      className={`p-4 rounded-xl text-left transition duration-200 shadow-md border-2 ${
                        selectedMode === mode.name
                          ? 'border-accent bg-accent/10 ring-2 ring-accent'
                          : 'border-border bg-white hover:border-muted'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${selectedMode === mode.name ? 'text-accent' : 'text-muted-foreground'}`} />
                      <p className="font-bold text-sm">{mode.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
                    </button>
                  )
                })}
              </div>
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

            {/* Render dynamic featured lessons */}
            {!selectedSubject && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Featured Lessons</h2>
                {loadingFeatured ? (
                  <div className="text-muted-foreground">Loading featured lessons...</div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredLessons.map((lesson) => (
                      <Card key={lesson.id} className="transition-all hover:shadow-lg">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-muted/10">
                              {/* Find subject icon */}
                              {(() => {
                                const subject = subjects.find(s => s.name === lesson.subject);
                                if (subject) {
                                  const Icon = subject.icon;
                                  return <Icon className={`h-6 w-6 ${subject.color}`} />;
                                }
                                return null;
                              })()}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{lesson.title}</CardTitle>
                              <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                                {lesson.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{lesson.description}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Reward</span>
                              <span className="font-medium">{lesson.reward} Skill Coins</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {lesson.completed ? 'Completed' : 'Ready to learn'}
                              </span>
                              <Button size="sm" disabled={lesson.locked}>
                                {lesson.completed ? (
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                ) : (
                                  <Play className="h-4 w-4 mr-1" />
                                )}
                                {lesson.completed ? 'Retry' : 'Start'}
                              </Button>
                            </div>
                            {/* Show content types if available */}
                            {lesson.contentTypes && lesson.contentTypes.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {lesson.contentTypes.map((type: string, idx: number) => (
                                  <Badge key={idx} variant="secondary">{type}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
