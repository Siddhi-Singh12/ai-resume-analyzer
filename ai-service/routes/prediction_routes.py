from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from services.role_predictor import predict_role, predict_roles_detailed
from services.ats_predictor import calculate_detailed_ats, predict_ats_score
from services.skill_extractor import extract_skills, analyze_skill_gaps
from services.job_matcher import match_jobs_detailed
from services.recommendation_engine import recommend_jobs, recommend_skills
from services.resume_quality import analyze_resume_quality
from services.resume_improvement import generate_resume_improvements
from services.section_analyzer import analyze_all_sections
from services.project_analyzer import analyze_projects
from services.interview_generator import generate_interview_prep
from services.career_roadmap import generate_career_roadmap, calculate_learning_priorities
from services.summary_generator import generate_resume_summaries

router = APIRouter(
    prefix="/predict",
    tags=["Resume Prediction & Intelligence"]
)

class ResumeRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = ""
    target_role: Optional[str] = ""

@router.post("/resume")
def analyze_resume_pipeline(data: ResumeRequest):
    """
    End-to-End Comprehensive Resume Intelligence Pipeline:
    - Resume Quality Score & Evaluation
    - Explainable ATS Score & 7-Factor Breakdown
    - Multi-Role Prediction with Confidence
    - 4-Category Skill Gap Analysis
    - Job Dataset Matching with Justifications
    - AI Resume Improvements
    - Section & Project Analysis
    - Interview Preparation Questions
    - Personalized Career Roadmap & Learning Priorities
    - Resume Summaries
    """
    text = data.resume_text
    jd = data.job_description or ""

    # 1. Quality Analysis
    quality_analysis = analyze_resume_quality(text)

    # 2. ATS Analysis
    ats_breakdown = calculate_detailed_ats(text, jd)

    # 3. Role Predictions
    predicted_roles = predict_roles_detailed(text)
    primary_role = data.target_role or (predicted_roles[0]["role"] if predicted_roles else "Software Engineer")

    # 4. Skill Extraction & Gap Analysis
    extracted_skills = extract_skills(text)
    skill_gaps = analyze_skill_gaps(text, jd, target_role=primary_role)

    # 5. Job Recommendations
    recommended_jobs = match_jobs_detailed(text, top_k=6)

    # 6. AI Resume Improvements
    improvements = generate_resume_improvements(text, jd)

    # 7. Section & Project Analysis
    section_analysis = analyze_all_sections(text)
    project_analysis = analyze_projects(text)

    # 8. Interview Preparation
    interview_prep = generate_interview_prep(
        resume_text=text,
        role=primary_role,
        difficulty="Medium"
    )

    # 9. Career Roadmap & Learning Priorities
    career_plan = generate_career_roadmap(
        resume_text=text,
        target_role=primary_role,
        current_skills=skill_gaps["strong_skills"] + skill_gaps["developing_skills"],
        missing_skills=skill_gaps["missing_skills"]
    )

    # 10. Summary Options
    summaries = generate_resume_summaries(text, target_role=primary_role)

    return {
        # Core scores
        "ats_score": ats_breakdown["overall_score"],
        "ats_breakdown": ats_breakdown,
        "quality_score": quality_analysis["quality_score"],
        "quality_analysis": quality_analysis,

        # Role predictions
        "predicted_role": primary_role,
        "predicted_roles": predicted_roles,

        # Skills & Gaps
        "skills": extracted_skills,
        "skill_gaps": skill_gaps,
        "matched_skills": skill_gaps["strong_skills"] + skill_gaps["developing_skills"],
        "missing_skills": skill_gaps["missing_skills"],

        # Job Matches
        "matched_jobs": recommended_jobs,
        "recommendations": recommended_jobs,

        # Enhancements & Analyzers
        "resume_improvements": improvements,
        "section_analysis": section_analysis,
        "project_analysis": project_analysis,

        # Career & Interview
        "interview_prep": interview_prep,
        "career_roadmap": career_plan["roadmap_phases"],
        "learning_priorities": career_plan["learning_priorities"],
        "summaries": summaries
    }