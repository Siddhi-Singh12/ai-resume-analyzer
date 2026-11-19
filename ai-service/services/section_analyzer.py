import re
from typing import Dict, List, Any
from services.skill_extractor import extract_skills

SECTION_PATTERNS = {
    "contact": [r'email', r'phone', r'contact', r'linkedin', r'github'],
    "summary": [r'summary', r'profile', r'objective', r'about me', r'professional summary'],
    "education": [r'education', r'academic', r'qualification', r'degree', r'university', r'college', r'gpa'],
    "experience": [r'experience', r'work history', r'employment', r'internship', r'professional experience'],
    "projects": [r'projects', r'personal projects', r'academic projects', r'key projects'],
    "skills": [r'skills', r'technical skills', r'technologies', r'core competencies'],
    "certifications": [r'certifications', r'certificates', r'licenses', r'credentials', r'courses'],
    "achievements": [r'achievements', r'awards', r'honors', r'accomplishments', r'publications']
}

def analyze_all_sections(resume_text: str) -> Dict[str, Any]:
    """
    Evaluates individual resume sections for presence, quality score,
    strengths, problems, and actionable suggestions.
    """
    if not resume_text:
        return {}

    text_lower = resume_text.lower()
    sections_result = {}

    for section_name, patterns in SECTION_PATTERNS.items():
        is_present = any(re.search(r'\b' + pat + r'\b', text_lower) for pat in patterns)

        strengths = []
        problems = []
        suggestions = []
        score = 0

        if section_name == "contact":
            has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text))
            has_phone = bool(re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', resume_text))
            has_linkedin = 'linkedin' in text_lower
            has_github = 'github' in text_lower or 'portfolio' in text_lower

            score = (35 if has_email else 0) + (25 if has_phone else 0) + (20 if has_linkedin else 0) + (20 if has_github else 0)
            is_present = has_email or has_phone

            if has_email and has_phone:
                strengths.append("Direct contact channels (email & phone) clearly present")
            else:
                problems.append("Missing primary contact details (either email or phone)")
                suggestions.append("Place email and phone number at the top header.")

            if has_linkedin and has_github:
                strengths.append("LinkedIn and GitHub profiles linked for code verification")
            else:
                problems.append("Missing LinkedIn or GitHub profile link")
                suggestions.append("Add clickable links to your LinkedIn and GitHub/portfolio.")

        elif section_name == "summary":
            if is_present:
                score = 80
                strengths.append("Summary section exists to frame candidate narrative")
                if len(resume_text) > 100:
                    suggestions.append("Keep summary within 2-3 focused sentences highlighting top competencies.")
            else:
                score = 30
                problems.append("No professional summary found")
                suggestions.append("Add a concise 3-line summary emphasizing core tech stack and career goal.")

        elif section_name == "education":
            if is_present:
                score = 88
                strengths.append("Formal education and degree credentials identified")
                suggestions.append("Ensure degree, major, institution name, and graduation year are clear.")
            else:
                score = 40
                problems.append("Education section missing or ambiguous")
                suggestions.append("Include your university, degree title, and graduation year.")

        elif section_name == "experience":
            if is_present:
                has_action_verbs = any(v in text_lower for v in ['developed', 'led', 'architected', 'built', 'optimized'])
                has_metrics = bool(re.search(r'\d+%', text_lower) or re.search(r'\$\d+', text_lower))
                score = 75 + (15 if has_action_verbs else 0) + (10 if has_metrics else 0)
                if has_action_verbs:
                    strengths.append("Uses active verbs in role descriptions")
                if not has_metrics:
                    problems.append("Descriptions lack quantified outcomes and business impact")
                    suggestions.append("Add measurable outcomes (e.g. 'reduced latency by 25%').")
            else:
                score = 50
                problems.append("No dedicated professional work experience section detected")
                suggestions.append("Add relevant internships, freelance work, or open-source contributions.")

        elif section_name == "projects":
            if is_present:
                skills_in_projects = extract_skills(resume_text)
                score = 85 if len(skills_in_projects) >= 4 else 70
                strengths.append(f"Projects highlight applied implementation of {len(skills_in_projects)} technologies")
                problems.append("Some project bullets may be generic or lack explicit system architecture details")
                suggestions.append("Structure each project with Problem, Technologies, Architecture, and Impact.")
            else:
                score = 35
                problems.append("Projects section is missing")
                suggestions.append("Add 2-3 detailed technical projects with GitHub repository links.")

        elif section_name == "skills":
            skills = extract_skills(resume_text)
            if is_present or len(skills) >= 4:
                is_present = True
                score = min(95, 60 + len(skills) * 3)
                strengths.append(f"Identified {len(skills)} distinct technical skills")
                suggestions.append("Organize skills into categories (Languages, Frameworks, Cloud, Tools).")
            else:
                score = 35
                problems.append("Technical skills section missing or sparse")
                suggestions.append("Create a dedicated Technical Skills section organized by category.")

        elif section_name == "certifications":
            if is_present:
                score = 85
                strengths.append("Industry certifications or specialized course credentials noted")
            else:
                score = 50
                problems.append("No industry certifications listed")
                suggestions.append("Include relevant cloud or technical certifications (AWS, GCP, Coursera, etc.).")

        elif section_name == "achievements":
            if is_present:
                score = 85
                strengths.append("Mentions specific honors, hackathons, or accomplishments")
            else:
                score = 50
                problems.append("No distinct achievements or honors mentioned")
                suggestions.append("Highlight academic honors, hackathon victories, or open-source recognition.")

        sections_result[section_name] = {
            "name": section_name.capitalize(),
            "present": is_present,
            "quality_score": score,
            "strengths": strengths if strengths else ["Standard layout"],
            "problems": problems if problems else ["No critical issues"],
            "suggestions": suggestions if suggestions else ["Maintain updated content"]
        }

    return sections_result
