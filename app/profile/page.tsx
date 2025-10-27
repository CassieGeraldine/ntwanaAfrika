"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useUserData } from "@/hooks/use-user-data";
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
  Save,
  X,
} from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    school: "",
    grade: "",
    country: "",
    language: "",
  });

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        school: userProfile.school || "",
        grade: userProfile.grade || "",
        country: userProfile.country || "",
        language: userProfile.language || "",
      });
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        displayName: `${editForm.firstName} ${editForm.lastName}`.trim(),
        school: editForm.school,
        grade: editForm.grade,
        country: editForm.country,
        language: editForm.language,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      firstName: userProfile.firstName || "",
      lastName: userProfile.lastName || "",
      school: userProfile.school || "",
      grade: userProfile.grade || "",
      country: userProfile.country || "",
      language: userProfile.language || "",
    });
    setIsEditing(false);
  };

  // Map badge IDs to display format
  const badgeDetails: {
    [key: string]: {
      name: string;
      icon: string;
      description: string;
      rarity: string;
    };
  } = {
    "10_lessons": {
      name: "Getting Started",
      icon: "🌟",
      description: "Complete 10 lessons",
      rarity: "bronze",
    },
    "50_lessons": {
      name: "Dedicated Learner",
      icon: "📚",
      description: "Complete 50 lessons",
      rarity: "silver",
    },
    "100_lessons": {
      name: "Century Scholar",
      icon: "🏆",
      description: "Complete 100 lessons",
      rarity: "gold",
    },
    level_5: {
      name: "Level 5 Achiever",
      icon: "⭐",
      description: "Reach level 5",
      rarity: "silver",
    },
    level_10: {
      name: "Level 10 Master",
      icon: "💫",
      description: "Reach level 10",
      rarity: "gold",
    },
    mathematics_master: {
      name: "Math Master",
      icon: "🧮",
      description: "Complete all math lessons",
      rarity: "gold",
    },
    reading_master: {
      name: "Reading Star",
      icon: "📚",
      description: "Complete all reading lessons",
      rarity: "gold",
    },
    science_master: {
      name: "Science Explorer",
      icon: "�",
      description: "Complete all science lessons",
      rarity: "gold",
    },
    lifeskills_master: {
      name: "Life Skills Pro",
      icon: "🌱",
      description: "Complete all life skills lessons",
      rarity: "gold",
    },
    "7_day_streak": {
      name: "Week Warrior",
      icon: "�",
      description: "Maintain 7-day streak",
      rarity: "bronze",
    },
    "30_day_streak": {
      name: "Month Master",
      icon: "⚡",
      description: "Maintain 30-day streak",
      rarity: "gold",
    },
  };

  // Get all possible badges (earned + not earned)
  const allBadgeIds = Object.keys(badgeDetails);
  const earnedBadges = userProfile.badges || [];

  const badges = allBadgeIds.map((badgeId) => ({
    ...badgeDetails[badgeId],
    earned: earnedBadges.includes(badgeId),
  }));

  // Recent activity from rewards redeemed
  const recentActivity = [
    ...(userProfile.rewardsRedeemed || [])
      .slice(-5)
      .reverse()
      .map((reward) => ({
        action: "Redeemed",
        item: reward.name,
        time: new Date(reward.redeemedAt).toLocaleDateString(),
        coins: -reward.coins,
      })),
    // Add completed lessons
    ...(userProfile.completedLessons || [])
      .slice(-3)
      .map((lessonId, index) => ({
        action: "Completed",
        item: lessonId.replace(/_/g, " "),
        time: `${index + 1} days ago`,
        coins: 50,
      })),
  ].slice(0, 5);

  // Calculate achievements
  const achievements = [
    {
      title: `Scholar Level ${userProfile.level}`,
      description: "Reached advanced learning level",
      icon: Crown,
      color: "text-secondary",
      progress: Math.min((userProfile.level / 15) * 100, 100),
    },
    {
      title: "Coin Collector",
      description: `Earned ${userProfile.skillCoins} Skill Coins`,
      icon: Zap,
      color: "text-secondary",
      progress: Math.min((userProfile.skillCoins / 3000) * 100, 100),
    },
    {
      title: "Streak Master",
      description: "30-day learning streak",
      icon: Target,
      color: "text-destructive",
      progress: Math.min((userProfile.streak / 30) * 100, 100),
    },
    {
      title: "Lesson Completer",
      description: `Completed ${userProfile.totalLessonsCompleted} lessons`,
      icon: Trophy,
      color: "text-accent",
      progress: Math.min((userProfile.totalLessonsCompleted / 100) * 100, 100),
    },
  ];

  // Get user initials
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

  // Format join date
  const joinDate = userProfile.joinDate
    ? new Date(userProfile.joinDate).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  // Convert subject progress to array
  const subjectProgress = Object.values(userProfile.subjectProgress || {});

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
                    <AvatarImage src={userProfile.photoURL} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {getInitials()}
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
                    <h1 className="text-2xl font-bold">
                      {userProfile.displayName ||
                        `${userProfile.firstName} ${userProfile.lastName}`.trim() ||
                        "User"}
                    </h1>
                    <Badge className="bg-secondary text-secondary-foreground">
                      Level {userProfile.level}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.school || "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{userProfile.grade || "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>Rank #{userProfile.rank || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("settings")}
                  >
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
                <div className="text-2xl font-bold">
                  {userProfile.skillCoins}
                </div>
                <div className="text-xs text-muted-foreground">Skill Coins</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {userProfile.totalLessonsCompleted}
                </div>
                <div className="text-xs text-muted-foreground">Lessons</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold">{userProfile.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">{earnedBadges.length}</div>
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
                          {Math.round(userProfile.xp / 60)} hrs
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Estimated Study Time
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {subjectProgress.length > 0
                            ? Math.round(
                                subjectProgress.reduce(
                                  (acc, s) => acc + s.progress,
                                  0
                                ) / subjectProgress.length
                              )
                            : 0}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Average Progress
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {subjectProgress.slice(0, 3).map((subject, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{subject.name}</span>
                            <span>{subject.progress}%</span>
                          </div>
                          <Progress value={subject.progress} className="h-2" />
                        </div>
                      ))}
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Account Settings
                    </CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">First Name</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.firstName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              firstName: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-muted rounded text-sm">
                          {userProfile.firstName || "Not set"}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Name</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.lastName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              lastName: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-muted rounded text-sm">
                          {userProfile.lastName || "Not set"}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        {userProfile.email || "Not set"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">School</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.school}
                          onChange={(e) =>
                            setEditForm({ ...editForm, school: e.target.value })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-muted rounded text-sm">
                          {userProfile.school || "Not set"}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Grade</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.grade}
                          onChange={(e) =>
                            setEditForm({ ...editForm, grade: e.target.value })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-muted rounded text-sm">
                          {userProfile.grade || "Not set"}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Language</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.language}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              language: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-muted rounded text-sm">
                          {userProfile.language || "Not set"}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Country</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.country}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              country: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-muted rounded text-sm">
                          {userProfile.country || "Not set"}
                        </div>
                      )}
                    </div>
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
                    <Button variant="destructive" onClick={handleLogout}>
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
