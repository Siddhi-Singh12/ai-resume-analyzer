import re
from typing import Dict, List, Any

ACTION_VERBS = {
    'developed', 'built', 'created', 'designed', 'implemented', 'optimized',
    'engineered', 'spearheaded', 'managed', 'led', 'architected', 'deployed',
    'integrated', 'automated', 'delivered', 'achieved', 'improved', 'reduced',
    'increased', 'scaled', 'orchestrated', 'maintained', 'analyzed', 'trained',
    'collaborated', 'accelerated', 'transformed', 'formulated', 'streamlined'
}

COMMON_SECTIONS = {
    'contact': [r'email', r'phone', r'contact', r'linkedin', r'github'],
    'summary': [r'summary', r'profile', r'objective', r'about me', r'professional summary'],
    'education': [r'education', r'academic', r'qualification', r'degree', r'university', r'college'],
    'skills': [r'skills', r'technical skills', r'technologies', r'competencies', r'core competencies'],
    'experience': [r'experience', r'work history', r'employment', r'work experience', r'professional experience'],
    'projects': [r'projects', r'personal projects', r'academic projects', r'key projects'],
    'certifications': [r'certifications', r'certificates', r'licenses', r'credentials'],
    'achievements': [r'achievements', r'awards', r'honors', r'accomplishments', r'extracurricular']
}

