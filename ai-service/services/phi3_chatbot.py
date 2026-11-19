import ollama
from typing import Dict, Any, Optional

def generate_contextual_chat_reply(message: str, context: Optional[Dict[str, Any]] = None) -> str:
    """
    Context-aware career & resume assistant.
    Injects candidate analysis context into Ollama Phi-3,
    with an intelligent contextual rule-based fallback if Ollama is unavailable.
    """
    msg_clean = (message or "").strip()
    if not msg_clean:
        return "Hello! I am your AI Career & Resume Assistant. Ask me anything about your ATS score, missing skills, career roadmap, or interview preparation."

    msg_lower = msg_clean.lower()
    ctx = context or {}

    ats_score = ctx.get("ats_score") or ctx.get("score") or "75"
    quality_score = ctx.get("quality_score") or "78"
    predicted_role = ctx.get("predicted_role") or "Software Engineer"
    matched_skills = ctx.get("matched_skills") or ["Python", "SQL"]
    missing_skills = ctx.get("missing_skills") or ["Docker", "AWS", "Kubernetes"]
    matched_str = ", ".join(matched_skills[:5]) if isinstance(matched_skills, list) else str(matched_skills)
    missing_str = ", ".join(missing_skills[:5]) if isinstance(missing_skills, list) else str(missing_skills)

    # 1. First, attempt Ollama Phi-3 with Context Injection
    prompt = f"""
You are an expert AI Career Coach and Technical Recruiter.
The user is asking a question about their resume analysis.

ANALYSIS CONTEXT:
- Target / Predicted Role: {predicted_role}
- Overall ATS Score: {ats_score}/100
- Resume Quality Score: {quality_score}/100
- Matched Skills: {matched_str}
- Missing Skills: {missing_str}

USER QUESTION:
"{msg_clean}"

INSTRUCTIONS:
Provide a clear, encouraging, and specific response using the analysis context above.
Be concise (2-4 paragraphs). Do NOT invent fake companies or imaginary certifications.
"""
    try:
        response = ollama.chat(
            model="phi3",
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.3}
        )
        content = response["message"]["content"]
        if content and len(content.strip()) > 30:
            return content.strip()
    except Exception as e:
        print(f"Ollama chat error (falling back to contextual knowledge engine): {e}")

    # 2. Intelligent Contextual Fallback Engine
    if "missing skill" in msg_lower or "what skill" in msg_lower or "gap" in msg_lower:
        return (
            f"Based on your resume analysis for {predicted_role}, your most critical missing skills are: **{missing_str}**. "
            f"Adding hands-on projects featuring these technologies and listing them under a dedicated Technical Skills section "
            f"will significantly elevate your ATS match and recruiter visibility."
        )

    if "ats score" in msg_lower or "score low" in msg_lower or "why is my score" in msg_lower or "score" in msg_lower:
        return (
            f"Your current ATS score is **{ats_score}%** (and Resume Quality score is **{quality_score}%**). "
            f"Key factors influencing this score include keyword overlap with target job descriptions, "
            f"measurable impact in project bullet points, and section formatting. "
            f"To boost your score into the 85%+ range, ensure your resume incorporates keywords like {missing_str} "
            f"and start your bullet points with strong action verbs (e.g., 'Engineered', 'Optimized', 'Automated')."
        )

    if "project" in msg_lower or "improve project" in msg_lower or "experience" in msg_lower:
        return (
            f"To optimize your projects for recruiters:\n"
            f"1. **Structure clearly:** State the Problem, Technical Architecture, Implementation ({matched_str}), and Impact.\n"
            f"2. **Add Measurable Results:** Quantify results with latency improvements, user scale, or dataset sizes [e.g., 'Reduced query latency by 30%'].\n"
            f"3. **Showcase Deployment:** Explicitly mention if the project is containerized with Docker or deployed to cloud platforms (AWS/Vercel)."
        )

    if "learn next" in msg_lower or "what should i learn" in msg_lower or "roadmap" in msg_lower:
        top_learn = missing_skills[0] if missing_skills else "Docker"
        return (
            f"Your top learning priority is **{top_learn}**, followed by **{missing_str}**. "
            f"Our dataset shows these skills appear in a significant percentage of postings for {predicted_role}. "
            f"Start with a foundational tutorial, then build a deployed microservice or pipeline incorporating it into your portfolio."
        )

    if "interview" in msg_lower or "question" in msg_lower or "ask" in msg_lower:
        return (
            f"For a **{predicted_role}** interview, expect questions on:\n"
            f"1. **Core Proficiency:** Deep-dive questions on {matched_skills[0] if matched_skills else 'your primary language'}.\n"
            f"2. **Architecture:** Explaining trade-offs in your project architecture and how you handled data bottlenecks.\n"
            f"3. **Missing Skills Gap:** How you plan to adopt {missing_skills[0] if missing_skills else 'modern cloud tools'}.\n"
            f"Check the Interview Preparation tab on your dashboard for tailored questions with sample answers!"
        )

    if "job" in msg_lower or "recommend" in msg_lower:
        return (
            f"Jobs were recommended by computing semantic similarity between your resume text and our dataset of 1,068 verified tech positions. "
            f"Your profile strongly aligns with roles requiring {matched_str}. To become 100% job-ready for the top matches, focus on bridging {missing_str}."
        )

    return (
        f"I'm here to assist your career journey as a {predicted_role}! "
        f"Your current profile demonstrates solid foundations in {matched_str}. "
        f"You can ask me about how to bridge missing skills ({missing_str}), how to prepare for interviews, or how to enhance your project descriptions."
    )