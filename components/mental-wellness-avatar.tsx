"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  Heart,
  Loader2,
  CheckCircle,
  Phone,
  Mail,
} from "lucide-react"
interface RecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}
interface Volunteer {
  id: string
  name: string
  role: string
  email: string
  phone?: string
  region: string
  availability: string
}
const VOLUNTEERS: Volunteer[] = [
  {
    id: "v1",
    name: "Dr. Amina Mtshali",
    role: "Clinical Psychologist",
    email: "amina.mtshali@wellness.org",
    phone: "+27-82-555-0101",
    region: "South Africa",
    availability: "Mon-Fri, 9AM-5PM",
  },
  {
    id: "v2",
    name: "Dr. Kofi Mensah",
    role: "Educational Psychologist",
    email: "kofi.mensah@wellness.org",
    phone: "+233-24-555-0202",
    region: "Ghana",
    availability: "Mon-Sat, 10AM-6PM",
  },
  {
    id: "v3",
    name: "Ms. Thandiwe Nyathi",
    role: "Counseling Therapist",
    email: "thandiwe.nyathi@wellness.org",
    phone: "+263-77-555-0303",
    region: "Zimbabwe",
    availability: "Tue-Fri, 2PM-8PM",
  },
  {
    id: "v4",
    name: "Mr. Jabari Okello",
    role: "Youth Counselor",
    email: "jabari.okello@wellness.org",
    phone: "+254-72-555-0404",
    region: "Kenya",
    availability: "Mon-Fri, 8AM-4PM",
  },
]
type AvatarState = "idle" | "listening" | "thinking" | "speaking"
class WellnessDialogueEngine {
  private concernLevel: number = 0
  private conversationHistory: string[] = []
  analyzeConcern(text: string): { level: number; category: string } {
    const lowerText = text.toLowerCase()
    const criticalKeywords = ["suicide", "kill myself", "end it all", "want to die", "hurt myself"]
    if (criticalKeywords.some((kw) => lowerText.includes(kw))) {
      this.concernLevel = 10
      return { level: 10, category: "crisis" }
    }
    const highConcernKeywords = [
      "depressed",
      "hopeless",
      "give up",
      "worthless",
      "hate myself",
    ]
    if (highConcernKeywords.some((kw) => lowerText.includes(kw))) {
      this.concernLevel = Math.min(9, this.concernLevel + 2)
      return { level: this.concernLevel, category: "high-distress" }
    }
    const moderateKeywords = [
      "sad",
      "lonely",
      "anxious",
      "worried",
      "stressed",
      "scared",
      "overwhelmed",
    ]
    if (moderateKeywords.some((kw) => lowerText.includes(kw))) {
      this.concernLevel = Math.min(7, this.concernLevel + 1)
      return { level: this.concernLevel, category: "moderate-distress" }
    }
    const academicKeywords = ["exam", "test", "grades", "failing", "study", "homework"]
    if (academicKeywords.some((kw) => lowerText.includes(kw))) {
      return { level: this.concernLevel, category: "academic-stress" }
    }
    const positiveKeywords = ["better", "good", "happy", "excited", "hopeful"]
    if (positiveKeywords.some((kw) => lowerText.includes(kw))) {
      this.concernLevel = Math.max(0, this.concernLevel - 1)
      return { level: this.concernLevel, category: "positive" }
    }
    return { level: this.concernLevel, category: "neutral" }
  }
  generateResponse(userInput: string): string {
    this.conversationHistory.push(userInput)
    const { category } = this.analyzeConcern(userInput)
    if (category === "crisis") {
      return "I'm very concerned about what you're telling me. Your safety is the most important thing. Please reach out to a crisis helpline immediately at 0800-567-567. You don't have to face this alone."
    }
    if (category === "high-distress") {
      return "I hear that you're going through a really difficult time. Your feelings are valid. Please consider talking to a volunteer psychologist who can provide professional support."
    }
    if (category === "moderate-distress") {
      if (userInput.toLowerCase().includes("anxious")) {
        return "Anxiety can feel overwhelming. Let's try a breathing exercise together. Breathe in slowly for 4 counts, hold for 4, then breathe out for 6 counts. You're doing great."
      }
      return "Thank you for sharing. Your feelings matter. Remember that difficult feelings are temporary. Would you like some coping strategies?"
    }
    if (category === "academic-stress") {
      return "Academic pressure can be tough. Remember that your worth isn't defined by grades. Let's break down what's stressing you most. Taking care of your mental health helps you learn better too."
    }
    if (category === "positive") {
      return "I'm so glad to hear that! Keep doing what's working for you. Remember that healing isn't always linear, and that's okay."
    }
    if (this.conversationHistory.length === 1) {
      return "Hello, I'm here to listen and support you. This is a safe space. How are you feeling today?"
    }
    return "I'm here with you. Tell me more about what's on your mind. Your feelings are valid."
  }
  getConcernLevel(): number {
    return this.concernLevel
  }
}
export function MentalWellnessAvatar() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [avatarState, setAvatarState] = useState<AvatarState>("idle")
  const [transcript, setTranscript] = useState("")
  const [currentResponse, setCurrentResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [concernLevel, setConcernLevel] = useState(0)
  const [showVolunteers, setShowVolunteers] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const dialogueEngineRef = useRef(new WellnessDialogueEngine())
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  useEffect(() => {
    const hasRecognition = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    const hasSynthesis = typeof window !== "undefined" && "speechSynthesis" in window
    setSpeechSupported(hasRecognition && hasSynthesis)
    if (hasSynthesis && typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("Error stopping recognition:", e)
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])
  useEffect(() => {
    if (!speechSupported || typeof window === "undefined") return
    try {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognitionConstructor) return
      const recognition = new SpeechRecognitionConstructor()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"
      recognition.onstart = () => {
        setIsListening(true)
        setAvatarState("listening")
      }
      recognition.onresult = (event: RecognitionEvent) => {
        let interimTranscript = ""
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + " "
          } else {
            interimTranscript += transcriptPiece
          }
        }
        setTranscript(finalTranscript || interimTranscript)
        if (finalTranscript.trim()) {
          processUserInput(finalTranscript.trim())
        }
      }
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error)
        if (event.error === "no-speech") {
          return
        }
        setIsListening(false)
        setAvatarState("idle")
      }
      recognition.onend = () => {
        setIsListening(false)
        if (avatarState === "listening" && !isProcessing) {
          setAvatarState("idle")
        }
      }
      recognitionRef.current = recognition
    } catch (error) {
      console.error("Error initializing speech recognition:", error)
      setSpeechSupported(false)
    }
  }, [speechSupported])
  const processUserInput = useCallback(
    (input: string) => {
      if (!input.trim() || isProcessing) return
      setIsProcessing(true)
      setAvatarState("thinking")
      setTranscript(input)
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("Error stopping recognition:", e)
        }
      }
      setTimeout(() => {
        const response = dialogueEngineRef.current.generateResponse(input)
        const level = dialogueEngineRef.current.getConcernLevel()
        setCurrentResponse(response)
        setConcernLevel(level)
        speakResponse(response)
        if (level >= 6) {
          setShowVolunteers(true)
        }
        setIsProcessing(false)
      }, 800)
    },
    [isListening, isProcessing]
  )
  const speakResponse = useCallback(
    (text: string) => {
      if (!synthRef.current || isMuted) {
        setAvatarState("idle")
        return
      }
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0
      const voices = synthRef.current.getVoices()
      const preferredVoice =
        voices.find((v) => v.name.includes("Female") && v.lang.startsWith("en")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0]
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      utterance.onstart = () => {
        setIsSpeaking(true)
        setAvatarState("speaking")
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        setAvatarState("idle")
        utteranceRef.current = null
        if (recognitionRef.current && !isListening) {
          setTimeout(() => {
            try {
              recognitionRef.current?.start()
            } catch (e) {
              console.error("Error restarting recognition:", e)
            }
          }, 500)
        }
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        setAvatarState("idle")
        utteranceRef.current = null
      }
      utteranceRef.current = utterance
      synthRef.current.speak(utterance)
    },
    [isMuted, isListening]
  )
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return
    if (isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
        setAvatarState("idle")
      } catch (error) {
        console.error("Error stopping recognition:", error)
      }
    } else {
      try {
        setTranscript("")
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    }
  }, [isListening])
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      setAvatarState("idle")
    }
  }, [isSpeaking])
  useEffect(() => {
    if (currentResponse === "" && !isMuted) {
      setTimeout(() => {
        const greeting =
          "Hello, I'm your Mental Wellness Companion. I'm here to listen and support you. This is a safe space where you can share your feelings. Whenever you're ready, start speaking and I'll be here to listen."
        setCurrentResponse(greeting)
        speakResponse(greeting)
      }, 1000)
    }
  }, [])
  const getAvatarAnimation = () => {
    switch (avatarState) {
      case "listening":
        return "animate-pulse"
      case "thinking":
        return "animate-bounce"
      case "speaking":
        return "animate-pulse"
      default:
        return ""
    }
  }
  const getAvatarColor = () => {
    switch (avatarState) {
      case "listening":
        return "from-blue-400 to-blue-600"
      case "thinking":
        return "from-purple-400 to-purple-600"
      case "speaking":
        return "from-green-400 to-green-600"
      default:
        return "from-pink-400 to-pink-600"
    }
  }
  const getAvatarEmoji = () => {
    switch (avatarState) {
      case "listening":
        return "👂"
      case "thinking":
        return "🤔"
      case "speaking":
        return "💬"
      default:
        return "😊"
    }
  }
  if (!speechSupported) {
    return (
      <div className="flex items-center justify-center p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your browser doesn&apos;t support voice features. Please use Chrome, Edge, or Safari.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-pink-500" />
          Mental Wellness Companion
        </h2>
        <p className="text-muted-foreground">
          A safe, voice-first space to express your feelings
        </p>
      </div>
      <Card className="border-2">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-8xl shadow-2xl ${getAvatarAnimation()} transition-all duration-300`}
              >
                {getAvatarEmoji()}
              </div>
              {isListening && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-500 animate-pulse">
                    <Mic className="h-3 w-3 mr-1" />
                    Listening...
                  </Badge>
                </div>
              )}
              {isSpeaking && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-green-500 animate-pulse">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Speaking...
                  </Badge>
                </div>
              )}
              {isProcessing && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-purple-500">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Thinking...
                  </Badge>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">
                {avatarState === "listening" && "I'm listening..."}
                {avatarState === "thinking" && "Let me think..."}
                {avatarState === "speaking" && "Here's what I think..."}
                {avatarState === "idle" && "Ready to listen"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isListening
                  ? "Speak freely - I'm here for you"
                  : "Click the microphone to start"}
              </p>
            </div>
            {transcript && (
              <div className="w-full p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm font-medium mb-1">You said:</p>
                <p className="text-sm text-muted-foreground italic">&quot;{transcript}&quot;</p>
              </div>
            )}
            {currentResponse && (
              <div className="w-full p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm font-medium mb-1 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  My response:
                </p>
                <p className="text-sm">{currentResponse}</p>
              </div>
            )}
            <div className="flex gap-4">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                onClick={toggleListening}
                className="gap-2"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Start Listening
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={toggleMute} className="gap-2">
                {isMuted ? (
                  <>
                    <VolumeX className="h-5 w-5" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5" />
                    Mute
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {concernLevel >= 6 && (
        <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-900 dark:text-orange-100">
            I&apos;m concerned about what you&apos;re sharing. Please consider reaching out to a professional.
          </AlertDescription>
        </Alert>
      )}
      {concernLevel >= 9 && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900 dark:text-red-100 font-medium">
            <p className="mb-2">
              I&apos;m very worried about you. Please reach out immediately:
            </p>
            <p className="font-bold">Crisis Helpline: 0800-567-567 (24/7)</p>
          </AlertDescription>
        </Alert>
      )}
      {showVolunteers && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Connect with a Volunteer Psychologist
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              These professionals volunteer their time to support students. They&apos;re here to help.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {VOLUNTEERS.map((volunteer) => (
                <div key={volunteer.id} className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-semibold mb-1">{volunteer.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{volunteer.role}</p>
                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${volunteer.email}`} className="text-primary hover:underline">
                        {volunteer.email}
                      </a>
                    </div>
                    {volunteer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${volunteer.phone}`} className="text-primary hover:underline">
                          {volunteer.phone}
                        </a>
                      </div>
                    )}
                    <p className="text-muted-foreground">
                      {volunteer.region} • {volunteer.availability}
                    </p>
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <a href={`mailto:${volunteer.email}?subject=Student Support Request`}>
                      Request Support
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="text-center text-xs text-muted-foreground">
        <p>🔒 Your conversations are private and processed locally.</p>
        <p className="mt-1">
          This companion provides support but is not a replacement for professional help.
        </p>
      </div>
    </div>
  )
}
