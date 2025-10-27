"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Heart,
  Smile,
  MessageCircle,
  Phone,
  Mail,
  Shield,
  Trash2,
  Lock,
  Bot,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

const moodOptions = [
  { emoji: "😊", label: "Happy", value: "happy", color: "text-accent" },
  { emoji: "😐", label: "Okay", value: "okay", color: "text-muted-foreground" },
  { emoji: "😔", label: "Sad", value: "sad", color: "text-destructive" },
  { emoji: "😰", label: "Stressed", value: "stressed", color: "text-destructive" },
  { emoji: "😴", label: "Tired", value: "tired", color: "text-muted-foreground" },
]

const supportResources = [
  {
    title: "School Counselor",
    description: "Talk to your school's guidance counselor",
    contact: "counselor@school.edu",
    type: "email",
    icon: Mail,
    available: "Mon-Fri, 8AM-4PM",
  },
  {
    title: "Crisis Helpline",
    description: "24/7 support for urgent situations",
    contact: "0800-567-567",
    type: "phone",
    icon: Phone,
    available: "24/7",
  },
  {
    title: "Teen Support Chat",
    description: "Anonymous chat with trained counselors",
    contact: "teensupport.org/chat",
    type: "chat",
    icon: MessageCircle,
    available: "Daily, 6PM-10PM",
  },
]

const wellnessTips = [
  {
    title: "Take Deep Breaths",
    description: "When feeling overwhelmed, try the 4-7-8 breathing technique",
    icon: "🫁",
  },
  {
    title: "Stay Connected",
    description: "Talk to friends, family, or trusted adults about your feelings",
    icon: "🤝",
  },
  {
    title: "Get Moving",
    description: "Physical activity can help improve your mood and reduce stress",
    icon: "🏃",
  },
  {
    title: "Sleep Well",
    description: "Aim for 8-9 hours of sleep each night for better mental health",
    icon: "😴",
  },
]

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  isSupport?: boolean
}

export default function MentalHealthHub() {
  const { userProfile } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [moodHistory, setMoodHistory] = useState([
    { date: "Today", mood: "okay" },
    { date: "Yesterday", mood: "happy" },
    { date: "2 days ago", mood: "sad" },
    { date: "3 days ago", mood: "stressed" },
    { date: "4 days ago", mood: "happy" },
  ])
  const [showSupportChat, setShowSupportChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hi there! I'm here to listen and support you. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
      isSupport: true,
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [distressLevel, setDistressLevel] = useState(0)

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    }
    if (userProfile?.displayName) {
      return userProfile.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)

    // Check for distress pattern
    const recentSadMoods = moodHistory.filter((m) => m.mood === "sad" || m.mood === "stressed").length
    if ((mood === "sad" || mood === "stressed") && recentSadMoods >= 2) {
      setDistressLevel(recentSadMoods + 1)
      setShowSupportChat(true)
    }

    // Update mood history
    setMoodHistory((prev) => [{ date: "Today", mood }, ...prev.slice(0, 4)])
  }

  const generateSupportResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("sad") || message.includes("down") || message.includes("depressed")) {
      return "I hear that you're feeling sad. It's completely normal to have difficult days. Remember that these feelings are temporary. Would you like to talk about what's making you feel this way?"
    } else if (message.includes("stressed") || message.includes("anxious") || message.includes("worried")) {
      return "Stress and anxiety can be overwhelming. Let's try some breathing exercises together. Take a deep breath in for 4 counts, hold for 7, and exhale for 8. You're not alone in this."
    } else if (message.includes("angry") || message.includes("mad") || message.includes("frustrated")) {
      return "It sounds like you're feeling frustrated. Anger is a valid emotion. Let's find healthy ways to express these feelings. Would you like some suggestions for managing anger?"
    } else if (message.includes("help") || message.includes("support")) {
      return "I'm glad you're reaching out for help. That takes courage. I'm here to listen and support you. If you need immediate help, please consider contacting a counselor or trusted adult."
    } else {
      return "Thank you for sharing with me. Your feelings are valid and important. I'm here to listen without judgment. How can I best support you right now?"
    }
  }

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: "user",
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateSupportResponse(chatInput),
        sender: "ai",
        timestamp: new Date(),
        isSupport: true,
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  const clearChatHistory = () => {
    setChatMessages([
      {
        id: "1",
        content: "Hi there! I'm here to listen and support you. How are you feeling today?",
        sender: "ai",
        timestamp: new Date(),
        isSupport: true,
      },
    ])
  }

  const getMoodEmoji = (mood: string) => {
    return moodOptions.find((m) => m.value === mood)?.emoji || "😐"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Mental Health Hub</h1>
                <p className="text-muted-foreground">Your wellbeing matters to us</p>
              </div>
            </div>
          </div>

          {/* Wellness Check */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                Daily Wellness Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                <div className="flex flex-wrap gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        selectedMood === mood.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-3xl">{mood.emoji}</span>
                      <span className="text-sm font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm text-accent-foreground">
                      Thank you for sharing how you're feeling. Remember, it's okay to have different emotions.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mood History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smile className="h-5 w-5 text-secondary" />
                  Mood Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moodHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">{entry.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                        <span className="text-sm capitalize">{entry.mood}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wellness Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Wellness Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wellnessTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <span className="text-2xl">{tip.icon}</span>
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Resources */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Support Resources
                <Badge variant="secondary" className="ml-auto">
                  Confidential
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {supportResources.map((resource, index) => {
                  const Icon = resource.icon
                  return (
                    <div key={index} className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-sm">{resource.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="font-medium">Contact: </span>
                          <span className="text-primary">{resource.contact}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Available: </span>
                          <span>{resource.available}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Support Chat Button */}
          <div className="mt-6 text-center">
            <Button onClick={() => setShowSupportChat(true)} size="lg" className="bg-accent hover:bg-accent/90">
              <MessageCircle className="h-5 w-5 mr-2" />
              Talk to AI Support
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Safe, private, and available 24/7</p>
          </div>
        </div>
      </div>

      {/* AI Support Chat Dialog */}
      <Dialog open={showSupportChat} onOpenChange={setShowSupportChat}>
        <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              AI Support Chat
              <Badge variant="secondary" className="ml-auto">
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Badge>
            </DialogTitle>
            <DialogDescription>
              This is a safe space to express your feelings. All conversations are private and encrypted.
            </DialogDescription>
          </DialogHeader>

          {distressLevel >= 3 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-destructive-foreground">We're here for you</p>
                  <p className="text-destructive/80">
                    I notice you've been feeling down lately. Please consider reaching out to a counselor or trusted
                    adult.
                  </p>
                </div>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent/10 text-accent-foreground border border-accent/20"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                      <Clock className="h-3 w-3" />
                      <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={userProfile?.photoURL} alt="User avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1 min-h-[60px]"
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendChatMessage())}
              />
              <Button onClick={handleSendChatMessage} disabled={!chatInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setShowPrivacyDialog(true)}>
                  <Shield className="h-3 w-3 mr-1" />
                  Privacy Info
                </Button>
                <Button variant="ghost" size="sm" onClick={clearChatHistory}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear Chat
                </Button>
              </div>
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Privacy & Safety
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Your Privacy Matters</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• All conversations are encrypted and private</li>
                <li>• We don't store personal information</li>
                <li>• You can clear your chat history anytime</li>
                <li>• No one else can see your messages</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">When We May Reach Out</h4>
              <p className="text-muted-foreground">
                If we detect signs of serious distress, we may suggest connecting with a counselor or trusted adult.
                Your safety is our priority.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPrivacyDialog(false)}>I Understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
