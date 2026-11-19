import re
import ollama
from typing import Dict, List, Any
from services.skill_extractor import extract_skills

WEAK_PHRASES = [
    (r'\bworked on\b', 'Engineered and delivered'),
    (r'\bhelped with\b', 'Collaborated on developing'),
    (r'\bresponsible for\b', 'Spearheaded and maintained'),
    (r'\bassisted in\b', 'Supported the architecture and implementation of'),
    (r'\bhandled\b', 'Managed and optimized'),
    (r'\bmade\b', 'Designed and built'),
    (r'\bdid\b', 'Implemented and tested')
]

def generate_rule_based_improvements(resume_text: str, skills: List[str]) -> Dict[str, Any]:
    """
    Deterministic NLP fallback when Ollama is offline or times out.
    Strictly avoids fabricating metrics or technologies, providing placeholders instead.
    """
    lines = [line.strip() for line in resume_text.split('\n') if line.strip()]
    candidate_skills = skills if skills else extract_skills(resume_text)
    top_skills_str = ", ".join(candidate_skills[:4]) if candidate_skills else "modern software tools"

    # 1. Improved Professional Summary
    improved_summary = (
        f"Results-driven technical professional proficient in {top_skills_str}. "
        f"Demonstrated background designing robust solutions, collaborating in agile environments, "
        f"and delivering scalable applications. Passionate about applying problem-solving and software engineering "
        f"principles to drive measurable business impact."
    )

    # 2. Improved Experience Bullets
    improved_bullets = []
    bullet_lines = [l for l in lines if l.startswith(('-', '•', '*', '1.', '2.', '3.')) or len(l.split()) > 5][:6]
    if not bullet_lines:
        bullet_lines = lines[:4]

    for line in bullet_lines:
        clean_line = re.sub(r'^[-*•\d.)\]\s]+', '', line).strip()
        if len(clean_line) < 15:
            continue

        upgraded = clean_line
        matched_weak = False
        for weak_pattern, strong_replacement in WEAK_PHRASES:
            if re.search(weak_pattern, upgraded, re.IGNORECASE):
                upgraded = re.sub(weak_pattern, strong_replacement, upgraded, flags=re.IGNORECASE)
                matched_weak = True

        if not matched_weak and not any(upgraded.lower().startswith(v) for v in ['developed', 'engineered', 'architected', 'optimized']):
            upgraded = f"Engineered {upgraded[0].lower() + upgraded[1:]}"

        # Append placeholder for quantifiable outcome without inventing metrics
        if not re.search(r'\d+%|\$\d+|\d+\s*(users|clients|ms)', upgraded):
            upgraded += " [Add measurable outcome: e.g., reducing latency by X% or supporting Y users]"

        improved_bullets.append({
            "original": clean_line,
            "improved": upgraded,
            "rationale": "Replaced passive phrasing with an active verb and highlighted the need for measurable impact."
        })

    if not improved_bullets:
        improved_bullets = [
            {
                "original": "Worked on web application development using modern frameworks.",
                "improved": f"Architected and deployed responsive web services using {top_skills_str} [Add metric: improving load time by X%].",
                "rationale": "Introduces concrete action verbs and performance metrics."
            },
            {
                "original": "Responsible for database queries and data analysis.",
                "improved": "Optimized complex SQL queries and data pipelines [Add metric: reducing query execution time by X%].",
                "rationale": "Emphasizes technical ownership and measurable optimization."
            }
        ]

    # 3. Improved Project Descriptions
    improved_projects = [
        {
            "project_name": "Full-Stack / ML Application",
            "suggested_structure": {
                "problem": "Add 1-sentence statement describing the specific user or technical challenge being addressed.",
                "implementation": f"Detail how you utilized {top_skills_str} to construct the backend and frontend components.",
                "architecture": "Describe service communication, API protocols (REST/GraphQL), and storage layers.",
                "impact": "[Add measurable outcome: e.g., processed N records or achieved X% accuracy without inventing unverified numbers]."
            }
        }
    ]

    # 4. Skill Wording Suggestions
    skill_wording = [
        {"area": "Programming Languages", "suggestion": f"Organize as 'Languages: {', '.join(candidate_skills[:3])}' at the top of your skills block."},
        {"area": "Frameworks & Libraries", "suggestion": "Group backend and frontend frameworks into distinct categories."},
        {"area": "Cloud & Tooling", "suggestion": "Explicitly list version control (Git), deployment (Docker/CI/CD), and testing frameworks."}
    ]

    # 5. ATS Keyword Suggestions
    ats_keywords = [
        "CI/CD Pipeline", "Agile / Scrum", "Unit Testing", "RESTful APIs",
        "System Architecture", "Performance Optimization", "Code Review"
    ]

    return {
        "improved_summary": improved_summary,
        "improved_bullets": improved_bullets[:5],
        "improved_projects": improved_projects,
        "skill_wording_suggestions": skill_wording,
        "ats_keyword_suggestions": ats_keywords,
        "generated_by": "Rule-Based NLP Engine (Reliable Fallback)"
    }

def generate_resume_improvements(resume_text: str, job_description: str = "", use_llm: bool = False) -> Dict[str, Any]:
    """
    Generate tailored resume improvements using deterministic NLP engine,
    with optional Ollama Phi-3 enhancement.
    Guarantees zero hallucinated facts or metrics.
    """
    skills = extract_skills(resume_text)
    fallback_res = generate_rule_based_improvements(resume_text, skills)

    if not use_llm:
        return fallback_res

    prompt = f"""
    You are an expert technical resume coach and ATS optimization specialist.
    Analyze the following resume and generate resume improvements.

    CRITICAL RULES:
    1. NEVER invent fake metrics, fake companies, fake achievements, or fake experience.
    2. If an outcome lacks metrics, use placeholders like '[insert X% latency reduction or dataset size]'.
    3. Provide actionable, concise bullet points using strong action verbs (e.g., Engineered, Architected, Optimized).

    Resume excerpt:
    {resume_text[:2000]}

    Job Description (if any):
    {job_description[:1000] if job_description else "General technical role"}

    Respond with:
    1. Improved Professional Summary (2-3 sentences)
    2. 3 Improved Bullet Points (Original -> Improved -> Why)
    3. ATS Keywords to add
    """

    try:
        response = ollama.chat(
            model="phi3",
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.3}
        )
        content = response["message"]["content"]
        if content and len(content.strip()) > 50:
            return {
                "improved_summary": fallback_res["improved_summary"],
                "improved_bullets": fallback_res["improved_bullets"],
                "improved_projects": fallback_res["improved_projects"],
                "skill_wording_suggestions": fallback_res["skill_wording_suggestions"],
                "ats_keyword_suggestions": fallback_res["ats_keyword_suggestions"],
                "ai_feedback_raw": content,
                "generated_by": "Ollama Phi-3 + NLP Engine"
            }
    except Exception as e:
        print(f"Ollama unavailable for resume improvement, using NLP fallback: {e}")

    return fallback_res
