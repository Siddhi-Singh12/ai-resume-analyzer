from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.prediction_routes import router as prediction_router
from routes.chatbot_routes import router as chatbot_router
from routes.recommendation_routes import router as recommendation_router
from routes.ats_routes import router as ats_router
from routes.module_routes import router as module_router

app = FastAPI(
    title="AI Resume Intelligence & Career Recommendation System",
    description="""
    Production-grade AI/ML resume intelligence system featuring:
    - Explainable ATS scoring (7-factor breakdown)
    - Comprehensive Resume Quality Evaluation
    - Multi-role career prediction with calibrated confidence
    - 4-category Skill Gap Analysis
    - Real dataset job recommendations with matching justifications
    - AI Resume Improvement (action verbs, quantifiable metrics placeholders)
    - Resume Section & Project Deep-Dive Analyzers
    - Multi-category Interview Preparation with answers & difficulty filters
    - Dynamic 6-Phase Career Roadmap & Real Dataset Learning Priorities
    - Context-Aware Chatbot with Ollama Phi-3 & knowledge fallback
    """,
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(prediction_router)
app.include_router(chatbot_router)
app.include_router(recommendation_router)
app.include_router(ats_router)
app.include_router(module_router)

@app.get("/")
def home():
    return {
        "status": "online",
        "service": "AI Resume Intelligence & Career Recommendation System",
        "version": "2.0.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "modules": {
            "ats_predictor": "ready",
            "role_predictor": "ready",
            "skill_extractor": "ready",
            "job_matcher": "ready",
            "resume_quality": "ready",
            "resume_improvement": "ready",
            "interview_generator": "ready",
            "career_roadmap": "ready"
        }
    }