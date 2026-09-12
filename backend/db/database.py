import os

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    print("WARNING: Supabase env vars missing. Running in mock mode.")
    class MockClient:
        def table(self, name): return self
        def select(self, *args, **kwargs): return self
        def limit(self, *args, **kwargs): return self
        def insert(self, *args, **kwargs): return self
        def execute(self): return type("MockResponse", (), {"data": [{"id": "mock-id-123"}]})
    supabase = MockClient()
else:
    supabase: Client = create_client(
        SUPABASE_URL,
        SUPABASE_SECRET_KEY
    )