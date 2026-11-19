from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from services.role_predictor import predict_roles_detailed
from services.skill_extractor import extract_skills, analyze_skill_gaps
from services.job_matcher import match_jobs_detailed
from services.resume_quality import analyze_resume_quality
from services.resume_improvement import generate_resume_improvements
from services.section_analyzer import analyze_all_sections
from services.project_analyzer import analyze_projects
from services.interview_generator import generate_interview_prep
from services.career_roadmap import generate_career_roadmap, calculate_learning_priorities
from services.summary_generator import generate_resume_summaries

router = APIRouter(tags=["Modular Services"])

class BaseTextRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = ""
    target_role: Optional[str] = ""

class InterviewRequest(BaseModel):
    resume_text: str
    role: Optional[str] = "Software Engineer"
    difficulty: Optional[str] = "Medium"
    category: Optional[str] = "All"

class CareerRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Machine Learning Engineer"
    missing_skills: Optional[List[str]] = None

@router.post("/roles/predict")
def predict_roles_endpoint(data: BaseTextRequest):
    roles = predict_roles_detailed(data.resume_text)
    return {"roles": roles, "top_role": roles[0]["role"] if roles else "Software Engineer"}

@router.post("/skills/analyze")
def analyze_skills_endpoint(data: BaseTextRequest):
    gaps = analyze_skill_gaps(data.resume_text, data.job_description or "", data.target_role or "")
    return {"skills": extract_skills(data.resume_text), "gaps": gaps}

@router.post("/jobs/recommend")
def recommend_jobs_endpoint(data: BaseTextRequest):
    jobs = match_jobs_detailed(data.resume_text, top_k=6)
    return {"jobs": jobs}

@router.post("/resume/quality")
def resume_quality_endpoint(data: BaseTextRequest):
    quality = analyze_resume_quality(data.resume_text)
    return quality

@router.post("/resume/improve")
def resume_improve_endpoint(data: BaseTextRequest):
    improvements = generate_resume_improvements(data.resume_text, data.job_description or "")
    return improvements

@router.post("/resume/summary")
def resume_summary_endpoint(data: BaseTextRequest):
    summaries = generate_resume_summaries(data.resume_text, data.target_role or "")
    return summaries

@router.post("/resume/section-analyze")
def section_analyze_endpoint(data: BaseTextRequest):
    sections = analyze_all_sections(data.resume_text)
    return {"sections": sections}

@router.post("/resume/project-analyze")
def project_analyze_endpoint(data: BaseTextRequest):
    projects = analyze_projects(data.resume_text)
    return {"projects": projects}

@router.post("/interview/questions")
def interview_questions_endpoint(data: InterviewRequest):
    prep = generate_interview_prep(
        resume_text=data.resume_text,
        role=data.role or "Software Engineer",
        difficulty=data.difficulty or "Medium",
        category=data.category or "All"
    )
    return prep

@router.post("/career/roadmap")
def career_roadmap_endpoint(data: CareerRequest):
    roadmap = generate_career_roadmap(
        resume_text=data.resume_text,
        target_role=data.target_role or "Machine Learning Engineer",
        missing_skills=data.missing_skills
    )
    return roadmap

@router.post("/career/learning-plan")
def learning_plan_endpoint(data: CareerRequest):
    priorities = calculate_learning_priorities(
        missing_skills=data.missing_skills or ["Docker", "AWS", "Kubernetes"],
        target_role=data.target_role or "Machine Learning Engineer"
    )
    return {"learning_priorities": priorities}
