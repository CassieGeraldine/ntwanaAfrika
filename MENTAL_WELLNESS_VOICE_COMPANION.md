  - One-click "Request Support" button

#### Volunteer Database
Currently includes 4 volunteer psychologists:
1. **Dr. Amina Mtshali** - South Africa - Clinical Psychologist
2. **Dr. Kofi Mensah** - Ghana - Educational Psychologist
3. **Ms. Thandiwe Nyathi** - Zimbabwe - Counseling Therapist
4. **Mr. Jabari Okello** - Kenya - Youth Counselor

---

## Technical Implementation

### Browser Support
- **Chrome**: Full support (recommended)
- **Edge**: Full support
- **Safari**: Full support (iOS 14.5+)
- **Firefox**: Limited (no Web Speech API)
- **Fallback**: Error message with browser recommendation

### Dependencies
```json
{
  "lucide-react": "Icons for UI",
  "@/components/ui/*": "shadcn/ui components (Card, Button, Badge, Alert, Dialog)"
}
```

### File Structure
```
components/
  mental-wellness-avatar.tsx    # Main avatar component (890 lines)

app/wellness/
  page.tsx                      # Updated wellness hub with avatar integration
```

### State Management
```typescript
// Voice control
isListening: boolean
isSpeaking: boolean
avatarState: "idle" | "listening" | "thinking" | "speaking"

// Content
transcript: string              // Real-time STT output
currentResponse: string         // TTS response text

// Processing
isProcessing: boolean          // Dialogue engine working
speechSupported: boolean       // Browser capability check
isMuted: boolean              // TTS toggle

// Concern tracking
concernLevel: number           // 0-10 scale
showVolunteers: boolean        // Auto-show professionals
```

### Refs
```typescript
recognitionRef: SpeechRecognition       // STT instance
synthRef: SpeechSynthesis              // TTS instance
utteranceRef: SpeechSynthesisUtterance // Current speech
dialogueEngineRef: WellnessDialogueEngine // AI logic
```

---

## Privacy & Safety

### Privacy Features
1. **Local Processing**: All voice processing happens in the browser
2. **No Data Storage**: Conversations are not saved or transmitted
3. **Session-Only**: Data cleared when dialog closes
4. **No Third-Party APIs**: Uses browser-native APIs only

### Safety Mechanisms
1. **Crisis Detection**: Immediate keyword-based detection
2. **Escalation Path**: Clear route to professional help
3. **Concern Trending**: Tracks worsening patterns
4. **Professional Referrals**: Auto-suggest volunteers at level 6+
5. **Emergency Contacts**: Always visible for crisis situations

### Disclaimers
- Displayed at bottom of interface
- Clear statement: "Not a replacement for professional help"
- Privacy notice: "Conversations processed locally in your browser"

---

## User Experience Goals

### Emotional
- **Empathy**: Warm, understanding responses
- **Safety**: Non-judgmental space
- **Validation**: "Your feelings are valid"
- **Hope**: Temporary nature of difficult feelings

### Functional
- **Accessibility**: Voice-first reduces barriers
- **Simplicity**: One-button operation
- **Immediacy**: Real-time conversation
- **Clarity**: Visual feedback at every step

### Academic Connection
- **Stress Management**: Links wellness to performance
- **Rewards Motivation**: "Earn rewards by taking care of yourself"
- **Study-Life Balance**: Emphasizes holistic success

---

## Integration Points

### Within Wellness Hub
1. **Mood Tracker**: Complements daily check-ins
2. **Wellness Tips**: Reinforces coping strategies
3. **Support Resources**: Links to existing helplines
4. **Privacy Dialog**: Consistent privacy messaging

### With Broader App
1. **Rewards System**: Future - reward wellness engagement
2. **Learning Platform**: Stress support during study sessions
3. **Profile**: Optional - track wellness metrics
4. **Notifications**: Gentle reminders to check in

---

## Performance Considerations

### Optimization
- **Lazy Loading**: Component loads on dialog open
- **API Efficiency**: Minimal API calls (browser-native only)
- **Memory**: Cleanup on unmount (stop recognition, cancel speech)
- **Battery**: Continuous listening mode (inform users)

### Error Handling
- **Recognition Errors**: Graceful continue or restart
- **Synthesis Errors**: Silent fallback, text remains visible
- **Browser Incompatibility**: Clear error message with guidance
- **Network**: No network required (offline-capable)

---

## Future Enhancements

### Phase 2 (Potential)
1. **Multi-language**: Support local languages (Zulu, Xhosa, Swahili)
2. **Emotion Detection**: Analyze voice tone for distress
3. **Personalization**: Remember user preferences
4. **Journal Export**: Save key reflections
5. **Progress Tracking**: Wellness trends over time
6. **Group Sessions**: Peer support circles
7. **Therapist Matching**: AI-based professional recommendations

