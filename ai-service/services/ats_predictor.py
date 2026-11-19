import os
import re
import joblib
import numpy as np
from typing import Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.skill_extractor import extract_skills

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "ats_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "ats_vectorizer.pkl")

ml_model = None
ml_vectorizer = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        ml_model = joblib.load(MODEL_PATH)
        ml_vectorizer = joblib.load(VECTORIZER_PATH)
except Exception as e:
    print(f"Warning: Could not load ML ATS model: {e}")

EDUCATION_KEYWORDS = [
    'bachelor', 'master', 'phd', 'doctorate', 'b.tech', 'm.tech', 'b.e.', 'm.e.',
    'b.sc', 'm.sc', 'bca', 'mca', 'degree', 'computer science', 'engineering',
    'information technology', 'data science', 'diploma'
]

SENIORITY_KEYWORDS = ['senior', 'lead', 'principal', 'staff', 'manager', 'head', 'architect']
JUNIOR_KEYWORDS = ['junior', 'intern', 'trainee', 'associate', 'entry level', 'fresher']

def calculate_detailed_ats(resume_text: str, job_description: str = "") -> Dict[str, Any]:
    """
    Calculate explainable ATS Score (0-100) with detailed component breakdown:
    - keyword_score
    - skills_score
    - experience_score
    - education_score
    - structure_score
    - formatting_score
    - jd_relevance_score
    - overall_score
    """
    if not resume_text or not resume_text.strip():
        return {
            "overall_score": 30,
            "keyword_score": 25,
            "skills_score": 20,
            "experience_score": 30,
            "education_score": 40,
            "structure_score": 35,
            "formatting_score": 40,
            "jd_relevance_score": 20
        }

    text_lower = resume_text.lower()
    jd_lower = (job_description or "").lower().strip()

    # 1. Structure Score
    common_sections = ['experience', 'education', 'skills', 'projects', 'summary']
    found_sections = sum(1 for sec in common_sections if sec in text_lower)
    structure_score = min(100, int((found_sections / len(common_sections)) * 100))

    # 2. Formatting / Parseability Score
    words = re.findall(r'\b\w+\b', resume_text)
    word_count = len(words)
    formatting_score = 90
    if word_count < 200 or word_count > 1500:
        formatting_score -= 20
    # Check for excessive special characters / garbled text
    special_char_ratio = len(re.findall(r'[^\w\s\.\,\-\(\)\/\@]', resume_text)) / max(1, len(resume_text))
    if special_char_ratio > 0.08:
        formatting_score -= 25
    formatting_score = max(35, min(95, formatting_score))

    # 3. Education Score
    has_degree = any(re.search(r'\b' + re.escape(deg) + r'\b', text_lower) for deg in EDUCATION_KEYWORDS)
    education_score = 85 if has_degree else 45
    if jd_lower:
        jd_edu_required = any(re.search(r'\b' + re.escape(deg) + r'\b', jd_lower) for deg in EDUCATION_KEYWORDS)
        if jd_edu_required and has_degree:
            education_score = 95
        elif jd_edu_required and not has_degree:
            education_score = 40

    # 4. Experience Score
    exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)(?:\s*of\s*experience)?', text_lower)
    exp_years = [int(m) for m in exp_matches if int(m) <= 40]
    detected_years = max(exp_years) if exp_years else 0

    if jd_lower:
        jd_exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)', jd_lower)
        jd_req_years = int(jd_exp_matches[0]) if jd_exp_matches else 1
        if detected_years >= jd_req_years:
            experience_score = 90
        elif detected_years > 0:
            experience_score = min(85, int((detected_years / max(1, jd_req_years)) * 80) + 15)
        else:
            experience_score = 60
    else:
        experience_score = 85 if detected_years >= 2 else (70 if detected_years > 0 else 60)

    # 5. Skills Score & Keyword Score & JD Relevance
    resume_skills = set(s.lower() for s in extract_skills(resume_text))

    if jd_lower:
        jd_skills = set(s.lower() for s in extract_skills(job_description))

        if jd_skills:
            matched_skills = resume_skills.intersection(jd_skills)
            skills_score = int((len(matched_skills) / len(jd_skills)) * 100)
            skills_score = max(20, min(100, skills_score))
        else:
            skills_score = min(95, max(40, len(resume_skills) * 8))

        # TF-IDF Cosine Similarity for Keyword and JD Relevance
        try:
            tfidf = TfidfVectorizer(stop_words='english', max_features=1000)
            matrix = tfidf.fit_transform([resume_text, job_description])
            cos_sim = float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0])
            jd_relevance_score = max(25, min(98, int(cos_sim * 100 + 20)))
        except Exception:
            jd_relevance_score = 65

        # Keyword matching ratio of non-trivial words in JD
        jd_tokens = set(w for w in re.findall(r'\b[a-zA-Z]{3,}\b', jd_lower) if len(w) > 3)
        res_tokens = set(w for w in re.findall(r'\b[a-zA-Z]{3,}\b', text_lower) if len(w) > 3)
        overlap = jd_tokens.intersection(res_tokens)
        keyword_score = max(25, min(98, int((len(overlap) / max(1, len(jd_tokens))) * 110)))
    else:
        # Without JD, assess based on technical vocabulary and skill diversity
        skills_score = min(95, max(45, len(resume_skills) * 9))
        keyword_score = min(90, max(50, 40 + len(resume_skills) * 4))
        jd_relevance_score = min(90, max(60, skills_score - 5))

    # Incorporate ML Model Prediction if available
    ml_ats_score = None
    if ml_model is not None and ml_vectorizer is not None:
        try:
            feat = ml_vectorizer.transform([resume_text])
            raw_ml = float(ml_model.predict(feat)[0])
            ml_ats_score = max(20.0, min(99.0, raw_ml))
        except Exception:
            ml_ats_score = None

    # Weighted Overall Score
    if jd_lower:
        weighted_score = (
            keyword_score * 0.22 +
            skills_score * 0.25 +
            experience_score * 0.13 +
            education_score * 0.10 +
            structure_score * 0.10 +
            formatting_score * 0.08 +
            jd_relevance_score * 0.12
        )
    else:
        weighted_score = (
            keyword_score * 0.20 +
            skills_score * 0.28 +
            experience_score * 0.15 +
            education_score * 0.12 +
            structure_score * 0.13 +
            formatting_score * 0.12
        )

    if ml_ats_score is not None:
        # Blend 70% explainable weighted score + 30% ML regressor
        overall_score = int(weighted_score * 0.70 + ml_ats_score * 0.30)
    else:
        overall_score = int(weighted_score)

    overall_score = max(25, min(98, overall_score))

    return {
        "overall_score": overall_score,
        "keyword_score": max(15, min(99, int(keyword_score))),
        "skills_score": max(15, min(99, int(skills_score))),
        "experience_score": max(20, min(99, int(experience_score))),
        "education_score": max(30, min(99, int(education_score))),
        "structure_score": max(30, min(99, int(structure_score))),
        "formatting_score": max(30, min(99, int(formatting_score))),
        "jd_relevance_score": max(15, min(99, int(jd_relevance_score)))
    }

def predict_ats_score(text: str, job_description: str = "") -> float:
    """
    Backward-compatible helper returning a single float score.
    """
    res = calculate_detailed_ats(text, job_description)
    return float(res["overall_score"])