"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Trophy,
  Star,
  Settings,
  LogOut,
  Edit,
  Camera,
  MapPin,
  Calendar,
  BookOpen,
  Zap,
  Target,
  Award,
  Crown,
} from "lucide-react";

const userProfile = {
  name: "Amara Okafor",
  email: "amara.okafor@student.edu",
  school: "Ubuntu Primary School",
  grade: "Grade 7",
  location: "Johannesburg, South Africa",
  joinDate: "September 2023",
  language: "English",
  country: "South Africa",
};

const userStats = {
  level: 12,
  totalCoins: 2450,
  lessonsCompleted: 69,
  streak: 7,
  badges: 12,
  rank: 23,
  totalStudyTime: "45 hours",
  averageScore: 94,
};

const badges = [
  {
    name: "Math Master",
    icon: "🧮",
    description: "Complete 20 math lessons",
    earned: true,
    rarity: "gold",
  },
  {
    name: "Reading Star",
    icon: "📚",
    description: "Read 15 stories",
    earned: true,
    rarity: "silver",
  },
  {
    name: "Science Explorer",
    icon: "🔬",
    description: "Complete 10 science experiments",
    earned: true,
    rarity: "bronze",
  },
  {
    name: "Quick Learner",
    icon: "⚡",
    description: "Complete 3 lessons in one day",
    earned: true,
    rarity: "silver",
  },
  {
    name: "Consistent",
    icon: "📅",
    description: "Maintain 7-day streak",
    earned: true,
    rarity: "bronze",
  },
  {
    name: "Helper",
    icon: "🤝",
    description: "Help 5 classmates",
    earned: true,
    rarity: "silver",
  },
  {
    name: "Perfect Score",
    icon: "💯",
    description: "Score 100% on 5 quizzes",
    earned: false,
    rarity: "gold",
  },
  {
    name: "Marathon",
    icon: "🏃",
    description: "Study for 2 hours straight",
    earned: false,
    rarity: "silver",
  },
  {
    name: "Social Butterfly",
    icon: "🦋",
    description: "Join 10 group challenges",
    earned: false,
    rarity: "bronze",
  },
];

const achievements = [
  {
    title: "Scholar Level 12",
    description: "Reached advanced learning level",
    icon: Crown,
    color: "text-secondary",
    progress: 100,
  },
  {
    title: "Coin Collector",
    description: "Earned 2,500 Skill Coins",
    icon: Zap,
    color: "text-secondary",
    progress: 98,
  },
  {
    title: "Streak Master",
    description: "30-day learning streak",
    icon: Target,
    color: "text-destructive",
    progress: 23,
  },
  {
    title: "Top Performer",
    description: "Rank in top 20 of school",
    icon: Trophy,
    color: "text-accent",
    progress: 85,
  },
];

const recentActivity = [
  {
    action: "Completed",
    item: "Fractions lesson",
    time: "2 hours ago",
    coins: 50,
  },
  {
    action: "Earned",
    item: "Math Master badge",
    time: "1 day ago",
    coins: 100,
  },
  { action: "Joined", item: "Reading Challenge", time: "2 days ago", coins: 0 },
  {
    action: "Redeemed",
    item: "Bread voucher",
    time: "3 days ago",
    coins: -150,
  },
  { action: "Completed", item: "Science quiz", time: "4 days ago", coins: 75 },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case "gold":
        return "border-secondary text-secondary";
      case "silver":
        return "border-muted-foreground text-muted-foreground";
      case "bronze":
        return "border-destructive/50 text-destructive/70";
      default:
        return "border-border text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/student-avatar.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 rounded-full p-2"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                    <Badge className="bg-secondary text-secondary-foreground">
                      Level {userStats.level}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.school}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{userProfile.grade}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {userProfile.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>Rank #{userStats.rank}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.totalCoins}</div>
                <div className="text-xs text-muted-foreground">Skill Coins</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {userStats.lessonsCompleted}
                </div>
                <div className="text-xs text-muted-foreground">Lessons</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.badges}</div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">
                              {activity.action}
                            </span>{" "}
                            {activity.item}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                        {activity.coins !== 0 && (
                          <div
                            className={`flex items-center gap-1 text-sm ${
                              activity.coins > 0
                                ? "text-accent"
                                : "text-destructive"
                            }`}
                          >
                            <Zap className="h-3 w-3" />
                            <span>
                              {activity.coins > 0 ? "+" : ""}
                              {activity.coins}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Learning Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-accent" />
                      Learning Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {userStats.totalStudyTime}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total Study Time
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {userStats.averageScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Average Score
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Mathematics</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Reading</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Science</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-secondary" />
                    Badge Collection
                    <Badge variant="secondary" className="ml-auto">
                      {badges.filter((b) => b.earned).length}/{badges.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          badge.earned
                            ? "bg-muted/30 hover:shadow-md"
                            : "bg-muted/10 opacity-60"
                        }`}
                      >
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <h4 className="font-medium text-sm mb-1">
                          {badge.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {badge.description}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getBadgeRarityColor(
                            badge.rarity
                          )}`}
                        >
                          {badge.rarity}
                        </Badge>
                        {badge.earned && (
                          <div className="mt-2">
                            <Badge className="bg-accent text-accent-foreground text-xs">
                              Earned
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-secondary" />
                    Achievement Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={index}
                        className="p-4 rounded-lg border bg-muted/30"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`p-2 rounded-lg bg-muted`}>
                            <Icon className={`h-6 w-6 ${achievement.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {achievement.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {achievement.progress}%
                            </div>
                            {achievement.progress === 100 && (
                              <Badge className="bg-accent text-accent-foreground">
                                Complete
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Progress
                          value={achievement.progress}
                          className="h-2"
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {userProfile.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {userProfile.email}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">School</label>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {userProfile.school}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Grade</label>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {userProfile.grade}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {userProfile.language}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Country</label>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {userProfile.country}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Sign Out</h4>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account
                      </p>
                    </div>
                    <Button variant="destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
