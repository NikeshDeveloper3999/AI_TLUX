# Tlux AI — Voice-Enabled AI Assistants for Your Website

A full-stack platform for creating customizable, voice-enabled AI assistants that embed on any website. Configure your assistant's persona, tone, appearance, and voice navigation — then drop a single `<script>` tag to add it to your site.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend (SPA)** | React 19, React Router 7, Vite 8, Tailwind CSS v4, Axios, Firebase Auth |
| **Backend (API)** | Express 5, Mongoose 9, MongoDB, JWT |
| **AI** | Google Gemini API (bring-your-own-key) |
| **Embedded Widget** | Vanilla JS (IIFE), Web Speech API |

---

## Project Structure

```
TluxAiEmbading/
├── FrontEnd/                      # React SPA (Vite)
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AssistantPreview.jsx   # Interactive phone mockup (4 themes)
│   │   │   ├── Navbar.jsx            # App navigation + user menu
│   │   │   ├── ProtectedRoute.jsx    # Auth gate with loading spinner
│   │   │   └── Icons.jsx             # Reusable SVG icons (Flame, Sparkle, Robot, etc.)
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Marketing landing page
│   │   │   ├── Login.jsx             # Google OAuth login
│   │   │   ├── Builder.jsx           # Assistant config dashboard + editor
│   │   │   └── Settings.jsx          # Dark mode toggle, delete account
│   │   ├── Context/
│   │   │   └── ThemeContext.jsx       # Dark/light site theme (localStorage + server sync)
│   │   ├── utils/
│   │   │   └── firebase.js           # Firebase init + Google Auth provider
│   │   ├── App.jsx                   # Root router + user state
│   │   ├── main.jsx                  # Entry point (BrowserRouter)
│   │   └── index.css                 # Tailwind CSS v4 + custom animations
│   ├── public/
│   │   ├── assistant.js              # Embeddable widget script (vanilla JS)
│   │   ├── assistant.css             # Widget styles (4 themes + animations)
│   │   ├── logo.png
│   │   └── mic.svg
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── BackEnd/                        # Express API
    ├── Configs/
    │   ├── ConnectDB.js            # MongoDB connection (Mongoose)
    │   ├── gemini.js               # Google Gemini API client
    │   └── token.js                # JWT generation
    ├── Controllers/
    │   ├── auth.controller.js      # Google sign-in/signup, logout
    │   ├── user.controller.js      # Get user, save assistant, save theme, delete account
    │   └── assistant.controller.js # Public config, chat + navigation logic
    ├── Middleware/
    │   └── isAuth.js               # JWT cookie verification
    ├── Models/
    │   └── user.model.js           # User schema + assistant config + page subdocuments
    ├── Routes/
    │   ├── auth.route.js           # /api/auth/*
    │   ├── user.route.js           # /api/user/*
    │   └── assistant.route.js      # /api/assistant/*
    ├── .env
    ├── index.js                    # Express entry point
    └── package.json
```

---

## Features

### Authentication
- Google OAuth via Firebase SDK. New users auto-registered on first sign-in.
- JWT stored in an `httpOnly` cookie (XSS-safe), lasting 7 days.
- Protected routes redirect to `/login` when unauthenticated.

### Assistant Builder
Configure your AI assistant with:

| Section | Fields |
|---|---|
| **Info** | Assistant name, business name, business type, business description |
| **Appearance** | Theme (dark / light / glass / neon), tone (friendly / professional / sales), voice (male / female) |
| **API Key** | Your Google Gemini API key (status tracked: active / invalid / quota_exceeded) |
| **Pages** | Navigation pages with name, path, and voice trigger keywords |

### AI Chat
- Users interact with the assistant via a public API endpoint (`POST /api/assistant/ask`).
- The assistant first checks for **navigation commands** (e.g., "go to pricing") by matching user-defined keywords.
- If no navigation match, it falls back to **Google Gemini AI** with a system prompt built from your business context.
- Responses are constrained to **under 15 words** for optimal voice playback.

### Voice Support
- **Speech Recognition** (Web Speech API) — users speak their queries.
- **Text-to-Speech** — the assistant speaks its responses.
- Voice can be toggled on/off. Navigation commands work via voice.

### Embeddable Widget
Once configured, paste this script tag before `</body>` on any website:

```html
<script src="https://yourdomain.com/assistant.js" data-user-id="YOUR_USER_ID"></script>
```

