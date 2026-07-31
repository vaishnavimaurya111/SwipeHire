# ⚡ SwipeHire – AI-Powered Job & Internship Matching Platform

> **Tagline**: *"Swipe Right on Your Dream Career."*

SwipeHire is a full-stack, Tinder-style job and candidate matching web application built with **React, Node.js, Express, MongoDB, Socket.io, Framer Motion, Tailwind CSS, and Google Gemini AI**. 

It transforms traditional candidate recruitment into an engaging, interactive card-swiping experience with real physics, automated AI resume scoring, skill-gap analysis, real-time messaging, and interactive analytics.

---

## 🎬 Features Overview

### 1. 🌟 Opening Splash Animation (<SplashScreen />)
- Full-screen opening splash screen with brand gradient (`#0c081e` → `#1a0f35` → `#2c0e29`).
- **Card-Stack Flying Entrance**: Interactive card graphic snaps into place with a subtle pulsing heartbeat.
- **Letter-by-Letter Entrance**: "SwipeHire" text animates onto the screen with staggered spring physics.
- **Tagline Fade-In**: *"Swipe Right on Your Dream Career."* fades in smoothly underneath.
- 2–3 second duration before seamlessly transitioning into the main application.

### 2. 🔥 Swipe Deck & Card Physics (Main USP)
- Real drag-and-release physics powered by `Framer Motion` (`useMotionValue`, `useTransform`).
- **Interactive Tilting**: Card tilts dynamically based on drag direction and speed.
- **Color-Coded Overlays**:
  - 🟢 **Green Overlay**: Interested (Swipe Right)
  - 🔴 **Red Overlay**: Skip (Swipe Left)
  - 🔵 **Blue Overlay**: Super Like (Swipe Up)
  - 🟡 **Yellow Overlay**: Save for Later (Swipe Down)
- Micro-animations on floating action buttons (X, Save, Superlike, Like).
- Filter Drawer for Location, Remote/Hybrid workplace, Tech Stack, and Salary.

### 3. 🎉 Match Celebration System
- Mutual right swipes trigger an animated **"It's a Match 🎉"** modal.
- Celebratory **Canvas Confetti** explosion.
- Dual avatar profile display with quick action to open a direct messaging channel.

### 4. 🤖 AI Powered Features (Gemini 2.5 Flash API)
- **AI Resume Score & Feedback**: Rates resumes out of 100 with actionable strengths, weaknesses, and missing industry keywords.
- **AI Cover Letter Generator**: Generates 1-click tailored cover letters specific to candidate profiles and job posts.
- **AI Job Fit & Skill Gap Analysis**: Calculates compatibility percentage and recommends learning courses to bridge missing skill gaps.

### 5. 💬 Real-Time Messaging & Chat
- Socket.io live WebSocket chat engine with HTTP REST API fallback.
- Send messages, view attachment previews, and schedule interviews with calendar invite widgets.
- Real-time notification toasts for new matches and interview requests.

### 6. 📊 Analytics & Performance Dashboard
- **Animated Stat Counters**: Count-up numbers for applications sent, total matches, conversion rates, and profile views.
- **Recharts Data Visualization**: Interactive weekly activity graphs and hiring conversion funnels.

### 7. 👤 Dual Role Management (Student vs Recruiter)
- **Student Role**: Swipe on job openings, track applications, analyze resume, generate cover letters.
- **Recruiter Role**: Post new job openings, swipe on student profiles, manage applicant funnel, schedule interviews.
- **1-Click Demo Logins**: Instant role switcher to test both Student and Recruiter views seamlessly.

---

## 🛠️ Project Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v3, Framer Motion, Lucide Icons, Canvas Confetti, Recharts, Socket.io-client.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT, bcryptjs, @google/genai, Multer.
- **Deployment Ready**: `vercel.json` (Frontend), `render.yaml` (Backend), MongoDB Atlas.

---

## 📁 Repository Structure

```
SwipeHire/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SplashScreen.jsx     # 🎬 2-3s Opening Animation Component
│   │   │   ├── Navbar.jsx           # Glassmorphism Navigation & Role Toggle
│   │   │   ├── SwipeDeck.jsx        # Tinder Card Stack & Action Buttons
│   │   │   ├── SwipeCard.jsx        # Draggable Card with Tilt & Overlays
│   │   │   ├── MatchModal.jsx       # "It's a Match 🎉" Confetti Modal
│   │   │   ├── AiResumeAnalyzer.jsx # AI Resume Score & Feedback Widget
│   │   │   ├── AiCoverLetterModal.jsx# AI Cover Letter Generator
│   │   │   ├── SkillGapModal.jsx    # Skill Gap Radar & Learning Recs
│   │   │   ├── ChatWindow.jsx       # Real-Time Socket.io Chat Interface
│   │   │   ├── StatCounter.jsx      # Animated Count-up Numbers
│   │   │   └── NotificationToast.jsx# Slide-in Alert Toasts
│   │   ├── pages/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── StudentProfilePage.jsx
│   │   │   ├── MessagesPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AiHubPage.jsx
│   │   │   └── AuthPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB Mongoose Connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── swipeController.js
│   │   ├── aiController.js
│   │   ├── chatController.js
│   │   └── analyticsController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Swipe.js
│   │   ├── Match.js
│   │   ├── Chat.js
│   │   ├── Application.js
│   │   └── Notification.js
│   ├── routes/
│   │   └── api.js
│   ├── services/
│   │   ├── aiService.js         # Gemini API Wrapper & Fallbacks
│   │   └── socket.js            # Socket.io Event Handlers
│   ├── index.js
│   ├── seed.js                  # Database Demo Seed Generator
│   └── package.json
├── .env.example
├── vercel.json
├── render.yaml
├── package.json                 # Root script runner (concurrently)
└── README.md
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
Install root, server, and client dependencies:
```bash
# In the root directory:
npm run setup
```

### 3. Environment Configuration
Copy `.env.example` to `.env` in the `server/` directory:
```bash
# Optional API Keys - The app includes robust fallback simulators if keys are omitted
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/swipehire
JWT_SECRET=your_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```


---



## 📄 License
MIT © 2026 SwipeHire Team. "Swipe Right on Your Dream Career."
