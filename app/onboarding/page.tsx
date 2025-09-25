"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Globe, BookOpen, Gift, Users, ArrowRight } from "lucide-react"

const countries = [
  {
    name: "South Africa",
    flag: "🇿🇦",
    languages: ["English", "isiXhosa", "isiZulu", "Afrikaans"],
  },
  {
    name: "Zimbabwe",
    flag: "🇿🇼",
    languages: ["English", "Shona", "Ndebele"],
  },
  {
    name: "Kenya",
    flag: "🇰🇪",
    languages: ["English", "Swahili", "Kikuyu"],
  },
  {
    name: "Zambia",
    flag: "🇿🇲",
    languages: ["English", "Bemba", "Nyanja", "Tonga"],
  },
  {
    name: "Malawi",
    flag: "🇲🇼",
    languages: ["English", "Chichewa", "Tumbuka"],
  },
]

const tutorialSteps = [
  {
    icon: BookOpen,
    title: "Learn & Grow",
    description: "Complete lessons aligned with your school curriculum",
    color: "bg-primary",
  },
  {
    icon: Gift,
    title: "Earn Skill Coins",
    description: "Get points for every lesson and challenge you complete",
    color: "bg-secondary",
  },
  {
    icon: Gift,
    title: "Redeem Rewards",
    description: "Exchange coins for food, hygiene items, airtime, and data",
    color: "bg-accent",
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const router = useRouter()

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
    setSelectedLanguage("")
  }

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language)
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save preferences and redirect to dashboard
      localStorage.setItem("userCountry", selectedCountry)
      localStorage.setItem("userLanguage", selectedLanguage)
      localStorage.setItem("onboardingComplete", "true")
      router.push("/")
    }
  }

  const canProceed = () => {
    if (step === 1) return selectedCountry && selectedLanguage
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome Header */}
        {step === 1 && (
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-secondary-foreground font-bold text-2xl">M</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">Welcome to MwanAfrika</h1>
            <p className="text-xl text-muted-foreground font-medium">Learning feeds the future</p>
          </div>
        )}

        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>
            <CardTitle className="text-xl">
              {step === 1 && "Choose Your Location & Language"}
              {step === 2 && "How MwanAfrika Works"}
              {step === 3 && "Ready to Start Learning!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Language Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Select your country:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {countries.map((country) => (
                      <button
                        key={country.name}
                        onClick={() => handleCountrySelect(country.name)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedCountry === country.name
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-medium">{country.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCountry && (
                  <div>
                    <h3 className="font-semibold mb-3">Choose your preferred language:</h3>
                    <div className="flex flex-wrap gap-2">
                      {countries
                        .find((c) => c.name === selectedCountry)
                        ?.languages.map((language) => (
                          <Badge
                            key={language}
                            variant={selectedLanguage === language ? "default" : "outline"}
                            className={`cursor-pointer px-4 py-2 ${
                              selectedLanguage === language ? "bg-primary hover:bg-primary/90" : "hover:bg-muted"
                            }`}
                            onClick={() => handleLanguageSelect(language)}
                          >
                            {language}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Tutorial */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground">Here's how you'll earn rewards while learning:</p>
                </div>

                <div className="space-y-4">
                  {tutorialSteps.map((tutorialStep, index) => {
                    const Icon = tutorialStep.icon
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                        <div
                          className={`w-12 h-12 rounded-xl ${tutorialStep.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{tutorialStep.title}</h4>
                          <p className="text-sm text-muted-foreground">{tutorialStep.description}</p>
                        </div>
                        <div className="text-2xl font-bold text-primary">{index + 1}</div>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-secondary/20 rounded-lg p-4 text-center">
                  <p className="font-medium text-secondary-foreground">
                    Complete lessons → Earn Skill Coins → Get real rewards!
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Ready to Start */}
            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-4xl">🎉</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">You're all set!</h3>
                  <p className="text-muted-foreground mb-4">Welcome to your learning journey with MwanAfrika.</p>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span>Country:</span>
                      <Badge variant="outline">{selectedCountry}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Language:</span>
                      <Badge variant="outline">{selectedLanguage}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Join thousands of students across Africa</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gift className="h-4 w-4" />
                    <span>Start earning rewards from your first lesson</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`${step === 1 ? "ml-auto" : ""} min-w-[120px]`}
              >
                {step === 3 ? "Start Learning" : "Continue"}
                {step < 3 && <ChevronRight className="h-4 w-4 ml-1" />}
                {step === 3 && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>By continuing, you agree to help make education accessible for all</p>
        </div>
      </div>
    </div>
  )
}
