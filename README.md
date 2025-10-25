# 🎓 ntwanaAfrika - Learning Feeds the Future

**A gamified educational platform designed to empower underprivileged students across Africa through curriculum-aligned learning and real-world rewards.**

## 🌟 Overview

MwanAfrika is an innovative educational app that transforms learning into an engaging, rewarding experience for primary and secondary school students in underserved communities. By combining curriculum-aligned content with a gamification system, students earn "Skill Coins" that can be redeemed for essential items like food, hygiene products, airtime, and data bundles.

## 🎯 Mission

To bridge educational inequality in Africa by:

- Making quality education accessible and engaging
- Providing tangible incentives for learning through reward redemption
- Supporting student mental health and career aspirations
- Building learning communities that foster collaboration

## ✨ Key Features

### 📚 **Learning Modules**

- **Curriculum-aligned content** for Mathematics, Reading & Language, Science, and Life Skills
- **Progressive difficulty levels** with adaptive learning paths
- **Interactive lessons** with immediate feedback
- **Skill coin rewards** for completed activities

### 🏆 **Gamification System**

- **Level progression** with experience points and badges
- **Daily quests** and challenges
- **Streak tracking** to maintain learning consistency
- **Achievement unlocking** for various milestones

### 🎁 **Smart Rewards Marketplace with Location Intelligence**

- **Real-world Redemption**: Exchange Skill Coins for tangible rewards
- **Google Maps Integration**: Find nearby partner stores for pickup
- **Category-based Shopping**: Food & Nutrition, Hygiene & Health, Connectivity
- **Interactive Store Locator**: GPS location, distance calculation, store ratings
- **Seamless Navigation**: Get directions to selected redemption locations
- **Partner Network**: Local bakeries, pharmacies, mobile shops, supermarkets

### 🤖 **AI-Powered Tutor**

- **24/7 educational support** via WhatsApp-style interface
- **Subject-specific assistance** using Google Gemini AI
- **Step-by-step explanations** for complex concepts
- **Multilingual support** for local languages

### 🌈 **Dreamland Career Explorer**

- **Career path discovery** with detailed information
- **Skill requirements** and educational pathways
- **Salary insights** and job market trends
- **Local success stories** and mentorship connections

### 💚 **Mental Health Hub**

- **Mood tracking** and wellness check-ins
- **Crisis support resources** and helplines
- **Anonymous counseling chat**
- **Mental health tips** and coping strategies

### 👥 **Community Features**

- **School and regional leaderboards**
- **Peer collaboration** and study groups
- **Achievement sharing** and celebration
- **Multi-country support** (South Africa, Zimbabwe, Kenya, Zambia, Malawi)

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Lucide Icons** - Modern icon system

### Backend & Services

- **Google Gemini AI** - Conversational AI tutor
- **Google Maps Platform** - Location services and store finding
- **Vercel Analytics** - Performance monitoring
- **Local Storage** - User preferences and progress

### Google Maps Integration

- **Maps JavaScript API** - Interactive map displays
- **Places API** - Nearby store discovery
- **Geocoding API** - Address to coordinates conversion
- **Directions API** - Navigation to reward pickup locations

### Development Tools

- **npm/pnpm** - Package management
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Geist Font** - Modern typography
- **TypeScript** - Type definitions for Google Maps

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/pnpm package manager
- Google Gemini API key
- Google Maps API key (for location features)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/CassieGeraldine/eduFeed.git
cd eduFeed
```

2. **Install dependencies**

```bash
npm install
# or if using pnpm
pnpm install
```

3. **Set up environment variables**
   Create a `.env.local` file:

```env
# Google Gemini AI (for tutoring features)
GOOGLE_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Google Maps Platform (for location features)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3.1. **Enable Google Cloud APIs** (for Maps features):

- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Enable: Maps JavaScript API, Places API, Geocoding API, Directions API
- Create API key with appropriate restrictions

4. **Run the development server**

