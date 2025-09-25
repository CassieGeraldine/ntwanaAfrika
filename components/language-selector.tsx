"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

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

export function LanguageSelector() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedCountry = localStorage.getItem("userCountry")
    const savedLanguage = localStorage.getItem("userLanguage")

    if (savedCountry) setSelectedCountry(savedCountry)
    if (savedLanguage) setSelectedLanguage(savedLanguage)
  }, [])

  const handleLanguageChange = (country: string, language: string) => {
    setSelectedCountry(country)
    setSelectedLanguage(language)

    // Save to localStorage
    localStorage.setItem("userCountry", country)
    localStorage.setItem("userLanguage", language)
  }

  const getCurrentFlag = () => {
    const country = countries.find((c) => c.name === selectedCountry)
    return country?.flag || "🌍"
  }

  const getAllLanguageOptions = () => {
    const options: Array<{ country: string; language: string; flag: string }> = []

    countries.forEach((country) => {
      country.languages.forEach((language) => {
        options.push({
          country: country.name,
          language,
          flag: country.flag,
        })
      })
    })

    return options
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-sm">
          <span className="text-base">{getCurrentFlag()}</span>
          <span className="hidden sm:inline">{selectedLanguage || "Language"}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {getAllLanguageOptions().map(({ country, language, flag }) => (
          <DropdownMenuItem
            key={`${country}-${language}`}
            onClick={() => handleLanguageChange(country, language)}
            className={`flex items-center gap-2 ${
              selectedCountry === country && selectedLanguage === language ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <span className="text-base">{flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language}</span>
              <span className="text-xs text-muted-foreground">{country}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