### Phase 3 (Advanced)
1. **Video Avatar**: 3D animated character
2. **Real-time Lip-Sync**: Viseme mapping
3. **Gesture Recognition**: Body language analysis
4. **Ambient Sounds**: Calming background audio
5. **VR Integration**: Immersive wellness spaces

---

## Success Metrics

### Engagement
- Sessions per student per week
- Average session duration
- Return rate (repeat users)

### Effectiveness
- Concern level reduction over sessions
- Professional referral acceptance rate
- User satisfaction ratings

### Safety
- Crisis detection accuracy
- Time to professional contact
- Follow-up completion rate

---

## Accessibility

### WCAG Compliance
- **Visual**: High-contrast colors, large text
- **Auditory**: Text transcript always visible
- **Motor**: Large touch targets, keyboard navigation
- **Cognitive**: Simple, clear language, one task at a time

### Inclusive Design
- **Low Bandwidth**: No external resources
- **Low-End Devices**: Browser-native APIs are lightweight
- **Cultural Sensitivity**: Neutral, respectful language
- **Age-Appropriate**: Teen-focused tone and examples

---

## Support & Maintenance

### Browser Updates
- Monitor Web Speech API changes
- Test across browser versions quarterly
- Update voice preferences as new voices available

### Content Updates
- Review dialogue responses monthly
- Add new wellness strategies
- Update volunteer database

### User Feedback
- Collect feedback via wellness hub
- Iterate on response quality
- Expand keyword detection

---

## Conclusion

The Mental Wellness Voice Companion represents a paradigm shift from text-based chatbots to immersive, empathetic voice experiences. By removing traditional chat interfaces and focusing on voice-first interaction with an expressive avatar, we create a more natural, accessible, and emotionally supportive tool for students.

**Key Differentiators**:
- ✨ Voice-first, no typing required
- 🎭 Expressive animated avatar
- 🧠 Intelligent concern tracking
- 🤝 Direct connection to real psychologists
- 🔒 Privacy-first, local processing
- 📱 Accessible on any modern browser

This feature directly supports student mental health, academic success, and overall wellbeing - core pillars of the ntwanaAfrika educational platform.
# Mental Wellness Voice Companion - Feature Specification

## Overview
The **Mental Wellness Voice Companion** is a voice-first, avatar-based emotional support system designed specifically for students. It replaces traditional text-based chatbots with an immersive, empathetic conversational experience powered by voice recognition and speech synthesis.

---

## Core Features

### 1. Voice Recognition (Speech-to-Text)
- **Technology**: Web Speech API (browser-native)
- **Language**: English (US) with support for multiple accents
- **Mode**: Continuous listening with interim results
- **Accuracy**: High-accuracy real-time transcription
- **Features**:
  - Always-on listening mode while active
  - Automatic voice activity detection
  - Real-time transcript display for accessibility
  - Graceful error handling and fallback

### 2. Voice Output (Text-to-Speech)
- **Technology**: SpeechSynthesis API (browser-native)
- **Voice**: Natural-sounding female voice (browser-optimized)
- **Characteristics**:
  - Calm, empathetic, and clear tone
  - Adjustable speech rate (0.9x for clarity)
  - Normal pitch (1.0) for naturalness
  - Full volume (1.0) with user mute control
- **Features**:
  - Synchronized with avatar animations
  - Automatic continuation after speaking
  - Mute/unmute controls

### 3. Animated Avatar
The avatar is a dynamic, emotion-responsive visual companion that enhances the user experience.

#### Avatar States & Animations
1. **Idle State** 😊
   - Color: Pink gradient (from-pink-400 to-pink-600)
   - Animation: Gentle breathing effect
   - Emoji: Smiling face
   - Message: "Ready to listen"

2. **Listening State** 👂
   - Color: Blue gradient (from-blue-400 to-blue-600)
   - Animation: Pulsing effect (animate-pulse)
   - Emoji: Ear symbol
   - Badge: "Listening..." with microphone icon
   - Message: "I'm listening..."

3. **Thinking State** 🤔
   - Color: Purple gradient (from-purple-400 to-purple-600)
   - Animation: Bouncing effect (animate-bounce)
   - Emoji: Thinking face
   - Badge: "Thinking..." with loading spinner
   - Message: "Let me think about that..."

4. **Speaking State** 💬
   - Color: Green gradient (from-green-400 to-green-600)
   - Animation: Pulsing effect (animate-pulse)
   - Emoji: Speech bubble
   - Badge: "Speaking..." with volume icon
   - Message: "Here's what I think..."

#### Visual Specifications
- **Size**: 192px × 192px (w-48 h-48)
- **Shape**: Circular (rounded-full)
- **Shadow**: Deep shadow for depth (shadow-2xl)
- **Emoji Size**: 8xl (96px font size)
- **Transitions**: Smooth 300ms duration

### 4. Interaction Flow

