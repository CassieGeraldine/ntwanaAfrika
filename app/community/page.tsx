"use client"

import { useEffect, useState } from "react"
import { useUserData } from "@/hooks/use-user-data"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, Target, Flame, Crown, Medal, Award, Calendar, MapPin, Star, Zap } from "lucide-react"

export default function Community() {
  const [activeTab, setActiveTab] = useState("school")
  const { userProfile } = useUserData()

  const currentUser = {
    name: userProfile?.displayName || "Learner",
    rank: userProfile?.rank || 0,
    school: userProfile?.school || "-",
    region: userProfile?.region || "-",
    coins: userProfile?.skillCoins || 0,
    streak: userProfile?.streak || 0,
    level: userProfile?.level || 1,
  }

  // Fetch user-specific leaderboard, achievements, and group challenges from userProfile
  const leaderboardSchool = userProfile?.leaderboardSchool || []
  const leaderboardRegion = userProfile?.leaderboardRegion || []
  const achievements = userProfile?.achievements || []
  const groupChallenges = userProfile?.groupChallenges || []

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
                      {leaderboardSchool.map((student, index) => (
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
                      {leaderboardRegion.map((school, index) => (
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
