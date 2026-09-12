# Buddy Guard Setup Guide

This guide will walk you through setting up the Buddy Guard project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js** (v18 or higher) & npm
- **Python** (v3.9 or higher)
- **Git**

You will also need accounts for:
- [Google AI Studio](https://aistudio.google.com/) (for the Gemini API key)
- [Supabase](https://supabase.com/) (for the database)

---

## 1. Supabase Database Setup

Buddy Guard uses Supabase for persistent data storage.

1. Create a new project in [Supabase](https://supabase.com/dashboard).
2. Once your project is ready, go to the **SQL Editor** in the Supabase dashboard.
3. Copy the following SQL script and run it in the SQL Editor to create all the necessary tables and seed demo users:

```sql
-- Drop default tables if they exist to avoid conflicts
DROP TABLE IF EXISTS guardian_notes;
DROP TABLE IF EXISTS guardians;
DROP TABLE IF EXISTS history;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
);

-- Profiles table
CREATE TABLE profiles (
    user_id TEXT PRIMARY KEY,
    alias TEXT DEFAULT 'Buddy',
    avatar TEXT DEFAULT 'fox',
    color TEXT DEFAULT '#5B8DEF'
);

-- Conversations table
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    status TEXT DEFAULT 'active'
);

-- Messages table
CREATE TABLE messages (
    id BIGINT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

-- History table
CREATE TABLE history (
    id BIGINT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT,
    time TEXT,
    preview TEXT,
    status TEXT,
    messages_count INT DEFAULT 0,
    case_id TEXT
);

-- Cases table
CREATE TABLE cases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'AI Report',
    tier TEXT DEFAULT 'safe',
    description TEXT
);

-- Guardians table
CREATE TABLE guardians (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    relationship TEXT DEFAULT 'Parent',
    whatsapp_number TEXT,
    phone_number TEXT,
    notes TEXT DEFAULT ''
);

-- Guardian Notes table
CREATE TABLE guardian_notes (
    id TEXT PRIMARY KEY,
    guardian_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    date TEXT NOT NULL
);

-- Seed demo users
INSERT INTO users (id, email, password, role) VALUES
    ('admin-1', 'admin@demo.com', 'demo123', 'admin'),
    ('official-1', 'official@demo.com', 'demo123', 'official'),
    ('user-1', 'user1@demo.com', 'demo123', 'user'),
    ('user-2', 'user2@demo.com', 'demo123', 'user'),
    ('user-3', 'user3@demo.com', 'demo123', 'user'),
    ('user-4', 'user4@demo.com', 'demo123', 'user'),
    ('user-5', 'user5@demo.com', 'demo123', 'user')
ON CONFLICT (id) DO NOTHING;
```

---

## 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd BuddyGuard/backend
   ```

2. Install the required Python packages:
   ```bash
   pip install fastapi uvicorn pydantic google-genai python-dotenv supabase
   ```

3. Configure Environment Variables:
   Create a file named `.env` in the `backend` directory and add your API keys:
   ```env
   # Your Gemini API Key from Google AI Studio
   GEMINI_API_KEY=your_gemini_api_key_here

   # Your Supabase details (Go to Project Settings -> API in Supabase)
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your_supabase_anon_public_key_here
   ```

4. Start the backend server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   The backend will now be running at `http://localhost:8000`.

*(Note: The backend is designed with a fallback mechanism. If it cannot connect to Supabase or the tables are missing, it will automatically fall back to using in-memory storage so the app can still run.)*

---

## 3. Frontend Setup (Next.js)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd BuddyGuard/frontend
   ```

2. Install the required Node dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (Optional):
   The frontend connects to the backend API via relative paths (configured in `next.config.mjs` or similar, or directly referencing `localhost:8000`). If you have specific frontend environment variables, create a `.env.local` file here. Currently, the primary configuration is handled in the backend.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will now be accessible at `http://localhost:3000`.

---

## 4. Running the App

With both servers running, open your browser and go to `http://localhost:3000`.

You can log in using one of the demo accounts seeded in the database:
- **Email:** `user1@demo.com`
- **Password:** `demo123`

*(Other demo accounts include user2, user3, etc., all with the password `demo123`)*
