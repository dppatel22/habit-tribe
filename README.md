# 🔥 HabitTribe — Collaborative Habit Tracker

Track daily habits with friends, build "forgiving" streaks, and stay motivated together.

---

## 🚀 Firebase Connection Guide

### Step 1 — Create a Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com)** and click **Add Project**
2. Name it (e.g. `habit-tribe`) → Continue
3. Disable Google Analytics if you don't need it → **Create Project**

### Step 2 — Register a Web App

1. In your project dashboard, click the **</>** (Web) icon
2. Give it a nickname (e.g. `habit-tribe-web`) → **Register App**
3. You'll see a config object like this — **copy the values**:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "habit-tribe.firebaseapp.com",
  projectId: "habit-tribe",
  storageBucket: "habit-tribe.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123...",
};
```

### Step 3 — Enable Authentication

1. In the Firebase Console sidebar → **Build → Authentication → Get Started**
2. Go to **Sign-in method** tab → enable **Google**
3. Set a support email → **Save**

### Step 4 — Create the Firestore Database

1. Sidebar → **Build → Firestore Database → Create Database**
2. Choose **Start in production mode**
3. Select your preferred region → **Done**
4. Go to the **Rules** tab and paste the contents of `firestore.rules` from this project

### Step 5 — Add Your Credentials to the App

```bash
# Copy the template
cp .env.example .env

# Open .env and paste your Firebase config values:
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=habit-tribe.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=habit-tribe
VITE_FIREBASE_STORAGE_BUCKET=habit-tribe.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123...
```

### Step 6 — Run the App

```bash
cd habit-tribe
npm install
npm run dev
```

Open **http://localhost:5173** — sign in with Google and start tracking!

---

## 🧪 Local Development with Emulators (No Firebase project needed)

```bash
# Install Firebase CLI globally (one time)
npm install -g firebase-tools

# Start emulators
firebase emulators:start

# In .env, enable emulators:
VITE_USE_EMULATORS=true

# Then start the app
npm run dev
```

---

## 📁 Project Structure

```
habit-tribe/
├── firestore.rules              ← Firestore security rules
├── firebase.json                ← Firebase config + emulators
├── .env.example                 ← Firebase credentials template
└── src/
    ├── firebase/
    │   ├── firebaseConfig.ts    ← Firebase init boilerplate
    │   └── firestoreHelpers.ts  ← Typed CRUD helpers
    ├── lib/
    │   ├── getStreak.ts         ← Forgiving streak algorithm
    │   ├── weeklySuccessRate.ts ← Weekly analytics
    │   └── quoteOfTheDay.ts     ← Date-seeded daily quote
    ├── components/
    │   ├── HabitCard.tsx         ← Habit display card
    │   ├── StreakBadge.tsx       ← Flame streak counter
    │   └── QuoteBar.tsx         ← Daily quote bar
    ├── pages/
    │   ├── Dashboard.tsx        ← Personal habits + streaks
    │   └── GroupFeed.tsx        ← Friends' streaks + wins
    ├── App.tsx                  ← Auth + routing shell
    ├── main.tsx                 ← Entry point
    └── index.css                ← Premium dark theme
```

## 🔑 Key Features

| Feature | File | Description |
|---|---|---|
| Forgiving Streaks | `getStreak.ts` | Skip days preserve streak; missed active days break it |
| Weekly Analytics | `weeklySuccessRate.ts` | `(completed / required) × 100` for any 7-day window |
| Daily Quote | `quoteOfTheDay.ts` | Same quote for all friends via date-seeded index |
| Security Rules | `firestore.rules` | Users edit own habits; read friends' via group membership |
| Google Auth | `App.tsx` | One-click Google sign-in with Firebase Auth |
