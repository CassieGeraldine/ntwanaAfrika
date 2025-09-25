"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  Rocket,
  Palette,
  Music,
  Code,
  Stethoscope,
  Briefcase,
  Globe,
  Search,
  Star,
  Clock,
  Users,
  MapPin,
  Calendar,
} from "lucide-react"

const careerPaths = [
  {
    id: "doctor",
    title: "Medical Doctor",
    icon: Stethoscope,
    description: "Help people stay healthy and treat illnesses",
    subjects: ["Science", "Biology", "Chemistry"],
    skills: ["Problem-solving", "Communication", "Empathy"],
    education: "Medical School (8+ years)",
    salary: "R800,000 - R2,000,000",
    growth: "High demand",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    id: "engineer",
    title: "Software Engineer",
    icon: Code,
    description: "Build apps, websites, and digital solutions",
    subjects: ["Mathematics", "Computer Science", "Logic"],
    skills: ["Programming", "Problem-solving", "Creativity"],
    education: "Computer Science Degree (4 years)",
    salary: "R400,000 - R1,200,000",
    growth: "Very high demand",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "teacher",
    title: "Teacher",
    icon: Users,
    description: "Educate and inspire the next generation",
    subjects: ["Education", "Your specialty subject"],
    skills: ["Communication", "Patience", "Leadership"],
    education: "Teaching Degree (4 years)",
    salary: "R200,000 - R500,000",
    growth: "Stable demand",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "artist",
    title: "Digital Artist",
    icon: Palette,
    description: "Create visual art for games, movies, and media",
    subjects: ["Art", "Design", "Computer Graphics"],
    skills: ["Creativity", "Technical skills", "Visual thinking"],
    education: "Art/Design Degree (3-4 years)",
    salary: "R250,000 - R800,000",
    growth: "Growing demand",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: "musician",
    title: "Music Producer",
    icon: Music,
    description: "Create and produce music for artists and media",
    subjects: ["Music", "Audio Technology", "Business"],
    skills: ["Musical talent", "Technical skills", "Collaboration"],
    education: "Music Production Course (2-4 years)",
    salary: "R150,000 - R1,000,000",
    growth: "Moderate demand",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    icon: Briefcase,
    description: "Start your own business and create solutions",
    subjects: ["Business", "Economics", "Innovation"],
    skills: ["Leadership", "Risk-taking", "Networking"],
    education: "Business Degree (3-4 years) or Experience",
    salary: "Variable - R0 to R10,000,000+",
    growth: "Self-created opportunities",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

const explorationTopics = [
  {
    title: "Space Exploration",
    description: "Discover the mysteries of the universe",
    icon: "🚀",
    difficulty: "Advanced",
    duration: "45 min",
    participants: 234,
  },
  {
    title: "Ocean Life",
    description: "Explore the depths of our oceans",
    icon: "🌊",
    difficulty: "Intermediate",
    duration: "30 min",
    participants: 189,
  },
  {
    title: "Ancient Civilizations",
    description: "Journey through history and culture",
    icon: "🏛️",
    difficulty: "Beginner",
    duration: "25 min",
    participants: 156,
  },
  {
    title: "Renewable Energy",
    description: "Learn about sustainable power sources",
    icon: "⚡",
    difficulty: "Intermediate",
    duration: "35 min",
    participants: 203,
  },
]

const communityEvents = [
  {
    title: "Career Fair 2024",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Ubuntu Community Center",
    description: "Meet professionals from various fields",
    attendees: 45,
    type: "In-person",
  },
  {
    title: "Coding Workshop",
    date: "March 20, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Online",
    description: "Learn basic programming with Python",
    attendees: 78,
    type: "Virtual",
  },
  {
    title: "Science Fair",
    date: "March 25, 2024",
    time: "9:00 AM - 3:00 PM",
    location: "Mandela High School",
    description: "Showcase your science projects",
    attendees: 32,
    type: "In-person",
  },
]

export default function Dreamland() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [interests, setInterests] = useState<string[]>(["Science", "Technology"])

  const filteredCareers = careerPaths.filter(
    (career) =>
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.subjects.some((subject) => subject.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const addInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest])
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="md:ml-64 pt-20 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dreamland</h1>
                <p className="text-muted-foreground">Explore careers and discover your future</p>
              </div>
            </div>
          </div>

          {/* Interests */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary" />
                Your Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => removeInterest(interest)}
                  >
                    {interest} ×
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["Art", "Music", "Sports", "Business", "Medicine", "Engineering"].map((interest) => (
                  <Button
                    key={interest}
                    variant="outline"
                    size="sm"
                    onClick={() => addInterest(interest)}
                    disabled={interests.includes(interest)}
                  >
                    + {interest}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Search */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search careers, skills, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Career Paths */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Career Paths</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCareers.map((career) => {
                const Icon = career.icon
                return (
                  <Card
                    key={career.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${career.bgColor} ${
                      selectedCareer === career.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedCareer(selectedCareer === career.id ? null : career.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${career.bgColor}`}>
                          <Icon className={`h-6 w-6 ${career.color}`} />
                        </div>
                        <CardTitle className="text-lg">{career.title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{career.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium mb-1">Key Subjects:</p>
                          <div className="flex flex-wrap gap-1">
                            {career.subjects.map((subject) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedCareer === career.id && (
                          <div className="space-y-3 pt-3 border-t">
                            <div>
                              <p className="text-xs font-medium mb-1">Skills Needed:</p>
                              <div className="flex flex-wrap gap-1">
                                {career.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="font-medium">Education:</p>
                                <p className="text-muted-foreground">{career.education}</p>
                              </div>
                              <div>
                                <p className="font-medium">Salary Range:</p>
                                <p className="text-muted-foreground">{career.salary}</p>
                              </div>
                            </div>
                            <div className="text-xs">
                              <p className="font-medium">Job Market:</p>
                              <p className="text-muted-foreground">{career.growth}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Exploration Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  Explore New Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {explorationTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <span className="text-3xl">{topic.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{topic.title}</h4>
                      <p className="text-xs text-muted-foreground">{topic.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{topic.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{topic.participants}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communityEvents.map((event, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant={event.type === "Virtual" ? "secondary" : "default"} className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{event.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {event.date} at {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6">
                <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Ready to Explore Your Future?</h3>
                <p className="text-muted-foreground mb-4">
                  Take our career assessment quiz to discover paths that match your interests and strengths.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Career Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