```
User Opens Companion
        ↓
Avatar: Idle → Auto-greet with voice
        ↓
User clicks "Start Listening"
        ↓
Avatar: Listening (pulsing blue) + "Listening..." badge
        ↓
User speaks (continuous capture)
        ↓
Interim transcript displayed in real-time
        ↓
User stops speaking (silence detected)
        ↓
Avatar: Thinking (bouncing purple) + "Thinking..." badge
        ↓
AI analyzes input (800ms processing)
        ↓
Avatar: Speaking (pulsing green) + "Speaking..." badge
        ↓
TTS speaks response with lip-sync simulation
        ↓
Avatar: Listening (auto-resume) → Ready for next input
```

### 5. Wellness Dialogue Engine

#### Intelligence System
The companion uses a sophisticated rule-based dialogue engine with concern level tracking:

**Concern Level Scale**: 0-10
- **0-3**: Low concern (neutral, positive)
- **4-5**: Mild concern (general stress)
- **6-7**: Moderate concern (persistent distress)
- **8-9**: High concern (severe distress)
- **10**: Crisis level (immediate intervention needed)

#### Category Detection & Responses

1. **Crisis (Level 10)**
   - Keywords: "suicide", "kill myself", "end it all", "want to die", "hurt myself"
   - Response: Immediate crisis intervention message
   - Action: Display crisis helpline (0800-567-567)
   - UI: Red alert banner with emergency contacts

2. **High Distress (Level 8-9)**
   - Keywords: "depressed", "hopeless", "can't go on", "no point", "give up", "worthless", "hate myself"
   - Response: Empathetic validation + professional help recommendation
   - Action: Show volunteer psychologists
   - UI: Orange warning banner

3. **Moderate Distress (Level 6-7)**
   - Keywords: "sad", "lonely", "anxious", "worried", "stressed", "scared", "overwhelmed", "can't sleep"
   - Responses:
     - **Anxiety**: Breathing exercise guide (4-4-6 technique)
     - **Sadness**: Validation + small coping strategies
     - **Stress**: Breaking down problems into smaller steps
   - Action: Recommend volunteer support if level ≥ 6

4. **Academic Stress (Level varies)**
   - Keywords: "exam", "test", "grades", "failing", "study", "homework", "school pressure"
   - Response: Academic-wellness balance guidance
   - Focus: Self-worth beyond grades + practical study strategies

5. **Positive/Neutral (Level 0-5)**
   - Keywords: "better", "good", "happy", "excited", "hopeful", "improving"
   - Response: Encouragement + reinforcement
   - Action: Decrease concern level by 1

#### Conversation Memory
- Tracks conversation history in array
- Monitors concern level trends
- Persistent evaluation across session

### 6. Interface Design (Voice-First)

#### What's REMOVED (as per requirements)
- ❌ Text input fields
- ❌ Scrolling chat history window
- ❌ Message bubbles
- ❌ Typing indicators
- ❌ Send buttons
- ❌ Chat history controls

#### What's INCLUDED (minimal UI)
- ✅ Large animated avatar (primary focus)
- ✅ Single-line transcript display (accessibility + confirmation)
- ✅ Current response text (visible during TTS)
- ✅ Microphone button (Start/Stop Listening)
- ✅ Mute button (toggle TTS)
- ✅ Status badges (Listening/Thinking/Speaking)
- ✅ Concern level alerts (when needed)
- ✅ Volunteer psychologist cards (when concern ≥ 6)

#### Layout Structure
```
┌─────────────────────────────────────────┐
│   Mental Wellness Companion Header      │
├─────────────────────────────────────────┤
│                                         │
│           [Animated Avatar]             │
│              (192x192px)                │
│          [Status Badge Below]           │
│                                         │
│     "Status: I'm listening..."          │
│     "Speak freely - I'm here for you"   │
│                                         │
├─────────────────────────────────────────┤
│  Transcript: "You said: '...'"          │
│  (Single line, gray box)                │
├─────────────────────────────────────────┤
│  Response: "My response: ..."           │
│  (Accent box, visible during TTS)       │
├─────────────────────────────────────────┤
│   [Start Listening] [Mute/Unmute]       │
│        (Large buttons)                  │
├─────────────────────────────────────────┤
│   [Concern Alert - if level ≥ 6]        │
│   [Crisis Alert - if level ≥ 9]         │
├─────────────────────────────────────────┤
│   [Volunteer Psychologists Grid]        │
│   (Shows when concern ≥ 6)              │
└─────────────────────────────────────────┘
```

### 7. Volunteer Psychologist Integration

#### Features
- **Auto-display**: Shows when concern level ≥ 6
- **Professional details**:
  - Name & credentials
  - Specialization (Clinical, Educational, Youth Counseling)
  - Contact info (email, phone)
  - Region & availability
- **Actions**:
  - Email contact (mailto: link)
  - Phone contact (tel: link)

