"""
Run this script ONCE to create all required tables in your Supabase project.
Usage: python setup_db.py
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print(f"Connecting to Supabase: {url}")
supabase = create_client(url, key)

# Test connection first
try:
    test = supabase.table("users").select("*").limit(1).execute()
    print(f"Connection OK! Users table has {len(test.data)} rows.")
    if len(test.data) > 0:
        print("Tables already exist. Skipping creation.")
    else:
        print("Tables exist but are empty. Will seed demo users.")
        # Seed demo users
        demo_users = [
            {"id": "admin-1", "email": "admin@demo.com", "password": "demo123", "role": "admin"},
            {"id": "official-1", "email": "official@demo.com", "password": "demo123", "role": "official"},
            {"id": "user-1", "email": "user1@demo.com", "password": "demo123", "role": "user"},
            {"id": "user-2", "email": "user2@demo.com", "password": "demo123", "role": "user"},
            {"id": "user-3", "email": "user3@demo.com", "password": "demo123", "role": "user"},
            {"id": "user-4", "email": "user4@demo.com", "password": "demo123", "role": "user"},
            {"id": "user-5", "email": "user5@demo.com", "password": "demo123", "role": "user"},
        ]
        result = supabase.table("users").insert(demo_users).execute()
        print(f"Seeded {len(result.data)} demo users!")
except Exception as e:
    print(f"Tables don't exist yet or error: {e}")
    print("\nPlease create these tables in the Supabase SQL Editor:")
    print("Go to: https://supabase.com/dashboard -> your project -> SQL Editor\n")
    sql = """
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    alias TEXT DEFAULT 'Buddy',
    avatar TEXT DEFAULT 'fox',
    color TEXT DEFAULT '#5B8DEF'
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    status TEXT DEFAULT 'active'
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

-- History table
CREATE TABLE IF NOT EXISTS history (
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
CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'AI Report',
    tier TEXT DEFAULT 'safe',
    description TEXT
);

-- Guardians table
CREATE TABLE IF NOT EXISTS guardians (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    relationship TEXT DEFAULT 'Parent',
    whatsapp_number TEXT,
    phone_number TEXT,
    notes TEXT DEFAULT ''
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
"""
    print(sql)
