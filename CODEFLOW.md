# Tlux AI — Code Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │              React SPA (Vite)                     │   │
│  │  localhost:5173                                   │   │
│  │                                                   │   │
│  │  main.jsx (BrowserRouter)                         │   │
│  │    └── App.jsx (Root Component)                   │   │
│  │          ├── ThemeProvider (Context)              │   │
│  │          ├── Toaster (react-hot-toast)            │   │
│  │          ├── /login → Login.jsx                   │   │
│  │          └── /* → ProtectedRoute                  │   │
│  │                ├── Navbar.jsx                     │   │
│  │                ├── / → Home.jsx                   │   │
│  │                ├── /builder → Builder.jsx         │   │
│  │                └── /settings → Settings.jsx       │   │
│  └──────────────────────────────────────────────────┘   │
│                        │ axios (withCredentials:true)    │
│                        ▼                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Express API (Backend)                 │   │
│  │  localhost:8000                                   │   │
│  │                                                   │   │
│  │  index.js                                         │   │
│  │  ├── CORS (private: localhost:5173 only)           │   │
│  │  ├── CORS (public: any origin)                    │   │
│  │  ├── /api/auth → auth.route.js                   │   │
│  │  ├── /api/user → user.route.js                   │   │
│  │  └── /api/assistant → assistant.route.js         │   │
│  └──────────────────────────────────────────────────┘   │
│                        │                                 │
│                        ▼                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │              MongoDB (Mongoose)                   │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │         User Collection                     │   │   │
│  │  │  { name, email, assistantName,             │   │   │
│  │  │    businessName, businessType,             │   │   │
│  │  │    businessDescription, tone, theme,       │   │   │
│  │  │    voice, geminiApiKey, geminiStatus,      │   │   │
│  │  │    pages[], siteTheme, isSetupComplete }   │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│                        │                                 │
│                        ▼                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Google Gemini API (External)             │   │
│  │  POST https://generativelanguage.googleapis.com/  │   │
│  │       /v1beta/models/gemini-3.5-flash:            │   │
│  │       generateContent?key={API_KEY}               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Entry Points

### Frontend — `FrontEnd/src/main.jsx`
- Mounts the React app inside `<BrowserRouter>`
- Wraps `<App />` with routing context
- Tailwind CSS is configured via `@tailwindcss/vite` plugin

### Backend — `BackEnd/index.js`
- Express 5 server on `PORT=8000`
- Two CORS configurations:
  - `privateCors`: restricts to `localhost:5173` with credentials (for auth/user routes)
  - `publicCors`: allows all origins (for public assistant routes)
- Connects to MongoDB on startup
- Mounts 3 route groups: `/api/auth`, `/api/user`, `/api/assistant`

---

## 2. Authentication Flow (Google OAuth + JWT)

### Step-by-step:

```
Login.jsx                          auth.controller.js
    │                                    │
    │ 1. User clicks "Sign in with       │
    │    Google"                         │
    │    │                               │
    │ 2. signInWithPopup(auth, provider) │
    │    (Firebase SDK)                  │
    │    │                               │
    │    ← Google popup opens            │
    │    ← User grants permission        │
    │    │                               │
    │ 3. Receives { displayName, email } │
    │    │                               │
    │ 4. POST /api/auth/google           │
    │    body: { name, email } ──────────► receives body
    │    withCredentials: true           │   │
    │                                    │ 5. User.findOne({email})
    │                                    │    ├─ exists → use existing
    │                                    │    └─ new → User.create({name, email})
    │                                    │
    │                                    │ 6. genToken(userId) → JWT
    │                                    │    jwt.sign({userId}, JWT_SECRET, {expiresIn:"7d"})
    │                                    │
    │                                    │ 7. res.cookie("token", jwt, {
    │                                    │      httpOnly:true,
    │                                    │      secure:false,
    │                                    │      sameSite:"strict",
    │                                    │      maxAge: 7 days
    │                                    │    })
    │    ◄── res.status(200).json(user)  │
    │    │                               │
    │ 8. setUser(res.data)               │
    │ 9. navigate("/builder")            │
```

### Key points:
- JWT stored in an **httpOnly cookie** (not accessible via JS - XSS safe)
- No refresh token mechanism (token lasts 7 days)
- User is **auto-registered** on first Google sign-in
- `isAuth.js` middleware verifies the JWT cookie and attaches `req.userId`

### Logout:
```
Navbar.jsx                         auth.controller.js
  handleLogout()                       │
    GET /api/auth/logout ─────────────► res.clearCookie("token")
    withCredentials                    ◄── {message:"Logout Successfully"}
    │
  setUser(null)
  navigate("/login")
```

---

## 3. Protected Routes

```
App.jsx (on mount)
    │
    GET /api/user/current-user ──► user.controller.js
    (with JWT cookie)                isAuth middleware:
    │                                  ├─ reads req.cookies.token
    │                                  ├─ jwt.verify(token, JWT_SECRET)
    │                                  ├─ req.userId = decoded.userId
    │                                  └─ next()
    │                                getCurrentUser:
    │                                  User.findById(req.userId)
    ◄── res.status(200).json(user)  (or 404 if not found)
    │
    setUser(res.data)
    setLoading(false)
```

- `ProtectedRoute.jsx` checks `user` and `loading` states
- While loading: shows a spinner
- If no user after loading: redirects to `/login`
- If user exists: renders children (Navbar + page routes)

---

## 4. Assistant Builder Flow

### Builder Page (`FrontEnd/src/pages/Builder.jsx`)

```
User navigates to /builder
    │
    ├─ If !user.isSetupComplete → editAssistant = true (edit mode)
    └─ If user.isSetupComplete → shows deployed state first
                                  (summary cards + embed code)
                                  Can click "Edit Assistant" to edit

Edit Mode:
    Sidebar with 4 sections:
    ├─ Info:     assistantName, businessName, businessType, businessDescription
    ├─ Appearance: theme (light/dark/glass/neon), tone (friendly/professional/sales), voice (male/female)
    ├─ API Key:  geminiApiKey (password field)
    └─ Pages:    name, path, keywords → add/remove navigation pages

    Save button calls saveAssistant():
        POST /api/user/save-assistant ──► user.controller.js
        body: { assistantName, businessName, ... }
        with JWT cookie                   │
                                          ├─ isAuth middleware (verify JWT)
                                          ├─ User.findById(req.userId)
                                          ├─ Update all fields on user doc
                                          ├─ user.isSetupComplete = true
                                          ├─ user.save()
                                          ◄── res.json({ message, user })
        │
        setUser(res.data.user)
        setEditAssistant(false)
```

### Embed Code Generation:
```js
const embedCode = `<script src="${CLIENT_URL}/assistant.js" data-user-id="${user._id}"></script>`
```
- Displayed in a code block with copy-to-clipboard
- Website owners paste this before `</body>` on their site

---

## 5. Public Assistant Chat Flow

### Two public endpoints (no auth required, public CORS):

#### 5a. GET /api/assistant/config/:userId
```
assistant.controller.js
    User.findById(userId).select("-geminiApiKey")
    ◄── { message, user }  (public config without sensitive API key)
```
Used by the embeddable widget to load assistant configuration (theme, tone, name, etc.)

#### 5b. POST /api/assistant/ask
```
External site's visitor sends a message:
    POST /api/assistant/ask
    body: { message, userId, currentPath? }

assistant.controller.js
    │
    1. Validate message and userId
    2. User.findById(userId) → get user's config + geminiApiKey
    3. If no geminiApiKey → 400 error
    │
    4. If user.enableNavigation:
       ├─ Check if message starts with navigation words
       │  (open, go, start, show, navigate, take me)
       │
       ├─ If yes, look for matching page by keywords
       │  ├─ If currentPath === matchedPage.path
       │  │  → { response: "Page already open" }
       │  └─ If different path
       │     → { action: "navigate", path: "/pricing", response: "Opening Pricing" }
       │
       └─ If no match → fall through to AI
    │
    5. Build system prompt with:
       ├─ assistantName, businessName, businessType
       ├─ businessDescription, tone
       └─ Rules: <15 words, fast direct responses, voice-friendly
    │
    6. Call generateGeminiResponse(prompt, apikey, user)
       │
       └─ Configs/gemini.js:
          ├─ POST to Gemini API with user's API key
          ├─ Track API key status:
          │   400/401 → user.geminiStatus = "invalid"
          │   429     → user.geminiStatus = "quota_exceeded"
          │   200     → user.geminiStatus = "active"
          ├─ Save status to MongoDB
          └─ Return AI response text
    │
    7. ◄── { success: true, aiResponse: "..." }
```

---

## 6. Settings & Theme Flow

### Theme Persistence (`FrontEnd/src/Context/ThemeContext.jsx`)

```
App.jsx
  └── <ThemeProvider user={user}>
        │
        ├─ On mount: read localStorage 'siteTheme'
        ├─ If user.siteTheme differs, sync from server
        ├─ On change: toggle <html>.classList.add("dark")
        ├─ Update localStorage
        └─ On toggleTheme():
             POST /api/user/save-site-theme ──► user.controller.js
             body: { siteTheme: "dark"|"light" }
             with JWT cookie                   User.findByIdAndUpdate
```

### Account Deletion (`FrontEnd/src/pages/Settings.jsx`)

```
User clicks Delete → confirmation modal → confirm:
    DELETE /api/user/delete-account ──► user.controller.js
    with JWT cookie                      User.findByIdAndDelete
                                         res.clearCookie("token")
    navigate("/login")
    window.location.reload()
```

---

## 7. Component Tree & Data Flow

```
main.jsx
└── <BrowserRouter>
    └── App.jsx
        ├── state: [user, loading]
        ├── on mount: GET /api/user/current-user → user state
        ├── exports: ServerUrl, CLIENT_URL constants
        │
        ├── <ThemeProvider user={user}>
        │   └── Context: { theme, setTheme, toggleTheme }
        │
        ├── <Toaster /> (react-hot-toast)
        │
        ├── Route /login
        │   └── Login.jsx
        │       ├── Firebase Google Sign-In popup
        │       ├── POST /api/auth/google → setUser
        │       └── navigate("/builder")
        │
        └── Route /* (wrapped in ProtectedRoute)
            ├── ProtectedRoute.jsx
            │   ├── if loading → spinner
            │   ├── if !user → redirect /login
            │   └── else → children
            │
            ├── Navbar.jsx
            │   ├── Logo, Dashboard button, Settings, Logout
            │   ├── Mobile hamburger menu
            │   └── GET /api/auth/logout → setUser(null)
            │
            ├── Route /
            │   └── Home.jsx (marketing landing page)
            │       ├── Hero section with CTA
            │       ├── "How it works" steps
            │       └── Footer
            │
            ├── Route /builder
            │   └── Builder.jsx
            │       ├── State: editAssistant, activeSection
            │       ├── Form: info, appearance, api, pages
            │       ├── POST /api/user/save-assistant
            │       ├── Deployed state with embed code
            │       └── Copy-to-clipboard
            │
            └── Route /settings
                └── Settings.jsx
                    ├── Dark mode toggle (ThemeContext)
                    └── Delete account (with confirmation modal)
```

---

## 8. Data Models

### User (MongoDB/Mongoose) — `user.model.js`

| Field | Type | Default | Description |
|---|---|---|---|
| name | String (required) | — | User's display name from Google |
| email | String (required, unique) | — | User's email from Google |
| assistantName | String | "Shifra" | AI assistant's name |
| businessName | String | "" | Business name for context |
| businessType | String | "" | e.g. SaaS, E-commerce |
| businessDescription | String | "" | Long description for AI context |
| tone | enum | "friendly" | friendly, professional, sales |
| theme | enum | "dark" | light, dark, glass, neon |
| voice | enum | "male" | male, female |
| enableVoice | Boolean | true | Voice output toggle |
| enableNavigation | Boolean | true | Voice navigation toggle |
| pages | [PageSchema] | [] | Navigation pages with keywords |
| geminiApiKey | String | "" | User's personal Gemini API key |
| geminiStatus | enum | "active" | active, invalid, quota_exceeded |
| totalMessages | Number | 0 | Message counter |
| isSetupComplete | Boolean | false | Whether builder setup is done |
| siteTheme | enum | "light" | UI theme: light, dark |

### Page (embedded subdocument) — `pageSchema`

| Field | Type | Description |
|---|---|---|
| name | String | Display name (e.g. "Pricing") |
| path | String | URL path (e.g. "/pricing") |
| keywords | [String] | Voice trigger keywords |

---

## 9. API Route Summary

| Method | Endpoint | Auth | CORS | Purpose |
|---|---|---|---|---|
| POST | `/api/auth/google` | None | Private | Google sign-in/signup |
| GET | `/api/auth/logout` | Cookie | Private | Clear JWT cookie |
| GET | `/api/user/current-user` | Cookie | Private | Get authenticated user |
| POST | `/api/user/save-assistant` | Cookie | Private | Save assistant config |
| POST | `/api/user/save-site-theme` | Cookie | Private | Save dark/light preference |
| DELETE | `/api/user/delete-account` | Cookie | Private | Delete user + all data |
| GET | `/api/assistant/config/:userId` | None | Public | Get public config for widget |
| POST | `/api/assistant/ask` | None | Public | Chat with AI assistant |

---

## 10. Key Design Decisions

1. **Bring-Your-Own-Key (BYOK)**: Users provide their own Gemini API key. The app does not pay for AI inference. Key status is tracked and persisted.

2. **httpOnly Cookies**: JWT tokens are stored in httpOnly cookies (not localStorage) for XSS protection. All private API routes use `withCredentials: true`.

3. **Dual CORS**: Auth/user routes use restrictive CORS (only the SPA origin). Assistant routes use permissive CORS (any website can embed the widget).

4. **Navigation System**: Before calling AI, the backend checks if the user's message is a navigation command by matching keywords. Navigation responses include `action: "navigate"` and a `path` that the frontend/widget can use for client-side routing.

5. **Voice-First Design**: AI responses are constrained to <15 words for quick voice playback. The widget will use Web Speech API (TTS).

6. **No Refresh Tokens**: The JWT lasts 7 days. No refresh mechanism. On expiry, user re-authenticates via Google.

7. **Gemini 3.5 Flash**: Uses the cheaper/faster Flash model variant. The URL in `gemini.js` has a typo (`gemini-3.5-flash` instead of `gemini-1.5-flash` or `gemini-2.0-flash`) — this will likely fail at runtime.

8. **Status Tracking**: Gemini API key health is tracked in `geminiStatus` (active/invalid/quota_exceeded) and persisted on every API call, enabling the builder UI to show key status.