```bash
npm run dev
# or if using pnpm
pnpm dev
```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
# or if using pnpm
pnpm build && pnpm start
```

## 📱 Enhanced User Journey with Location Intelligence

1. **Onboarding**: Select country and preferred language
2. **Dashboard**: View progress, quests, and achievements
3. **Learning**: Complete curriculum-aligned lessons
4. **Earn Coins**: Gain rewards for educational activities
5. **Smart Redemption**:
   - Browse rewards marketplace by category
   - Click "Redeem" → Location finder opens
   - Search nearby stores or use GPS location
   - View interactive map with partner stores
   - Select preferred store location
   - Generate voucher with pickup details
   - Get directions via Google Maps
6. **Community**: Compete and collaborate with peers
7. **Support**: Access AI tutor and mental health resources

## 🌍 Supported Regions

- **🇿🇦 South Africa** - English, isiXhosa, isiZulu, Afrikaans
- **🇿🇼 Zimbabwe** - English, Shona, Ndebele
- **🇰🇪 Kenya** - English, Swahili, Kikuyu
- **🇿🇲 Zambia** - English, Bemba, Nyanja, Tonga
- **🇲🇼 Malawi** - English, Chichewa, Tumbuka

## 🗺️ Location-Based Marketplace Features

### **Smart Store Discovery**

- **Category Filtering**: Food stores, pharmacies, mobile shops
- **Distance Calculation**: Real-time proximity to user location
- **Store Information**: Ratings, opening hours, contact details
- **Interactive Maps**: Custom markers, zoom controls, satellite view

### **Redemption Process**

1. **Browse Rewards** → Select item to redeem
2. **Find Locations** → Search address or use GPS
3. **Choose Store** → View nearby options on map/list
4. **Generate Voucher** → Get pickup code with store details
5. **Navigate** → Direct Google Maps integration
6. **Collect Reward** → Show voucher code at partner store

### **Partner Integration**

- **Local Businesses**: Ubuntu Bakery, Health Plus, MTN stores
- **Real-time Data**: Store availability and operating status
- **Voucher System**: Secure redemption codes with expiration
- **Geographic Coverage**: Optimized for African urban and rural areas

## 🎮 Gamification Elements

- **XP Points**: Earned through lesson completion
- **Skill Coins**: Currency for reward redemption
- **Streaks**: Daily learning consistency tracking
- **Badges**: Achievement recognition system
- **Leaderboards**: School and regional competition
- **Daily Quests**: Targeted learning objectives

## �️ Troubleshooting

### **"Failed to fetch location data" Error**

1. Check your Google Maps API key in `.env.local`
2. Ensure all required APIs are enabled in Google Cloud Console
3. Verify API key restrictions allow your domain
4. Restart development server after environment changes

### **Maps not loading**

1. Check browser console for API errors
2. Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
3. Ensure Maps JavaScript API is enabled
4. Check internet connectivity

### **No stores found**

1. Try different search locations (urban areas work best)
2. Increase search radius in the code if needed
3. Verify Places API is enabled and working
4. Check if location has sufficient business data

For detailed setup instructions, see `GOOGLE_MAPS_SETUP.md`

## �🔒 Privacy & Safety

- **Anonymous mental health support**
- **Secure data handling**
- **Location privacy protection**
- **Age-appropriate content**
- **Crisis intervention resources**
- **Local privacy law compliance**

## 🤝 Contributing

We welcome contributions from educators, developers, and community members! Please see our contributing guidelines and code of conduct.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support & Resources

- **Technical Support**: GitHub Issues
- **Educational Content**: Contact curriculum team
- **Partnerships**: Business development team
- **Crisis Support**: Integrated helplines and resources

## 📈 Impact Goals

- **Educational Access**: Serve 100,000+ students across Africa
- **Learning Outcomes**: Improve academic performance by 30%
- **Essential Needs**: Provide 1M+ reward redemptions at 10,000+ partner stores
- **Economic Impact**: Support local businesses through student reward spending
- **Geographic Reach**: Cover urban and rural areas across 5 African countries
- **Mental Health**: Support 10,000+ wellness check-ins
- **Career Guidance**: Connect students with 500+ mentors
- **Digital Inclusion**: Bridge online learning with offline community benefits

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- African educational partners and schools
- Local community organizations
- Mental health professionals
- Open source contributors
- Students and families using the platform

---

**"Education is the most powerful weapon which you can use to change the world."** - Nelson Mandela

_Building the future of African education, one lesson at a time._ 🌍✨
