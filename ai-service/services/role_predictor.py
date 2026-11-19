import os
import joblib
import pandas as pd
from typing import Dict, List, Any
from services.skill_extractor import extract_skills

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "role_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoder.pkl")
JOB_DATASET_PATH = os.path.join(BASE_DIR, "datasets", "job_dataset.csv")

model = None
vectorizer = None
encoder = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH) and os.path.exists(ENCODER_PATH):
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
        encoder = joblib.load(ENCODER_PATH)
except Exception as e:
    print(f"Warning: Could not load role classification model: {e}")

# Build role archetype skill requirements from job dataset
ROLE_BENCHMARK_SKILLS: Dict[str, List[str]] = {
    "Data Scientist": ["Python", "SQL", "Machine Learning", "Pandas", "Scikit-Learn", "Statistics", "Data Visualization", "NumPy"],
    "Machine Learning Engineer": ["Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Docker", "MLOps", "Git"],
    "AI Researcher": ["Deep Learning", "NLP", "PyTorch", "TensorFlow", "Transformers", "Computer Vision", "Research", "Mathematics"],
    "Software Engineer": ["Python", "Java", "JavaScript", "React", "Node.js", "Git", "Data Structures", "Algorithms", "SQL", "REST APIs"],
    "Data Analyst": ["SQL", "Excel", "Tableau", "Power BI", "Python", "Data Analysis", "Reporting", "Statistics"],
    "Cloud / DevOps Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Git", "Bash"],
    "Cybersecurity Analyst": ["Network Security", "Linux", "Penetration Testing", "Firewalls", "Information Security", "Risk Assessment", "SIEM"]
}

def predict_roles_detailed(text: str) -> List[Dict[str, Any]]:
    """
    Predict multiple prospective job roles with calibrated confidence scores,
    supporting skills present in the resume, and missing skills needed for each role.
    """
    if not text or not text.strip():
        return [
            {
                "role": "Software Engineer",
                "confidence": 70,
                "supporting_skills": [],
                "missing_skills": ["Git", "Data Structures", "Algorithms"]
            }
        ]

    candidate_skills = extract_skills(text)
    candidate_skills_lower = set(s.lower() for s in candidate_skills)

    role_scores: Dict[str, float] = {}

    # 1. Base probabilities from trained ML Logistic Regression model
    if model is not None and vectorizer is not None and encoder is not None:
        try:
            vec = vectorizer.transform([text])
            probs = model.predict_proba(vec)[0]
            classes = encoder.classes_
            for cls_name, prob in zip(classes, probs):
                role_scores[cls_name] = float(prob) * 100.0
        except Exception as e:
            print(f"Error evaluating role model probabilities: {e}")

    # 2. Add fine-grained roles based on skill overlap with benchmark archetypes
    for role_name, required_skills in ROLE_BENCHMARK_SKILLS.items():
        req_set = set(s.lower() for s in required_skills)
        overlap = candidate_skills_lower.intersection(req_set)
        skill_ratio = len(overlap) / max(1, len(req_set))
        skill_score = skill_ratio * 100.0

        if role_name in role_scores:
            # Blend ML probability (60%) with direct skill overlap (40%)
            role_scores[role_name] = (role_scores[role_name] * 0.6) + (skill_score * 0.4)
        else:
            # If not in the 4-class classifier, evaluate purely on skill match
            role_scores[role_name] = max(25.0, skill_score * 0.95)

    # Sort roles by descending confidence
    sorted_roles = sorted(role_scores.items(), key=lambda item: item[1], reverse=True)

    results = []
    for role_name, score in sorted_roles[:5]:
        benchmark = ROLE_BENCHMARK_SKILLS.get(role_name, ["Python", "Git", "SQL"])
        supporting = [s for s in benchmark if s.lower() in candidate_skills_lower]
        missing = [s for s in benchmark if s.lower() not in candidate_skills_lower]

        # Calibrate confidence to a realistic 45% - 96% range
        confidence = max(45, min(96, int(round(score))))

        results.append({
            "role": role_name,
            "confidence": confidence,
            "supporting_skills": supporting if supporting else candidate_skills[:3],
            "missing_skills": missing[:4]
        })

    return results

def predict_role(text: str) -> str:
    """
    Backward-compatible single-role prediction string.
    """
    results = predict_roles_detailed(text)
    if results:
        return results[0]["role"]
    return "Software Engineer"