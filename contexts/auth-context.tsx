"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  country?: string;
  language?: string;
  school?: string;
  grade?: string;
  level: number;
  skillCoins: number;
  streak: number;
  joinDate: string;
  totalLessonsCompleted: number;
  badges: string[];
  rank?: string | number;
  xp: number;
  lastLoginDate?: string;
  // Learning Progress
  subjectProgress: {
    [key: string]: {
      name: string;
      icon: string;
      progress: number;
      lessonsCompleted: number;
      totalLessons: number;
      lastAccessed?: string;
    };
  };
  // Daily Quests
  dailyQuests: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    total: number;
    reward: number;
    completed: boolean;
    category: string;
  }>;
  // Completed Lessons
  completedLessons: string[];
  // Rewards History
  rewardsRedeemed: Array<{
    id: string;
    name: string;
    coins: number;
    redeemedAt: string;
    status: "pending" | "collected" | "expired";
  }>;
  // User Preferences
  preferences?: {
    interests?: string[];
    careerGoals?: string[];
    learningStyle?: string;
  };
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  updateStreak: (streak: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<UserProfile>>(
    {}
  );
  const [writeTimeoutId, setWriteTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  // Debounced write to Firebase - writes after 3 seconds of inactivity
  useEffect(() => {
    if (Object.keys(pendingUpdates).length === 0 || !currentUser) return;

    // Emit saving event
    window.dispatchEvent(new CustomEvent("data-saving"));

    // Clear existing timeout
    if (writeTimeoutId) {
      clearTimeout(writeTimeoutId);
    }

    // Set new timeout to write after 3 seconds
    const timeoutId = setTimeout(async () => {
      try {
        await updateDoc(doc(db, "users", currentUser.uid), pendingUpdates);
        console.log(
          "✅ Batched updates saved to Firebase:",
          Object.keys(pendingUpdates)
        );
        setPendingUpdates({});

        // Emit saved event
        window.dispatchEvent(new CustomEvent("data-saved"));
      } catch (error) {
        console.error("Error saving batched updates:", error);
      }
    }, 3000);

    setWriteTimeoutId(timeoutId);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pendingUpdates, currentUser]);

  // Save pending updates when user navigates away or closes tab
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (Object.keys(pendingUpdates).length > 0 && currentUser) {
        // Use sendBeacon for reliable write on page unload
        const payload = JSON.stringify({
          uid: currentUser.uid,
          updates: pendingUpdates,
        });

        // Fallback to synchronous write if available
        try {
          await updateDoc(doc(db, "users", currentUser.uid), pendingUpdates);
        } catch (error) {
          console.error("Error saving on unload:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Also save when component unmounts (navigation)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (Object.keys(pendingUpdates).length > 0 && currentUser) {
        // Flush pending updates immediately
        updateDoc(doc(db, "users", currentUser.uid), pendingUpdates).catch(
          console.error
        );
      }
    };
  }, [pendingUpdates, currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Load user profile from Firestore
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auto-update streak once per day on login (only writes if it's a new day)
  useEffect(() => {
    if (!currentUser || !userProfile) return;

    const checkAndUpdateStreak = async () => {
      const lastLogin = userProfile.lastLoginDate
        ? new Date(userProfile.lastLoginDate)
        : null;
      const today = new Date();

      // Check if we already updated today
      if (lastLogin) {
        const lastLoginDateOnly = new Date(
          lastLogin.getFullYear(),
          lastLogin.getMonth(),
          lastLogin.getDate()
        );
        const todayDateOnly = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        if (lastLoginDateOnly.getTime() === todayDateOnly.getTime()) {
          console.log("✅ Streak already updated today");
          return;
        }
      }

      // Calculate streak
      const diffTime = lastLogin
        ? Math.abs(today.getTime() - lastLogin.getTime())
        : 0;
      const diffDays = lastLogin
        ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        : 0;

      let newStreak = userProfile.streak || 0;

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      } else if (!lastLogin) {
        newStreak = 1;
      }

      console.log("🔥 Auto-updating streak on login:", newStreak);
      await updateUserProfile({
        streak: newStreak,
        lastLoginDate: today.toISOString(),
      });
    };

    // Run once when user profile loads
    checkAndUpdateStreak();
  }, [currentUser?.uid, userProfile?.lastLoginDate]); // Only re-run if user changes or lastLoginDate changes

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        // Create default profile for new user
        const defaultProfile = createDefaultProfile(uid, currentUser);
        await setDoc(doc(db, "users", uid), defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  // Helper function to create default user profile
  const createDefaultProfile = (
    uid: string,
    user: User | null
  ): UserProfile => {
    return {
      uid,
      email: user?.email || null,
      displayName: user?.displayName || null,
      level: 1,
      skillCoins: 0,
      xp: 0,
      streak: 0,
      joinDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      totalLessonsCompleted: 0,
      badges: [],
      completedLessons: [],
      subjectProgress: {
        mathematics: {
          name: "Mathematics",
          icon: "🧮",
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 30,
        },
        reading: {
          name: "Reading & Language",
          icon: "📚",
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 25,
        },
        science: {
          name: "Science",
          icon: "🔬",
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 20,
        },
        lifeSkills: {
          name: "Life Skills",
          icon: "🌱",
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 15,
        },
      },
      dailyQuests: [
        {
          id: "quest_math_1",
          title: "Complete 2 Math lessons",
          description: "Practice your math skills",
          progress: 0,
          total: 2,
          reward: 50,
          completed: false,
          category: "mathematics",
        },
        {
          id: "quest_reading_1",
          title: "Practice reading for 15 minutes",
          description: "Improve your reading comprehension",
          progress: 0,
          total: 15,
          reward: 30,
          completed: false,
          category: "reading",
        },
        {
          id: "quest_science_1",
          title: "Answer 10 science questions",
          description: "Test your science knowledge",
          progress: 0,
          total: 10,
          reward: 40,
          completed: false,
          category: "science",
        },
      ],
      rewardsRedeemed: [],
    };
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const displayName = `${firstName} ${lastName}`.trim();
    await updateProfile(user, { displayName });

    // Create user profile in Firestore with complete default structure
    const userProfile = createDefaultProfile(user.uid, user);
    userProfile.displayName = displayName;
    userProfile.firstName = firstName;
    userProfile.lastName = lastName;
    await setDoc(doc(db, "users", user.uid), userProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      // Extract first name and last name from Google displayName
      const displayName = user.displayName || "";
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Create new user profile for first-time Google sign-in
      const userProfile = createDefaultProfile(user.uid, user);
      userProfile.displayName = displayName;
      userProfile.firstName = firstName;
      userProfile.lastName = lastName;
      userProfile.photoURL = user.photoURL || undefined;
      await setDoc(doc(db, "users", user.uid), userProfile);
      setUserProfile(userProfile);
    } else {
      // Update existing profile with Google info if needed
      const existingProfile = userDoc.data() as UserProfile;
      const updates: Partial<UserProfile> = {};

      if (!existingProfile.firstName || !existingProfile.lastName) {
        const displayName = user.displayName || "";
        const nameParts = displayName.split(" ");
        updates.firstName = nameParts[0] || "";
        updates.lastName = nameParts.slice(1).join(" ") || "";
      }

      if (!existingProfile.photoURL && user.photoURL) {
        updates.photoURL = user.photoURL;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, "users", user.uid), updates);
      }

      await loadUserProfile(user.uid);
    }
  };

  const loginAnonymously = async () => {
    const { user } = await signInAnonymously(auth);

    // Create anonymous user profile in Firestore with complete default structure
    const userProfile = createDefaultProfile(user.uid, user);
    userProfile.displayName = "Guest User";
    await setDoc(doc(db, "users", user.uid), userProfile);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;

    try {
      // Update local state immediately for instant UI feedback
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));

      // Queue updates for batched write
      setPendingUpdates((prev) => ({ ...prev, ...updates }));

      console.log("📝 Queued for batching:", Object.keys(updates));
    } catch (error) {
      console.error("Error queuing user profile update:", error);
      throw error;
    }
  };

  // Force immediate write (use for critical operations like authentication)
  const forceWriteUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), updates);
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));

      // Clear these updates from pending queue
      setPendingUpdates((prev) => {
        const newPending = { ...prev };
        Object.keys(updates).forEach(
          (key) => delete newPending[key as keyof UserProfile]
        );
        return newPending;
      });

      console.log("💾 Force saved to Firebase:", Object.keys(updates));
    } catch (error) {
      console.error("Error force writing user profile:", error);
      throw error;
    }
  };

  const addCoins = async (amount: number) => {
    if (!currentUser || !userProfile) return;

    const newCoins = userProfile.skillCoins + amount;
    await updateUserProfile({ skillCoins: newCoins });
  };

  const updateStreak = async (streak: number) => {
    if (!currentUser) return;

    await updateUserProfile({ streak });
  };

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
