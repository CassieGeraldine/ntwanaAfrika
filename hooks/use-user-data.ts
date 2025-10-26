import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { doc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useUserData() {
  const { currentUser, userProfile, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)

  // Complete a lesson and award coins and XP
  const completeLesson = async (lessonId: string, subject: string, coinsAwarded: number, xpAwarded: number) => {
    if (!currentUser || !userProfile) return

    setLoading(true)
    try {
      const newTotalLessons = userProfile.totalLessonsCompleted + 1
      const newCoins = userProfile.skillCoins + coinsAwarded
      const newXP = userProfile.xp + xpAwarded
      const newLevel = Math.floor(newXP / 1000) + 1

      // Update subject progress
      const subjectKey = subject.toLowerCase().replace(/\s+/g, '')
      const subjectData = userProfile.subjectProgress[subjectKey]
      
      if (subjectData) {
        const updatedSubjectProgress = {
          ...userProfile.subjectProgress,
          [subjectKey]: {
            ...subjectData,
            lessonsCompleted: subjectData.lessonsCompleted + 1,
            progress: Math.round(((subjectData.lessonsCompleted + 1) / subjectData.totalLessons) * 100),
            lastAccessed: new Date().toISOString(),
          },
        }

        await updateUserProfile({
          totalLessonsCompleted: newTotalLessons,
          skillCoins: newCoins,
          xp: newXP,
          level: newLevel,
          completedLessons: [...(userProfile.completedLessons || []), lessonId],
          subjectProgress: updatedSubjectProgress,
        })

        // Check and award badges
        await checkAndAwardBadges(newTotalLessons, newLevel, updatedSubjectProgress)
      }

    } catch (error) {
      console.error('Error completing lesson:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update daily quest progress
  const updateQuestProgress = async (questId: string, progress: number) => {
    if (!currentUser || !userProfile) return

    setLoading(true)
    try {
      const updatedQuests = userProfile.dailyQuests.map(quest => {
        if (quest.id === questId) {
          const newProgress = Math.min(progress, quest.total)
          const isCompleted = newProgress >= quest.total
          
          // Award coins if quest just completed
          if (isCompleted && !quest.completed) {
            addCoins(quest.reward)
          }

          return {
            ...quest,
            progress: newProgress,
            completed: isCompleted,
          }
        }
        return quest
      })

      await updateUserProfile({ dailyQuests: updatedQuests })
    } catch (error) {
      console.error('Error updating quest progress:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset daily quests (call this daily or when new quests are needed)
  const resetDailyQuests = async () => {
    if (!currentUser) return

    const freshQuests = [
      {
        id: `quest_math_${Date.now()}`,
        title: "Complete 2 Math lessons",
        description: "Practice your math skills",
        progress: 0,
        total: 2,
        reward: 50,
        completed: false,
        category: "mathematics",
      },
      {
        id: `quest_reading_${Date.now()}`,
        title: "Practice reading for 15 minutes",
        description: "Improve your reading comprehension",
        progress: 0,
        total: 15,
        reward: 30,
        completed: false,
        category: "reading",
      },
      {
        id: `quest_science_${Date.now()}`,
        title: "Answer 10 science questions",
        description: "Test your science knowledge",
        progress: 0,
        total: 10,
        reward: 40,
        completed: false,
        category: "science",
      },
    ]

    await updateUserProfile({ dailyQuests: freshQuests })
  }

  // Update streak (call on daily login)
  const updateStreak = async () => {
    if (!currentUser || !userProfile) return

    setLoading(true)
    try {
      const lastLogin = userProfile.lastLoginDate ? new Date(userProfile.lastLoginDate) : new Date()
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - lastLogin.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let newStreak = userProfile.streak

      if (diffDays === 1) {
        // Consecutive day login
        newStreak += 1
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1
      }
      // diffDays === 0 means already logged in today, keep streak

      await updateUserProfile({
        streak: newStreak,
        lastLoginDate: today.toISOString(),
      })
    } catch (error) {
      console.error('Error updating streak:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Add coins to user balance
  const addCoins = async (amount: number) => {
    if (!currentUser || !userProfile) return

    const newCoins = userProfile.skillCoins + amount
    await updateUserProfile({ skillCoins: newCoins })
  }

  // Check and automatically award badges based on achievements
  const checkAndAwardBadges = async (totalLessons: number, level: number, subjectProgress: any) => {
    if (!userProfile) return

    const newBadges: string[] = []

    // Lesson completion badges
    if (totalLessons >= 10 && !userProfile.badges.includes('10_lessons')) {
      newBadges.push('10_lessons')
    }
    if (totalLessons >= 50 && !userProfile.badges.includes('50_lessons')) {
      newBadges.push('50_lessons')
    }
    if (totalLessons >= 100 && !userProfile.badges.includes('100_lessons')) {
      newBadges.push('100_lessons')
    }

    // Level badges
    if (level >= 5 && !userProfile.badges.includes('level_5')) {
      newBadges.push('level_5')
    }
    if (level >= 10 && !userProfile.badges.includes('level_10')) {
      newBadges.push('level_10')
    }

    // Subject mastery badges
    Object.keys(subjectProgress).forEach(subject => {
      const progress = subjectProgress[subject].progress
      if (progress >= 100 && !userProfile.badges.includes(`${subject}_master`)) {
        newBadges.push(`${subject}_master`)
      }
    })

    // Streak badges
    if (userProfile.streak >= 7 && !userProfile.badges.includes('7_day_streak')) {
      newBadges.push('7_day_streak')
    }
    if (userProfile.streak >= 30 && !userProfile.badges.includes('30_day_streak')) {
      newBadges.push('30_day_streak')
    }

    if (newBadges.length > 0) {
      const updatedBadges = [...userProfile.badges, ...newBadges]
      await updateUserProfile({ badges: updatedBadges })
    }
  }

  // Add a new badge manually
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
  const redeemReward = async (rewardId: string, rewardName: string, coinCost: number) => {
    if (!currentUser || !userProfile) return false

    if (userProfile.skillCoins < coinCost) {
      throw new Error('Insufficient coins')
    }

    setLoading(true)
    try {
      const newCoins = userProfile.skillCoins - coinCost
      const newReward = {
        id: rewardId,
        name: rewardName,
        coins: coinCost,
        redeemedAt: new Date().toISOString(),
        status: 'pending' as const,
      }

      await updateUserProfile({
        skillCoins: newCoins,
        rewardsRedeemed: [...(userProfile.rewardsRedeemed || []), newReward],
      })

      return true
    } catch (error) {
      console.error('Error redeeming reward:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update reward status (pending -> collected -> expired)
  const updateRewardStatus = async (rewardId: string, status: 'pending' | 'collected' | 'expired') => {
    if (!currentUser || !userProfile) return

    const updatedRewards = userProfile.rewardsRedeemed.map(reward =>
      reward.id === rewardId ? { ...reward, status } : reward
    )

    await updateUserProfile({ rewardsRedeemed: updatedRewards })
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
    updateQuestProgress,
    resetDailyQuests,
    updateStreak,
    addCoins,
    awardBadge,
    redeemReward,
    updateRewardStatus,
    updatePreferences,
  }
}