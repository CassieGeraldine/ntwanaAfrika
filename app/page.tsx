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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useUserData } from "@/hooks/use-user-data";

function Dashboard() {
  const { userProfile } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      setIsLoading(false);
      // Streak is now auto-updated in auth-context once per day
    }
  }, [userProfile]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Dynamic stats from userProfile - all from database
  const userLevel = userProfile.level;
  const skillCoins = userProfile.skillCoins;
  const currentStreak = userProfile.streak;
  const totalLessonsCompleted = userProfile.totalLessonsCompleted;
  const userBadges = userProfile.badges || [];
  const rank = userProfile.rank || 23; // In future, calculate from leaderboard
  const dailyQuests = userProfile.dailyQuests || [];

  // Convert subject progress object to array for display
  const subjectProgress = Object.values(userProfile.subjectProgress || {});

  const levelProgress = Math.min((userProfile.xp % 1000) / 10, 100);
  const xpToNextLevel = 1000 - (userProfile.xp % 1000);

  // Map badge names to display format
  const badgeDetails: {
    [key: string]: { name: string; icon: string; rarity: string };
  } = {
    "10_lessons": { name: "Getting Started", icon: "🌟", rarity: "bronze" },
    "50_lessons": { name: "Dedicated Learner", icon: "📚", rarity: "silver" },
    "100_lessons": { name: "Century Scholar", icon: "🏆", rarity: "gold" },
    level_5: { name: "Level 5 Achiever", icon: "⭐", rarity: "silver" },
    level_10: { name: "Level 10 Master", icon: "💫", rarity: "gold" },
    mathematics_master: { name: "Math Master", icon: "🧮", rarity: "gold" },
    reading_master: { name: "Reading Star", icon: "📚", rarity: "gold" },
    science_master: { name: "Science Explorer", icon: "🔬", rarity: "gold" },
    lifeskills_master: { name: "Life Skills Pro", icon: "🌱", rarity: "gold" },
    "7_day_streak": { name: "Week Warrior", icon: "🔥", rarity: "silver" },
    "30_day_streak": { name: "Monthly Champion", icon: "�", rarity: "gold" },
  };

  // Get recent badges for display (last 3)
  const recentBadges = userBadges
    .slice(-3)
    .map((badgeId) => ({
      ...badgeDetails[badgeId],
      earned: "Recently",
    }))
    .filter((b) => b.name); // Filter out undefined badges

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    }
    if (userProfile.displayName) {
      return userProfile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

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
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userProfile.photoURL} alt="User avatar" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-balance">
                    Welcome back,{" "}
                    {userProfile.firstName ||
                      userProfile.displayName ||
                      "Learner"}
                    ! 👋
                  </h1>
                  <p className="text-muted-foreground">
                    Ready to continue your learning journey?
                  </p>
                </div>
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
                      {xpToNextLevel} XP needed to reach Level {userLevel + 1}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <span>{userProfile.xp} XP total</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-secondary" />
                        <span>Next: Level {userLevel + 1}</span>
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
                <div className="text-2xl font-bold">
                  {totalLessonsCompleted}
                </div>
                <span className="text-xs text-muted-foreground">
                  completed total
                </span>
              </CardContent>
            </Card>{" "}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">Badges</span>
                </div>
                <div className="text-2xl font-bold">{userBadges.length}</div>
                <span className="text-xs text-muted-foreground">earned</span>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-destructive" />
                  <span className="text-sm font-medium">Rank</span>
                </div>
                <div className="text-2xl font-bold">#{rank}</div>
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
                {dailyQuests.map((quest: any) => (
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
                {subjectProgress.map((subject: any) => (
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
                {recentBadges.map((badge: any, index: number) => (
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
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              size="lg"
              onClick={() => router.push("/learn")}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Continue Learning
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              size="lg"
              onClick={() => router.push("/rewards")}
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
