"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "@/components/progress-ring"
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
} from "lucide-react"

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Learning Center</h1>
            <p className="text-muted-foreground">Choose your subject and start earning Skill Coins!</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">52</div>
                <div className="text-xs text-muted-foreground">Lessons Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-6 w-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">2,800</div>
                <div className="text-xs text-muted-foreground">Skill Coins Earned</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">Badges Unlocked</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Choose Your Subject</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => {
                const Icon = subject.icon
                return (
                  <Card
                    key={subject.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${subject.borderColor} ${subject.bgColor} ${
                      selectedSubject === subject.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedSubject(subject.id)}
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
                          <span className="font-medium">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {subject.completedLessons}/{subject.totalLessons} lessons
                          </span>
                          <div className="flex items-center gap-1 text-secondary">
                            <Zap className="h-3 w-3" />
                            <span className="font-medium">+{subject.nextReward}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Featured Lessons */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Featured Lessons</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredLessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{lesson.title}</h3>
                          {lesson.completed && <Badge className="bg-accent text-accent-foreground">✓</Badge>}
                          {lesson.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{lesson.duration}</span>
                          </div>
                          <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-secondary">
                            <Zap className="h-4 w-4" />
                            <span className="font-medium">{lesson.reward}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {lesson.locked ? (
                          <Button variant="outline" size="sm" disabled>
                            <Lock className="h-4 w-4" />
                          </Button>
                        ) : lesson.completed ? (
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        ) : (
                          <Link href={`/learn/lesson/${lesson.id}`}>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-secondary" />
                Achievement Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <ProgressRing progress={(achievement.progress / achievement.total) * 100} size={60}>
                      <div className="text-center">
                        <div className="text-sm font-bold">{achievement.progress}</div>
                        <div className="text-xs text-muted-foreground">/{achievement.total}</div>
                      </div>
                    </ProgressRing>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <Progress value={(achievement.progress / achievement.total) * 100} className="mt-2 h-2" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
