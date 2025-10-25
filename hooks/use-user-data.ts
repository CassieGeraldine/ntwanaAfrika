import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useUserData() {
  const { currentUser, userProfile, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)

  // Complete a lesson and award coins
  const completeLesson = async (lessonId: string, coinsAwarded: number) => {
    if (!currentUser || !userProfile) return

    setLoading(true)
    try {
      const newTotalLessons = userProfile.totalLessonsCompleted + 1
      const newCoins = userProfile.skillCoins + coinsAwarded
      const newLevel = Math.floor(newCoins / 1000) + 1

      await updateUserProfile({
        totalLessonsCompleted: newTotalLessons,
        skillCoins: newCoins,
        level: newLevel,
      })

      // You could also track individual lesson completions in a subcollection
      // const lessonRef = doc(db, 'users', currentUser.uid, 'completedLessons', lessonId)
      // await setDoc(lessonRef, {
      //   completedAt: new Date().toISOString(),
      //   coinsAwarded,
      // })

    } catch (error) {
      console.error('Error completing lesson:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update streak
  const updateStreak = async (newStreak: number) => {
    if (!currentUser) return

    setLoading(true)
    try {
      await updateUserProfile({ streak: newStreak })
    } catch (error) {
      console.error('Error updating streak:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Add a new badge
  const awardBadge = async (badgeName: string) => {
    if (!currentUser || !userProfile) return

    if (userProfile.badges.includes(badgeName)) {
      return // Badge already earned
    }

    setLoading(true)
    try {
      const newBadges = [...userProfile.badges, badgeName]
      await updateUserProfile({ badges: newBadges })
    } catch (error) {
      console.error('Error awarding badge:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Spend coins (for rewards)
  const spendCoins = async (amount: number) => {
    if (!currentUser || !userProfile) return false

    if (userProfile.skillCoins < amount) {
      throw new Error('Insufficient coins')
    }

    setLoading(true)
    try {
      const newCoins = userProfile.skillCoins - amount
      await updateUserProfile({ skillCoins: newCoins })
      return true
    } catch (error) {
      console.error('Error spending coins:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update user preferences (country, language, etc.)
  const updatePreferences = async (preferences: {
    country?: string
    language?: string
    school?: string
    grade?: string
  }) => {
    if (!currentUser) return

    setLoading(true)
    try {
      await updateUserProfile(preferences)
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    userProfile,
    loading,
    completeLesson,
    updateStreak,
    awardBadge,
    spendCoins,
    updatePreferences,
  }
}