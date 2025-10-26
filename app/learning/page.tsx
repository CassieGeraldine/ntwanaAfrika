import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { BookOpen, Brain, Volume2, Search, Loader2, Zap, Palette, User, Settings, LogOut, CheckCircle, Target } from 'lucide-react';

// --- Global Environment Variables (Mandatory Setup) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const apiKey = ""; // API key is left empty and handled by the runtime

// --- App Component ---
const App = () => {
  // --- Firebase and Auth State ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- App State ---
  const [view, setView] = useState('subjects'); // 'subjects', 'topics', 'content'
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMode, setSelectedMode] = useState('Standard');
  const [generatedContent, setGeneratedContent] = useState('');
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Static Data (Mimicking User's App Structure) ---
  const subjects = [
    { id: 'math', name: 'Mathematics', icon: Brain, topics: ['Numbers', 'Patterns', 'Problem Solving'] },
    { id: 'lang', name: 'Reading & Language', icon: BookOpen, topics: ['Phonics', 'Vocabulary', 'Comprehension'] },
  ];

  const currentTopics = useMemo(() => {
    return subjects.find(s => s.id === selectedSubject)?.topics || [];
  }, [selectedSubject]);

  const learningModes = [
    { name: 'Standard', icon: BookOpen, description: 'Default text and visual-based learning.' },
    { name: 'Auditory/Blind', icon: Volume2, description: 'Highly descriptive content optimized for screen readers and listening. (Blind/Visually Impaired)' },
    { name: 'Dyslexia-Friendly', icon: Palette, description: 'Simplified language and clear structure. (Dyslexia/Cognitive)' },
    { name: 'ADHD/Kinesthetic', icon: Zap, description: 'Short, engaging chunks with mental exercises and activities. (ADHD/Kinesthetic)' },
  ];

  // --- Firebase Initialization and Authentication ---
  useEffect(() => {
    try {
      if (Object.keys(firebaseConfig).length === 0) {
        console.error("Firebase config is missing. App will run without Firestore/Auth.");
        setIsAuthReady(true);
        return;
      }
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);

      setAuth(authInstance);
      setDb(dbInstance);

      // Sign in or set up auth listener
      const authenticate = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authInstance, initialAuthToken);
          } else {
            await signInAnonymously(authInstance);
          }
        } catch (e) {
          console.error("Firebase Auth Error:", e);
        }
      };

      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUserId(user.uid);
        }
        setIsAuthReady(true);
      });

      authenticate();
      return () => unsubscribe();

    } catch (e) {
      console.error("Failed to initialize Firebase:", e);
      setIsAuthReady(true);
    }
  }, []);

  // --- Gemini API Content Generation ---
  const generateLearningContent = useCallback(async (topic, mode) => {
    if (!auth || !isAuthReady) {
        setError("Authentication is not ready. Please wait.");
        return;
    }

    setIsLoading(true);
    setGeneratedContent('');
    setSources([]);
    setError(null);

    let systemInstruction = "You are a friendly, expert tutor. Generate an educational lesson about the following topic.";

    // Adjust system instruction based on learning mode
    switch (mode) {
      case 'Auditory/Blind':
        systemInstruction = "You are a detailed, descriptive auditory tutor. Provide a step-by-step, highly clear, and detailed explanation suitable for someone listening to a screen reader. Avoid complex visual jargon and use concrete language. Structure the content with clear headings and enumerated lists for easy navigation.";
        break;
      case 'Dyslexia-Friendly':
        systemInstruction = "You are a clear and concise tutor. Use short sentences, simple vocabulary (Grade 5 reading level), and break the content into very short paragraphs. Maintain a highly organized, bulleted list or short section format. Focus on one core concept at a time.";
        break;
      case 'ADHD/Kinesthetic':
        systemInstruction = "You are an energetic and engaging activity guide. Deliver the lesson in highly focused, action-oriented chunks. Every 1-2 paragraphs, include a 'Quick Challenge' or 'Do This Now' section that requires mental or physical participation to maintain engagement. Keep the tone lively.";
        break;
      case 'Standard':
      default:
        systemInstruction = "You are a friendly, expert tutor. Generate an educational lesson about the following topic.";
        break;
    }

    const userQuery = `Generate a lesson on the topic: "${topic}".`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
    };

    const fetchContent = async (attempt = 0) => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorDetail = await response.text();
          throw new Error(`API call failed: ${response.status} - ${errorDetail}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
          const text = candidate.content.parts[0].text;
          setGeneratedContent(text);

          let newSources = [];
          const groundingMetadata = candidate.groundingMetadata;
          if (groundingMetadata && groundingMetadata.groundingAttributions) {
            newSources = groundingMetadata.groundingAttributions
              .map(attribution => ({
                uri: attribution.web?.uri,
                title: attribution.web?.title,
              }))
              .filter(source => source.uri && source.title);
          }
          setSources(newSources);

        } else {
          setError("Content generation failed: Empty response received.");
        }
      } catch (e) {
        if (attempt < 3) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          await fetchContent(attempt + 1); // Retry
        } else {
          console.error("Max retries reached:", e);
          setError(`Error generating content: ${e.message}`);
        }
      } finally {
        if (attempt === 0) setIsLoading(false); // Only set loading to false on final attempt result
      }
    };

    await fetchContent();
    setIsLoading(false);

  }, [auth, isAuthReady]);

  // --- Handlers ---
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setView('content');
    generateLearningContent(topic, selectedMode);
  };

  const handleSelectMode = (modeName) => {
    setSelectedMode(modeName);
    // If we are already viewing content, regenerate it for the new mode
    if (view === 'content' && selectedTopic) {
      generateLearningContent(selectedTopic, modeName);
    }
  };

  // --- Navigation Components ---

  const Sidebar = () => (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4 flex flex-col fixed top-0 left-0">
      <h1 className="text-xl font-bold mb-8">ntwanaAfriika</h1>
      <p className="text-sm text-gray-400 mb-6">Learning feeds the future</p>
      <nav className="space-y-2 flex-grow">
        {['Dashboard', 'Learning Modules', 'Rewards', 'Community'].map(item => (
          <button key={item} className={`w-full text-left p-3 rounded-lg flex items-center transition duration-150 ${item === 'Learning Modules' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-700'}`}>
            <BookOpen className="w-5 h-5 mr-3" />
            {item}
          </button>
        ))}
        {['Profile', 'Settings', 'Sign Out'].map(item => (
          <button key={item} className={`w-full text-left p-3 rounded-lg flex items-center transition duration-150 mt-4 hover:bg-slate-700`}>
            {item === 'Sign Out' ? <LogOut className="w-5 h-5 mr-3" /> : item === 'Settings' ? <Settings className="w-5 h-5 mr-3" /> : <User className="w-5 h-5 mr-3" />}
            {item}
          </button>
        ))}
      </nav>
      <div className="mt-8 text-sm border-t border-slate-700 pt-4">
        {userId ? (
            <p className="text-gray-400">User ID: <span className="text-white break-words">{userId}</span></p>
        ) : (
            <p className="text-gray-400">Authenticating...</p>
        )}
      </div>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <h2 className="text-2xl font-semibold">Learning Center</h2>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          <p>Current Mode:</p>
          <p className="font-medium text-teal-600">{selectedMode}</p>
        </div>
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );

  const Breadcrumbs = () => {
    const segments = [];
    segments.push({ label: 'Learning Modules', onClick: () => setView('subjects') });

    if (selectedSubject) {
      segments.push({ label: selectedSubject, onClick: () => {
        setView('topics');
        setSelectedTopic(null);
        setGeneratedContent('');
      }});
    }

    if (selectedTopic) {
      segments.push({ label: selectedTopic, onClick: () => {} });
    }

    return (
      <nav className="text-sm font-medium text-gray-500 mb-6">
        {segments.map((segment, index) => (
          <span key={index}>
            <button
              onClick={segment.onClick}
              className={`hover:text-teal-600 ${index === segments.length - 1 ? 'text-teal-600 cursor-default' : 'text-gray-500'}`}
              disabled={index === segments.length - 1}
            >
              {segment.label}
            </button>
            {index < segments.length - 1 && <span className="mx-2">/</span>}
          </span>
        ))}
      </nav>
    );
  };

  // --- View Components ---

  const SubjectListView = () => (
    <>
      <h3 className="text-xl font-semibold mb-4">Choose Your Subject</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map(subject => (
          <button
            key={subject.id}
            onClick={() => {
              setSelectedSubject(subject.id);
              setView('topics');
            }}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 text-left border border-gray-100"
          >
            <div className={`p-3 rounded-lg w-fit mb-3 ${subject.id === 'math' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
              <subject.icon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold mb-1">{subject.name}</h4>
            <p className="text-sm text-gray-500">
              {subject.id === 'math' ? 'Numbers, patterns, and problem solving' : 'Stories, comprehension, and vocabulary'}
            </p>
            <div className="mt-4 text-xs text-teal-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" /> 0 topics completed
            </div>
          </button>
        ))}
      </div>
    </>
  );

  const TopicListView = () => (
    <>
      <Breadcrumbs />
      <h3 className="text-xl font-semibold mb-6">{selectedSubject} Topics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTopics.map(topic => (
          <button
            key={topic}
            onClick={() => handleSelectTopic(topic)}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-left border border-gray-100 flex justify-between items-center"
          >
            <div>
              <h4 className="text-lg font-bold mb-1">{topic}</h4>
              <p className="text-sm text-gray-500">Ready to learn</p>
            </div>
            <div className="p-2 bg-teal-500 text-white rounded-full">
              <span className="font-semibold">Start</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );

  const ContentView = () => {
    const modeStyle = useMemo(() => {
      // Styles for different learning disabilities
      if (selectedMode === 'Dyslexia-Friendly') {
        return {
          fontFamily: 'Open Dyslexic, sans-serif', // Assuming Open Dyslexic is available or similar
          lineHeight: 1.8,
          letterSpacing: '0.1em',
          backgroundColor: '#FFFFEE', // light cream background
          color: '#333',
        };
      }
      return {};
    }, [selectedMode]);

    return (
      <>
        <Breadcrumbs />
        <h3 className="text-2xl font-bold mb-4">{selectedTopic} Lesson</h3>
        <div className="flex items-center space-x-2 mb-6 p-3 bg-teal-50 border-l-4 border-teal-500 rounded-lg">
          <Target className="w-5 h-5 text-teal-600" />
          <p className="text-sm text-teal-700 font-medium">
            Viewing content in **{selectedMode} Mode** optimized for your learning style.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg min-h-[400px]" style={modeStyle}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
              <p className="font-semibold">Generating lesson content for {selectedTopic}...</p>
              <p className="text-sm mt-1">Optimizing output for **{selectedMode}** mode...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 p-4 border border-red-300 rounded bg-red-50">
              <h4 className="font-bold">Generation Error</h4>
              <p>{error}</p>
              <p className="mt-2 text-sm">Please try selecting a different mode or topic.</p>
            </div>
          ) : (
            <>
              {/* Render the generated content as raw HTML/Markdown output */}
              <div
                className={`prose max-w-none ${selectedMode === 'Dyslexia-Friendly' ? 'text-lg' : ''}`}
                dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br/>') }}
              ></div>

              {sources.length > 0 && (
                <div className="mt-8 border-t pt-4 text-xs text-gray-500">
                  <p className="font-semibold mb-2">Sources:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    {sources.map((src, index) => (
                      <li key={index}>
                        <a href={src.uri} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                          {src.title || src.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-8">
            <button
                onClick={() => setView('subjects')}
                className="text-teal-600 font-medium hover:text-teal-800 transition duration-150"
            >
                ← Back to Subjects
            </button>
        </div>
      </>
    );
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <Header />

        {/* Learning Mode Selector */}
        <div className="my-8">
          <h3 className="text-xl font-semibold mb-4">Choose Your Learning Mode (Accessibility Settings)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {learningModes.map(mode => (
              <button
                key={mode.name}
                onClick={() => handleSelectMode(mode.name)}
                className={`p-4 rounded-xl text-left transition duration-200 shadow-md border-2 ${
                  selectedMode === mode.name
                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <mode.icon className={`w-6 h-6 mb-2 ${selectedMode === mode.name ? 'text-teal-600' : 'text-gray-500'}`} />
                <p className="font-bold text-sm">{mode.name}</p>
                <p className="text-xs text-gray-500 mt-1">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {view === 'subjects' && <SubjectListView />}
          {view === 'topics' && <TopicListView />}
          {view === 'content' && <ContentView />}
        </div>
      </div>
    </div>
  );
};

export default App;
