from fastapi import FastAPI

app = FastAPI(
    title="Buddy Guard API",
    description="Child Safety and Protection Backend",
    version="1.0.0",
)

@app.get("/")
def root():
    return {"message": "Buddy Guard API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}