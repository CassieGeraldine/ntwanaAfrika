"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, Target, Flame, Crown, Medal, Award, Calendar, MapPin, Star, Zap } from "lucide-react"

const currentUser = {
  name: "Amara Okafor",
  rank: 23,
  school: "Ubuntu Primary School",
  region: "Johannesburg, South Africa",
  coins: 2450,
  streak: 7,
  level: 12,
}

const leaderboardData = {
  school: [
    {
      rank: 1,
      name: "Thabo Mthembu",
      coins: 3850,
      level: 15,
      streak: 12,
      avatar: "/student-avatar-1.png",
      badge: "Math Genius",
    },
    {
      rank: 2,
      name: "Nomsa Dlamini",
      coins: 3420,
      level: 14,
      streak: 9,
      avatar: "/student-avatar-2.png",
      badge: "Reading Star",
    },
    {
      rank: 3,
      name: "Sipho Ndaba",
      coins: 3180,
      level: 13,
      streak: 15,
      avatar: "/student-avatar-3.png",
      badge: "Science Explorer",
    },
    {
      rank: 4,
      name: "Lerato Molefe",
      coins: 2980,
      level: 13,
      streak: 6,
      avatar: "/student-avatar-4.png",
      badge: "Quick Learner",
    },
    {
      rank: 5,
      name: "Mandla Khumalo",
      coins: 2750,
      level: 12,
      streak: 8,
      avatar: "/student-avatar-5.png",
      badge: "Consistent",
    },
  ],
  region: [
    {
      rank: 1,
      name: "Ubuntu Primary School",
      coins: 45680,
      students: 156,
      avgLevel: 11.2,
      location: "Johannesburg",
    },
    {
      rank: 2,
      name: "Mandela High School",
      coins: 42340,
      students: 203,
      avgLevel: 10.8,
      location: "Soweto",
    },
    {
      rank: 3,
      name: "Rainbow Elementary",
      coins: 38920,
      students: 134,
      avgLevel: 12.1,
      location: "Sandton",
    },
    {
      rank: 4,
      name: "Future Leaders Academy",
      coins: 35670,
      students: 178,
      avgLevel: 9.9,
      location: "Alexandra",
    },
    {
      rank: 5,
      name: "Hope Primary School",
      coins: 33450,
      students: 145,
      avgLevel: 10.5,
      location: "Midrand",
    },
  ],
}

const groupChallenges = [
  {
    id: 1,
    title: "Math Marathon",
    description: "Complete 50 math lessons as a school",
    progress: 32,
    total: 50,
    timeLeft: "5 days",
    reward: "500 bonus coins per student",
    participants: 45,
    status: "active",
  },
  {
    id: 2,
    title: "Reading Champions",
    description: "Read 100 stories across all grades",
    progress: 78,
    total: 100,
    timeLeft: "2 days",
    reward: "Special reading badges",
    participants: 67,
    status: "active",
  },
  {
    id: 3,
    title: "Science Week",
    description: "Complete science experiments together",
    progress: 100,
    total: 100,
    timeLeft: "Completed",
    reward: "Science Explorer badges",
    participants: 89,
    status: "completed",
  },
]

const achievements = [
  {
    title: "Top Performer",
    description: "Ranked in top 10 of your school",
    icon: Crown,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    achieved: false,
    progress: 70,
  },
  {
    title: "Team Player",
    description: "Participated in 5 group challenges",
    icon: Users,
    color: "text-accent",
    bgColor: "bg-accent/10",
    achieved: true,
    progress: 100,
  },
  {
    title: "Streak Master",
    description: "Maintain 30-day learning streak",
    icon: Flame,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    achieved: false,
    progress: 23,
  },
]

export default function Community() {
  const [activeTab, setActiveTab] = useState("school")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-secondary" />
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />
      case 3:
        return <Award className="h-5 w-5 text-destructive/70" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Community</h1>
            <p className="text-muted-foreground">Connect with fellow learners and compete together!</p>
          </div>

          {/* User Stats */}
          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/student-avatar.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{currentUser.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{currentUser.school}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>Rank #{currentUser.rank}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-secondary">{currentUser.coins}</div>
                    <div className="text-xs text-muted-foreground">Coins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-destructive">{currentUser.streak}</div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{currentUser.level}</div>
                    <div className="text-xs text-muted-foreground">Level</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Leaderboards */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-secondary" />
                    Leaderboards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="school">My School</TabsTrigger>
                      <TabsTrigger value="region">Regional Schools</TabsTrigger>
                    </TabsList>

                    <TabsContent value="school" className="space-y-3 mt-4">
                      {leaderboardData.school.map((student, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-4 p-3 rounded-lg border ${
                            student.name === currentUser.name ? "bg-primary/5 border-primary/20" : ""
                          }`}
                        >
                          <div className="flex items-center justify-center w-8">{getRankIcon(student.rank)}</div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-muted">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{student.name}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>Level {student.level}</span>
                              <div className="flex items-center gap-1">
                                <Flame className="h-3 w-3 text-destructive" />
                                <span>{student.streak} days</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-secondary">
                              <Zap className="h-4 w-4" />
                              <span className="font-bold">{student.coins}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {student.badge}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="region" className="space-y-3 mt-4">
                      {leaderboardData.region.map((school, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-4 p-3 rounded-lg border ${
                            school.name === currentUser.school ? "bg-primary/5 border-primary/20" : ""
                          }`}
                        >
                          <div className="flex items-center justify-center w-8">{getRankIcon(school.rank)}</div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{school.name}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{school.students} students</span>
                              <span>Avg Level {school.avgLevel}</span>
                              <span>{school.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-secondary">
                              <Zap className="h-4 w-4" />
                              <span className="font-bold">{school.coins.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-secondary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
                            <Icon className={`h-4 w-4 ${achievement.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{achievement.title}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </div>
                          {achievement.achieved && <Badge className="bg-accent">✓</Badge>}
                        </div>
                        {!achievement.achieved && <Progress value={achievement.progress} className="h-2" />}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Group Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Group Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupChallenges.map((challenge) => (
                    <div key={challenge.id} className="space-y-3 p-3 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{challenge.title}</h4>
                          <p className="text-xs text-muted-foreground">{challenge.description}</p>
                        </div>
                        <Badge variant={challenge.status === "active" ? "default" : "secondary"} className="text-xs">
                          {challenge.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span>
                            {challenge.progress}/{challenge.total}
                          </span>
                        </div>
                        <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{challenge.participants} participants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{challenge.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-accent font-medium">Reward: {challenge.reward}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
