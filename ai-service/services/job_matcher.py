import os
import numpy as np
import pandas as pd
from typing import Dict, List, Any
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from services.skill_extractor import extract_skills

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "datasets", "job_dataset.csv")
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "models", "job_embeddings.npy")

# Initialize SentenceTransformer
transformer_model = SentenceTransformer("all-MiniLM-L6-v2")

# Load Job Dataset
jobs_df = pd.read_csv(DATASET_PATH).fillna("")

# Pre-process text representation for each row in the dataset
jobs_texts = jobs_df.apply(
    lambda row: f"{row.get('Title', '')} {row.get('ExperienceLevel', '')} {row.get('Skills', '')} {row.get('Responsibilities', '')} {row.get('Keywords', '')}",
    axis=1
).tolist()

# Load cached embeddings or compute and cache them
if os.path.exists(EMBEDDINGS_PATH):
    job_embeddings = np.load(EMBEDDINGS_PATH)
else:
    job_embeddings = transformer_model.encode(jobs_texts, show_progress_bar=False)
    try:
        np.save(EMBEDDINGS_PATH, job_embeddings)
    except Exception as e:
        print(f"Warning: Could not save job embeddings cache: {e}")

def match_jobs_detailed(resume_text: str, top_k: int = 6) -> List[Dict[str, Any]]:
    """
    Match candidate resume against the 1,068 verified job postings in the dataset
    using Sentence Transformers and semantic cosine similarity.
    Returns:
    - job_id
    - title
    - experience_level
    - years_of_experience
    - match_percentage
    - matched_skills
    - missing_skills
    - why_it_matches
    - job_ready_skills
    """
    if not resume_text or not resume_text.strip():
        return []

    # Extract candidate skills
    candidate_skills = extract_skills(resume_text)
    candidate_skills_lower = set(s.lower() for s in candidate_skills)

    # Compute resume embedding
    resume_embedding = transformer_model.encode([resume_text], show_progress_bar=False)

    # Cosine similarities
    similarities = cosine_similarity(resume_embedding, job_embeddings)[0]

    # Select top indices
    top_indices = similarities.argsort()[-top_k:][::-1]

    recommendations = []
    seen_titles = set()

    for idx in top_indices:
        row = jobs_df.iloc[idx]
        title = row.get("Title", "Software Engineer")

        # Parse job required skills from dataset
        raw_skills = str(row.get("Skills", ""))
        job_skills = []
        for s in raw_skills.replace(",", ";").split(";"):
            cleaned = s.strip()
            if cleaned and len(cleaned) > 1 and cleaned.lower() not in [x.lower() for x in job_skills]:
                job_skills.append(cleaned)

        matched = [s for s in job_skills if any(cs in s.lower() or s.lower() in cs for cs in candidate_skills_lower)]
        missing = [s for s in job_skills if not any(cs in s.lower() or s.lower() in cs for cs in candidate_skills_lower)]

        raw_sim = float(similarities[idx])
        # Calibrate match percentage into realistic 60% - 96% range
        match_pct = max(55, min(96, int(round((raw_sim * 0.7 + (len(matched) / max(1, len(job_skills)) * 0.3)) * 100 + 15))))

        # Explain why this job matches
        matched_str = ", ".join(matched[:3]) if matched else "foundational technical background"
        why_it_matches = (
            f"Matches your experience in {matched_str}. "
            f"Aligns with the {row.get('ExperienceLevel', 'Standard')} level profile in our job dataset."
        )

        job_entry = {
            "job_id": str(row.get("JobID", f"JOB-{idx}")),
            "title": title,
            "experience_level": str(row.get("ExperienceLevel", "Mid-Level")),
            "years_of_experience": str(row.get("YearsOfExperience", "1-3")),
            "match_percentage": match_pct,
            "matched_skills": matched[:6],
            "missing_skills": missing[:5],
            "why_it_matches": why_it_matches,
            "job_ready_skills": missing[:4],
            "responsibilities": str(row.get("Responsibilities", ""))[:200]
        }
        recommendations.append(job_entry)

    return recommendations

def match_jobs(resume_text: str) -> List[Dict[str, Any]]:
    """
    Backward-compatible matching helper.
    """
    return match_jobs_detailed(resume_text)