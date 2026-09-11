from fastapi import FastAPI
from db.database import supabase
from api.chat import router as chat_router

app = FastAPI(
    title="Buddy Guard API",
    description="Child Safety and Protection Backend",
    version="1.0.0"
)

app.include_router(chat_router, prefix="/api")

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