"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signInAnonymously,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  country?: string
  language?: string
  school?: string
  grade?: string
  level: number
  skillCoins: number
  streak: number
  joinDate: string
  totalLessonsCompleted: number
  badges: string[]
}

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginAnonymously: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  addCoins: (amount: number) => Promise<void>
  updateStreak: (streak: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Load user profile from Firestore
        await loadUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile)
      } else {
        // Create default profile for new user
        const defaultProfile: UserProfile = {
          uid,
          email: currentUser?.email || null,
          displayName: currentUser?.displayName || null,
          level: 1,
          skillCoins: 0,
          streak: 0,
          joinDate: new Date().toISOString(),
          totalLessonsCompleted: 0,
          badges: [],
        }
        await setDoc(doc(db, 'users', uid), defaultProfile)
        setUserProfile(defaultProfile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName,
      level: 1,
      skillCoins: 0,
      streak: 0,
      joinDate: new Date().toISOString(),
      totalLessonsCompleted: 0,
      badges: [],
    }
    await setDoc(doc(db, 'users', user.uid), userProfile)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const loginAnonymously = async () => {
    const { user } = await signInAnonymously(auth)
    
    // Create anonymous user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: null,
      displayName: 'Guest User',
      level: 1,
      skillCoins: 0,
      streak: 0,
      joinDate: new Date().toISOString(),
      totalLessonsCompleted: 0,
      badges: [],
    }
    await setDoc(doc(db, 'users', user.uid), userProfile)
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return
    
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), updates)
      setUserProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  const addCoins = async (amount: number) => {
    if (!currentUser || !userProfile) return
    
    const newCoins = userProfile.skillCoins + amount
    await updateUserProfile({ skillCoins: newCoins })
  }

  const updateStreak = async (streak: number) => {
    if (!currentUser) return
    
    await updateUserProfile({ streak })
  }

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    loginAnonymously,
    updateUserProfile,
    addCoins,
    updateStreak,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}