The widget loads the assistant's public config (theme, name, tone) and renders a floating chat button with a full popup interface including:
- Theme-aware styling (4 themes with warm/pastel variants)
- Animated shimmer orb, mic pulse, and wave visualization
- Voice input button with speech recognition
- Responsive mobile layout

### Settings
- **Dark mode toggle** — persists to both `localStorage` and the server.
- **Delete account** — permanent deletion with confirmation modal.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Firebase project (for Google Auth)
- Google Gemini API key

### Environment Variables

**Backend** (`BackEnd/.env`)
```
PORT=8000
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tluxai
JWT_SECRET=your_jwt_secret
```

**Frontend** (`FrontEnd/.env`)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

### Run Locally

```bash
# Backend
cd BackEnd
npm install
npm run dev        # http://localhost:8000

# Frontend (separate terminal)
cd FrontEnd
npm install
npm run dev        # http://localhost:5173
```

### Production Build

```bash
cd FrontEnd
npm run build      # outputs to FrontEnd/dist/
```

---

## API Reference

| Method | Endpoint | Auth | CORS | Purpose |
|---|---|---|---|---|
| `POST` | `/api/auth/google` | — | Private | Google sign-in/signup |
| `GET` | `/api/auth/logout` | Cookie | Private | Clear JWT cookie |
| `GET` | `/api/user/current-user` | Cookie | Private | Get authenticated user |
| `POST` | `/api/user/save-assistant` | Cookie | Private | Save assistant config |
| `POST` | `/api/user/save-site-theme` | Cookie | Private | Save dark/light preference |
| `DELETE` | `/api/user/delete-account` | Cookie | Private | Delete user and all data |
| `GET` | `/api/assistant/config/:userId` | — | Public | Get public config for widget |
| `POST` | `/api/assistant/ask` | — | Public | Chat with AI assistant |

### Chat API Example

```json
POST /api/assistant/ask
Body: { "message": "Show me pricing", "userId": "abc123", "currentPath": "/home" }

Response (navigation):
{ "action": "navigate", "path": "/pricing", "response": "Opening Pricing" }

Response (AI):
{ "success": true, "aiResponse": "Our pricing starts at $19/month." }
```

---

## Architecture Overview

```
Browser
  ├── React SPA (localhost:5173) ─── axios ───► Express API (localhost:8000)
  │   (auth, builder, settings)                    ├── MongoDB (user data)
  │                                                 └── Gemini API (AI responses)
  │
  └── External Website ─── <script> ──► assistant.js (vanilla JS widget)
          (embed)                       └── GET /api/assistant/config/:userId
                                        └── POST /api/assistant/ask
```

- **Dual CORS**: Auth/user routes restricted to SPA origin; assistant routes open to any origin (for embeds).
- **BYOK (Bring Your Own Key)**: Users supply their own Gemini API key — the platform covers no AI costs.
- **Navigation System**: Before calling AI, the backend matches user messages against defined page keywords for client-side routing.
- **Web Speech API**: The embeddable widget uses the browser's built-in SpeechRecognition and SpeechSynthesis — no additional SDK required.

---

## Data Model

### User (MongoDB)

| Field | Type | Description |
|---|---|---|
| `name` | String | Google display name |
| `email` | String (unique) | Google email |
| `assistantName` | String | AI assistant name |
| `businessName/Type/Description` | String | Business context for AI prompts |
| `tone` | enum | `friendly`, `professional`, `sales` |
| `theme` | enum | `light`, `dark`, `glass`, `neon` |
| `voice` | enum | `male`, `female` |
| `enableVoice` | Boolean | Toggle speech recognition |
| `enableNavigation` | Boolean | Toggle voice navigation |
| `pages` | [Page] | Navigation page definitions |
| `geminiApiKey` | String | Encrypted user API key |
| `geminiStatus` | enum | `active`, `invalid`, `quota_exceeded` |
| `totalMessages` | Number | Usage counter |
| `isSetupComplete` | Boolean | Builder completion flag |
| `siteTheme` | enum | `light`, `dark` |

### Page (embedded subdocument)

| Field | Type | Description |
|---|---|---|
| `name` | String | Display name (e.g. "Pricing") |
| `path` | String | URL path (e.g. `/pricing`) |
| `keywords` | [String] | Voice trigger keywords (e.g. `["pricing", "plans", "cost"]`) |


Primary Category
AI SaaS Platform

Users:
Sign up with Google
Create and customize AI assistants
Configure business data
Add navigation commands
Use their own Gemini API key
Embed the assistant on any website
---

## License

MIT
