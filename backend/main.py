from fastapi import FastAPI
from db.database import supabase

app = FastAPI(
    title="Buddy Guard API",
    description="Child Safety and Protection Backend",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Buddy Guard API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/health/db")
def database_health():
    try:
        result = supabase.table("users").select("id").limit(1).execute()

        return {
            "status": "ok",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "error",
            "database": "connection failed",
            "details": str(e)
        }