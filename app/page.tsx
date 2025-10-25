"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { GuestModeBanner } from "@/components/guest-mode-banner";
import { Navigation } from "@/components/navigation";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Trophy,
  Target,
  Coins,
  Star,
  ChevronRight,
  Flame,
  Calendar,
  Gift,
  TrendingUp,
  Award,
} from "lucide-react";

function Dashboard() {
  const { userProfile, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Use Firebase user data or fallback to defaults
  const userLevel = userProfile?.level || 1;
  const skillCoins = userProfile?.skillCoins || 0;
  const currentStreak = userProfile?.streak || 0;
  const levelProgress = Math.min((skillCoins % 1000) / 10, 100); // Calculate progress based on coins

  useEffect(() => {
    // Check if onboarding is complete for authenticated users
    if (currentUser) {
      const onboardingComplete = localStorage.getItem("onboardingComplete");
      if (!onboardingComplete && (!userProfile?.country || !userProfile?.language)) {
        router.push("/onboarding");
        return;
      }
    }
    setIsLoading(false);
  }, [router, currentUser, userProfile]);

  const dailyQuests = [
    {
      id: 1,
      title: "Complete 2 Math lessons",
      progress: 1,
      total: 2,
      reward: 50,
      completed: false,
    },
    {
      id: 2,
      title: "Practice reading for 15 minutes",
      progress: 15,
      total: 15,
      reward: 30,
      completed: true,
    },
    {
      id: 3,
      title: "Answer 10 science questions",
      progress: 7,
      total: 10,
      reward: 40,
      completed: false,
    },
  ];

  const recentBadges = [
    { name: "Math Master", icon: "🧮", earned: "Today", rarity: "gold" },
    { name: "Reading Star", icon: "📚", earned: "Yesterday", rarity: "silver" },
    {
      name: "Science Explorer",
      icon: "🔬",
      earned: "2 days ago",
      rarity: "bronze",
    },
  ];

  const subjects = [
    {
      name: "Mathematics",
      icon: "🧮",
      progress: 85,
      lessons: 24,
      color: "text-chart-1",
    },
    {
      name: "Reading",
      icon: "📚",
      progress: 92,
      lessons: 18,
      color: "text-chart-2",
    },
    {
      name: "Science",
      icon: "🔬",
      progress: 67,
      lessons: 15,
      color: "text-chart-3",
    },
    {
      name: "Life Skills",
      icon: "🌱",
      progress: 45,
      lessons: 12,
      color: "text-chart-4",
    },
  ];

  const weeklyStats = [
    { day: "Mon", lessons: 3, coins: 150 },
    { day: "Tue", lessons: 2, coins: 100 },
    { day: "Wed", lessons: 4, coins: 200 },
    { day: "Thu", lessons: 1, coins: 50 },
    { day: "Fri", lessons: 3, coins: 150 },
    { day: "Sat", lessons: 2, coins: 100 },
    { day: "Sun", lessons: 0, coins: 0 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Guest Mode Banner */}
          <GuestModeBanner />
          
          {/* Welcome Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-balance">
                  Welcome{currentUser?.isAnonymous ? '' : ' back'}, {userProfile?.displayName || 'Learner'}! 👋
                </h1>
                <p className="text-muted-foreground">
                  {currentUser?.isAnonymous 
                    ? 'Start your learning journey in guest mode!' 
                    : 'Ready to continue your learning journey?'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2 bg-destructive/10 px-3 py-2 rounded-lg">
                <Flame className="h-5 w-5 text-destructive animate-pulse-glow" />
                <span className="font-bold text-lg">{currentStreak}</span>
                <span className="text-sm text-muted-foreground">
                  day streak
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress Ring */}
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <ProgressRing
                    progress={levelProgress}
                    size={100}
                    className="text-primary"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userLevel}</div>
                      <div className="text-xs text-muted-foreground">Level</div>
                    </div>
                  </ProgressRing>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      Level {userLevel} Scholar
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {100 - levelProgress} XP needed to reach Level{" "}
                      {userLevel + 1}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <span>+{levelProgress} XP this week</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-secondary" />
                        <span>Next: Advanced Scholar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">Skill Coins</span>
                </div>
                <div className="text-2xl font-bold">
                  {skillCoins.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs text-accent">
                  <TrendingUp className="h-3 w-3" />
                  <span>+250 today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">Lessons</span>
                </div>
                <div className="text-2xl font-bold">69</div>
                <span className="text-xs text-muted-foreground">
                  completed this month
                </span>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">Badges</span>
                </div>
                <div className="text-2xl font-bold">12</div>
                <span className="text-xs text-muted-foreground">earned</span>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-destructive" />
                  <span className="text-sm font-medium">Rank</span>
                </div>
                <div className="text-2xl font-bold">#23</div>
                <span className="text-xs text-muted-foreground">
                  in your school
                </span>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Daily Quests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Daily Quests
                  <Badge variant="secondary" className="ml-auto">
                    <Calendar className="h-3 w-3 mr-1" />
                    Today
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{quest.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress
                          value={(quest.progress / quest.total) * 100}
                          className="flex-1 h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {quest.progress}/{quest.total}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                      <Coins className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {quest.reward}
                      </span>
                    </div>
                    {quest.completed && (
                      <Badge
                        variant="default"
                        className="bg-accent animate-bounce-in"
                      >
                        ✓
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subject Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="text-2xl">{subject.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {subject.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {subject.lessons} lessons
                        </span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                      <span className="text-xs text-muted-foreground">
                        {subject.progress}% complete
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Badges */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-secondary" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recentBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 text-center p-4 rounded-lg border bg-gradient-to-b from-muted/30 to-muted/50 min-w-[120px] hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl mb-2 animate-bounce-in">
                      {badge.icon}
                    </div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {badge.earned}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-2 text-xs ${
                        badge.rarity === "gold"
                          ? "border-secondary text-secondary"
                          : badge.rarity === "silver"
                          ? "border-muted-foreground text-muted-foreground"
                          : "border-destructive/50 text-destructive/70"
                      }`}
                    >
                      {badge.rarity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-primary hover:bg-primary/90" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Continue Learning
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              size="lg"
            >
              <Gift className="h-5 w-5 mr-2" />
              View Rewards
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  return <Dashboard />;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
