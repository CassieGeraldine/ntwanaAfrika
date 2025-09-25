import { useState, useEffect } from 'react'

export interface LessonContent {
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  skillCoins: number
  content: {
    introduction: {
      title: string
      content: string
      culturalContext: string
    }
    mainContent: Array<{
      section: string
      explanation: string
      example: string
      visualDescription: string
    }>
    exercises: Array<{
      type: 'multiple-choice' | 'fill-blank' | 'practical'
      question: string
      options?: string[]
      correctAnswer: string
      explanation: string
      contextualHint: string
    }>
    realWorldApplication: {
      title: string
      examples: string[]
      communityConnection: string
    }
    summary: {
      keyPoints: string[]
      nextSteps: string
    }
  }
}

export interface CurriculumTopic {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedLessons: number
  prerequisites: string[]
  realWorldApplication: string
  culturalRelevance: string
}

export interface SubjectCurriculum {
  subject: string
  level: string
  topics: CurriculumTopic[]
}

export function useCurriculum() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null)
  const [curriculumTopics, setCurriculumTopics] = useState<SubjectCurriculum | null>(null)

  const generateLesson = async (
    subject: string,
    level: string,
    topic: string,
    lessonType: string = 'interactive'
  ): Promise<LessonContent> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/curriculum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, level, topic, lessonType }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate lesson')
      }

      const lessonContent: LessonContent = await response.json()
      setCurrentLesson(lessonContent)
      return lessonContent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getSubjectTopics = async (
    subject: string,
    level: string = 'primary'
  ): Promise<SubjectCurriculum> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/curriculum?subject=${encodeURIComponent(subject)}&level=${level}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch topics')
      }

      const curriculum: SubjectCurriculum = await response.json()
      setCurriculumTopics(curriculum)
      return curriculum
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const saveProgress = (lessonId: string, progress: number, completed: boolean) => {
    const progressKey = `lesson_progress_${lessonId}`
    const progressData = {
      progress,
      completed,
      lastAccessed: new Date().toISOString(),
      skillCoinsEarned: completed ? currentLesson?.skillCoins || 0 : 0
    }
    
    localStorage.setItem(progressKey, JSON.stringify(progressData))
    
    // Update total skill coins
    if (completed) {
      const currentCoins = parseInt(localStorage.getItem('skillCoins') || '0', 10)
      const newTotal = currentCoins + (currentLesson?.skillCoins || 0)
      localStorage.setItem('skillCoins', newTotal.toString())
    }
  }

  const getProgress = (lessonId: string) => {
    const progressKey = `lesson_progress_${lessonId}`
    const progressData = localStorage.getItem(progressKey)
    
    if (progressData) {
      return JSON.parse(progressData)
    }
    
    return { progress: 0, completed: false, lastAccessed: null, skillCoinsEarned: 0 }
  }

  const getSubjectProgress = (subject: string) => {
    const allKeys = Object.keys(localStorage)
    const subjectKeys = allKeys.filter(key => 
      key.startsWith('lesson_progress_') && 
      key.includes(subject.toLowerCase())
    )
    
    let totalLessons = subjectKeys.length
    let completedLessons = 0
    let totalSkillCoins = 0
    
    subjectKeys.forEach(key => {
      const data = JSON.parse(localStorage.getItem(key) || '{}')
      if (data.completed) {
        completedLessons++
        totalSkillCoins += data.skillCoinsEarned || 0
      }
    })
    
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
    
    return {
      totalLessons,
      completedLessons,
      progressPercentage: Math.round(progressPercentage),
      totalSkillCoins
    }
  }

  // Generate sample lesson for demo purposes
  const generateSampleLesson = (subject: string, topic: string): LessonContent => {
    const sampleLessons = {
      mathematics: {
        title: "Basic Addition with African Markets",
        description: "Learn addition using market scenarios from African communities",
        duration: "20 minutes",
        difficulty: "Beginner" as const,
        skillCoins: 50,
        content: {
          introduction: {
            title: "Welcome to Market Mathematics!",
            content: "Today we'll learn addition by helping Amina count items in her family's market stall in Lagos.",
            culturalContext: "Markets are the heart of African communities, where mathematics comes alive!"
          },
          mainContent: [
            {
              section: "What is Addition?",
              explanation: "Addition means putting numbers together to find the total amount.",
              example: "If Amina has 3 mangoes and buys 2 more, she has 3 + 2 = 5 mangoes total.",
              visualDescription: "Picture mangoes being counted in a market basket"
            }
          ],
          exercises: [
            {
              type: "multiple-choice" as const,
              question: "Kofi sold 4 bananas in the morning and 3 in the afternoon. How many bananas did he sell in total?",
              options: ["6", "7", "8", "5"],
              correctAnswer: "7",
              explanation: "4 + 3 = 7 bananas total",
              contextualHint: "Count like you're helping Kofi at his banana stand!"
            }
          ],
          realWorldApplication: {
            title: "Mathematics in Daily Life",
            examples: [
              "Counting money when buying groceries",
              "Adding up family members for dinner planning"
            ],
            communityConnection: "Strong math skills help families manage resources and run successful businesses"
          },
          summary: {
            keyPoints: [
              "Addition combines numbers to find totals",
              "Mathematics is everywhere in African daily life"
            ],
            nextSteps: "Next, we'll learn subtraction using market change scenarios"
          }
        }
      }
    }

    return sampleLessons.mathematics // Default sample
  }

  return {
    isLoading,
    error,
    currentLesson,
    curriculumTopics,
    generateLesson,
    getSubjectTopics,
    saveProgress,
    getProgress,
    getSubjectProgress,
    generateSampleLesson
  }
}
