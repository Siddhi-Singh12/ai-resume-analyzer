from typing import Dict, List, Any
from services.job_matcher import match_jobs_detailed
from services.skill_extractor import extract_skills

def recommend_jobs(resume_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Recommend jobs from verified dataset using semantic similarity.
    """
    return match_jobs_detailed(resume_text, top_k=top_k)

def recommend_skills(extracted_skills: List[str], recommended_jobs: List[Dict[str, Any]] = None) -> List[str]:
    """
    Recommend complementary skills based on job dataset matches and industry standards.
    """
    current_skills_lower = {str(s).strip().lower() for s in (extracted_skills or [])}
    recommended = []

    if recommended_jobs:
        for job in recommended_jobs:
            missing = job.get("missing_skills", [])
            for s in missing:
                if s.strip().lower() not in current_skills_lower and s not in recommended:
                    recommended.append(s)
                if len(recommended) >= 6:
                    break
            if len(recommended) >= 6:
                break

    fallback_standards = [
        "Docker", "AWS", "Kubernetes", "CI/CD", "System Design",
        "Microservices", "TypeScript", "Redis", "Kafka", "Git"
    ]
    for skill in fallback_standards:
        if skill.lower() not in current_skills_lower and skill not in recommended:
            recommended.append(skill)
        if len(recommended) >= 6:
            break

    return recommended[:6]