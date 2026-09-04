from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import Accident
from .routes.accidents import router as accidents_router
from .routes.analytics import router as analytics_router
from .routes.predict import router as predict_router

app = FastAPI(
    title="RoadSense AI",
    description="Traffic Accident Intelligence and Risk Analysis Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accidents_router)
app.include_router(analytics_router)
app.include_router(predict_router)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to RoadSense AI",
        "description": "Traffic Accident Intelligence and Risk Analysis Platform",
        "status": "Backend is running"
    }


@app.get("/api/accidents/count")
def accident_count(db: Session = Depends(get_db)):
    count = db.query(Accident).count()

    return {
        "total_accidents": count
    }