def analyze_resume_quality(resume_text: str) -> Dict[str, Any]:
    """
    Comprehensive, explainable Resume Quality Score (0-100)
    evaluating structure, contact, content depth, action verbs, and quantifiable metrics.
    """
    if not resume_text or not resume_text.strip():
        return {
            "quality_score": 20,
            "section_scores": {},
            "strengths": ["Resume uploaded"],
            "weaknesses": ["Empty or unreadable resume text"],
            "improvements": ["Please upload a resume containing readable text (PDF/DOCX)."],
            "word_count": 0,
            "metrics_count": 0,
            "action_verbs_count": 0,
            "contact_details": {"has_email": False, "has_phone": False, "has_linkedin": False, "has_github": False}
        }

    text_lower = resume_text.lower()
    words = re.findall(r'\b[a-zA-Z0-9_\-\.\+]+\b', resume_text)
    word_count = len(words)

    # 1. Contact Information Analysis
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text))
    has_phone = bool(re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', resume_text))
    has_linkedin = 'linkedin.com' in text_lower or 'linkedin' in text_lower
    has_github = 'github.com' in text_lower or 'github' in text_lower or 'portfolio' in text_lower

    contact_score = 0
    if has_email: contact_score += 35
    if has_phone: contact_score += 25
    if has_linkedin: contact_score += 20
    if has_github: contact_score += 20

    # 2. Section Completeness Analysis
    detected_sections = {}
    for section, patterns in COMMON_SECTIONS.items():
        found = any(re.search(r'\b' + pat + r'\b', text_lower) for pat in patterns)
        detected_sections[section] = found

    section_count = sum(detected_sections.values())
    structure_score = min(100, int((section_count / len(COMMON_SECTIONS)) * 115))

    # 3. Action Verbs Detection
    found_action_verbs = [v for v in ACTION_VERBS if re.search(r'\b' + v + r'\b', text_lower)]
    action_verbs_count = len(found_action_verbs)
    verbs_score = min(100, int((action_verbs_count / 10) * 100))

    # 4. Quantifiable Metrics Detection (%, numbers, currency, scale)
    metric_matches = re.findall(r'(\b\d+(\.\d+)?%|\$\s?\d+[\d,]*|\b\d+\+\s?(users|clients|requests|projects|years|team)|improved by \d+|reduced by \d+|increased by \d+)', text_lower)
    number_instances = len(re.findall(r'\b\d{1,4}(,\d{3})*(\.\d+)?\b', resume_text))
    metrics_count = len(metric_matches)
    quant_score = min(100, int((metrics_count * 20) + min(40, number_instances * 2)))

    # 5. Length & Formatting Appropriateness
    if 350 <= word_count <= 950:
        length_score = 95
    elif 200 <= word_count < 350:
        length_score = 70
    elif 950 < word_count <= 1400:
        length_score = 80
    else:
        length_score = 50

    # 6. Technical / Section Content Depth
    content_depth = 60
    if detected_sections.get('projects') and detected_sections.get('skills'):
        content_depth += 20
    if detected_sections.get('experience'):
        content_depth += 10
    if detected_sections.get('certifications') or detected_sections.get('achievements'):
        content_depth += 10

    # Overall Quality Score Calculation (Weighted)
    quality_score = int(
        (contact_score * 0.15) +
        (structure_score * 0.25) +
        (verbs_score * 0.20) +
        (quant_score * 0.15) +
        (length_score * 0.10) +
        (content_depth * 0.15)
    )
    quality_score = max(25, min(98, quality_score))

    # Compile Strengths, Weaknesses, and Improvements
    strengths: List[str] = []
    weaknesses: List[str] = []
    improvements: List[str] = []

    if has_email and has_phone:
        strengths.append("Professional contact information with direct reachability")
    if has_linkedin or has_github:
        strengths.append("Includes online professional profile links (LinkedIn/GitHub/Portfolio)")
    else:
        weaknesses.append("Missing professional online profiles (LinkedIn or GitHub)")
        improvements.append("Add a LinkedIn URL and GitHub or personal portfolio link to showcase work.")

    if detected_sections.get('projects'):
        strengths.append("Dedicated Projects section highlighting practical implementation")
    else:
        weaknesses.append("Missing or unclear Projects section")
        improvements.append("Add a structured Projects section showcasing key technologies, architecture, and impact.")

    if detected_sections.get('skills'):
        strengths.append("Clear Skills section organizing technical proficiencies")
    else:
        weaknesses.append("No explicit Skills section detected")
        improvements.append("Create a dedicated Technical Skills section categorized by languages, frameworks, and tools.")

    if action_verbs_count >= 6:
        strengths.append(f"Strong use of active impact verbs ({', '.join(found_action_verbs[:4])})")
    else:
        weaknesses.append("Bullet points rely on passive descriptions rather than action verbs")
        improvements.append("Start bullet points with strong action verbs (e.g., 'Engineered', 'Optimized', 'Automated').")

    if metrics_count >= 2:
        strengths.append("Includes quantifiable impact and measurable results")
    else:
        weaknesses.append("Few or no measurable metrics / quantifiable results found in project/experience descriptions")
        improvements.append("Quantify outcomes using metrics such as percentage performance improvement, latency reduction, or scale.")

    if not detected_sections.get('summary'):
        weaknesses.append("Missing a concise professional summary or objective")
        improvements.append("Add a 2-3 line professional summary highlighting your core expertise and target domain.")

    if word_count < 300:
        weaknesses.append(f"Resume text is relatively brief ({word_count} words)")
        improvements.append("Expand on project contributions and technical responsibilities to give recruiters more depth.")
    elif word_count > 1200:
        weaknesses.append(f"Resume may be too verbose ({word_count} words)")
        improvements.append("Condense bullet points to focus on high-impact results for better ATS parsing efficiency.")

    if not strengths:
        strengths.append("Standard textual layout suitable for ATS extraction")
    if not weaknesses:
        weaknesses.append("Minor opportunities for bullet point conciseness and keyword enrichment")
    if not improvements:
        improvements.append("Continue tailoring technical keywords towards specific job target requirements.")

    return {
        "quality_score": quality_score,
        "section_scores": {
            "contact": contact_score,
            "structure": structure_score,
            "action_verbs": verbs_score,
            "quantifiable_impact": quant_score,
            "length_and_formatting": length_score,
            "content_depth": content_depth
        },
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvements": improvements,
        "word_count": word_count,
        "metrics_count": metrics_count,
        "action_verbs_count": action_verbs_count,
        "detected_sections": detected_sections,
        "contact_details": {
            "has_email": has_email,
            "has_phone": has_phone,
            "has_linkedin": has_linkedin,
            "has_github": has_github
        }
    }
