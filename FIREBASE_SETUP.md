# Firebase Setup Guide for ntwanaAfrika

This guide will help you set up Firebase for your ntwanaAfrika learning platform.

## 🔥 Firebase Project Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "twana-afrika")
4. Enable Google Analytics (recommended)
5. Choose your Analytics account or create a new one
6. Click "Create project"

### 2. Enable Authentication

1. In the Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: For basic email authentication
   - **Google**: For social login (recommended)
   - **Anonymous**: For guest mode access
3. For Google sign-in:
   - Click on Google provider
   - Enable it
   - Add your project's domain to authorized domains if needed
4. For Anonymous authentication:
   - Click on Anonymous provider
   - Enable it (allows users to try the app without creating an account)

### 3. Set up Firestore Database

1. Go to **Firestore Database** in the Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode"
4. Select your database location (choose closest to your users, e.g., "eur3 (europe-west)" for Africa)

### 4. Configure Firestore Security Rules

Replace the default rules with the following to secure your user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users (including anonymous) can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow reading public leaderboard data (authenticated users only)
    match /leaderboards/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow reading curriculum/lesson data (authenticated users only)
    match /curriculum/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow reading/writing user progress (including anonymous users)
    match /users/{userId}/progress/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow anonymous users to access public content
    match /public/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

### 5. Get Your Firebase Configuration

1. In the Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on "Web" icon (</>) to add a web app
4. Register your app with a nickname (e.g., "ntwanaAfrika Web")
5. Copy the Firebase configuration object

### 6. Update Environment Variables

Add your Firebase configuration to `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key-here"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

## 📊 Database Structure

The app uses the following Firestore collections:

### Users Collection (`/users/{userId}`)
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  displayName: "User Name",
  country: "South Africa",
  language: "English",
  school: "School Name",
  grade: "Grade 10",
  level: 5,
  skillCoins: 1250,
  streak: 7,
  joinDate: "2024-01-15T10:30:00Z",
  totalLessonsCompleted: 45,
  badges: ["Math Master", "Reading Star"]
}
```

### User Progress Subcollection (`/users/{userId}/progress/{lessonId}`)
```javascript
{
  lessonId: "math-lesson-1",
  completedAt: "2024-01-15T14:30:00Z",
  score: 95,
  timeSpent: 600, // seconds
  coinsEarned: 50
}
```

## 🔐 Authentication Features

The app includes:
- Email/password authentication
- Google OAuth login
- Password reset functionality
- Automatic user profile creation
- Protected routes

## 🛡️ Security Best Practices

1. **Environment Variables**: All Firebase config uses `NEXT_PUBLIC_` prefix for client-side access
2. **Security Rules**: Firestore rules ensure users can only access their own data
3. **Authentication Required**: All app features require authentication
4. **Data Validation**: Client-side validation with server-side security rules

## 📱 Firebase Features Used

- **Authentication**: User sign-up, sign-in, and management
- **Firestore**: Real-time database for user profiles and progress
- **Analytics**: User engagement and app usage tracking
- **Storage**: (Future) Profile pictures and lesson assets

## 🚀 Deployment

When deploying to production:

1. Update Firestore security rules to production mode
2. Add your production domain to Firebase authorized domains
3. Set up Firebase Hosting (optional) or use Vercel
4. Monitor usage in Firebase Console

## 📞 Support

For Firebase setup issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Community](https://firebase.google.com/community)

---

Your Firebase project is now ready to power the ntwanaAfrika learning platform! 🎓