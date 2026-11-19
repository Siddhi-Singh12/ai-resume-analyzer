import re
from typing import Dict, List, Any
from services.skill_extractor import extract_skills

BULLET_PREFIXES = ('-', '•', '*', '–', '—', '(cid:127)', '1.', '2.', '3.', '4.', '5.', '>', '▪', '◦')
NEXT_SECTION_HEADERS = [
    'experience', 'work experience', 'professional experience', 'employment history',
    'education', 'academic background', 'qualifications',
    'skills', 'technical skills', 'core competencies',
    'certifications', 'certificates', 'licenses',
    'achievements', 'awards', 'honors', 'publications',
    'summary', 'professional summary', 'profile'
]

PROJECT_SECTION_HEADERS = [
    'key projects', 'academic projects', 'personal projects', 'featured projects',
    'selected projects', 'technical projects', 'capstone projects', 'projects'
]

COMMON_ACTION_STARTERS = {
    'developed', 'built', 'created', 'designed', 'implemented', 'optimized',
    'engineered', 'spearheaded', 'managed', 'led', 'architected', 'deployed',
    'integrated', 'automated', 'delivered', 'achieved', 'improved', 'reduced',
    'trained', 'analyzed', 'orchestrated', 'configured', 'supported'
}

def clean_bullet_line(line: str) -> str:
    cleaned = re.sub(r'\(cid:\d+\)', '', line).strip()
    for prefix in BULLET_PREFIXES:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):].strip()
            break
    return cleaned.strip()

def is_project_header(line_lower: str) -> bool:
    for h in PROJECT_SECTION_HEADERS:
        # Match whole phrase or header boundary
        if re.search(r'\b' + re.escape(h) + r'\b', line_lower):
            # Must be a header line, not a sentence containing 'projects'
            if len(line_lower.split()) <= 5:
                return True
    return False

def is_next_section(line_lower: str) -> bool:
    for h in NEXT_SECTION_HEADERS:
        if re.search(r'\b' + re.escape(h) + r'\b', line_lower):
            if len(line_lower.split()) <= 5:
                return True
    return False

def is_bullet_line(line: str) -> bool:
    stripped = line.strip()
    if re.search(r'\(cid:\d+\)', line):
        return True
    for prefix in BULLET_PREFIXES:
        if stripped.startswith(prefix):
            return True
    return False

def is_probable_title(line: str) -> bool:
    if is_bullet_line(line):
        return False
    clean = clean_bullet_line(line)
    if not clean or len(clean) < 4:
        return False
    if clean.endswith(('.', ';', ',')):
        return False
    words = clean.split()
    if len(words) > 12:
        return False
    first_word = words[0].lower().rstrip(':,.-')
    if first_word in COMMON_ACTION_STARTERS:
        return False
    if '|' in line or ' - ' in line:
        return True
    if len(words) <= 7:
        if words[0][0].isupper():
            return True
    return False

def analyze_projects(resume_text: str) -> List[Dict[str, Any]]:
    """
    Parses project blocks in the resume and evaluates technical depth, clarity,
    technologies, problem statement, solution, architecture, impact, deployment,
    and measurable results.
    """
    if not resume_text:
        return []

    lines = [l.strip() for l in resume_text.split('\n') if l.strip()]
    project_blocks = []
    current_proj = None
    in_project_section = False

    for line in lines:
        line_lower = line.lower()

        if is_project_header(line_lower):
            in_project_section = True
            if current_proj and current_proj.get('lines'):
                project_blocks.append(current_proj)
                current_proj = None
            continue
        elif in_project_section and is_next_section(line_lower):
            if current_proj and current_proj.get('lines'):
                project_blocks.append(current_proj)
                current_proj = None
            in_project_section = False
            continue

        if in_project_section:
            cleaned_line = clean_bullet_line(line)
            if is_probable_title(line):
                if current_proj and current_proj.get('lines'):
                    project_blocks.append(current_proj)
                raw_title = cleaned_line.split('|')[0].split(' - ')[0].split(':')[0].strip()
                current_proj = {"title": clean_bullet_line(raw_title), "lines": [line]}
            else:
                if current_proj:
                    current_proj["lines"].append(line)
                elif '|' in cleaned_line:
                    raw_title = cleaned_line.split('|')[0].strip()
                    current_proj = {"title": clean_bullet_line(raw_title), "lines": [line]}

    if current_proj and current_proj.get('lines'):
        project_blocks.append(current_proj)

    # If no explicitly sectioned projects found, look for lines with tech stacks or pipes in the full text
    if not project_blocks:
        for line in lines:
            if '|' in line and any(ch.isalpha() for ch in line):
                parts = line.split('|')
                if len(parts[0].split()) <= 7 and len(parts[1].split()) <= 10:
                    skills_in_part = extract_skills(parts[1])
                    if skills_in_part:
                        project_blocks.append({
                            "title": clean_bullet_line(parts[0].strip()),
                            "lines": [line]
                        })

    analyzed_projects = []

    for block in project_blocks[:4]:
        title = block["title"]
        # Join lines handling wrapped text
        block_text = " ".join(block["lines"])
        block_lower = block_text.lower()

        # 1. Technologies
        techs = extract_skills(block_text)

        # 2. Deployment
        has_deployment = any(w in block_lower for w in ['docker', 'aws', 'gcp', 'heroku', 'vercel', 'deploy', 'hosted', 'ci/cd', 'kubernetes', 'ecs', 'cloud'])

        # 3. Measurable Results
        has_metrics = bool(re.search(r'\d+%', block_lower) or re.search(r'\b\d+\s*(users|requests|ms|fps|queries|accuracy|records|daily|monthly)', block_lower))

        # 4. Architecture
        has_architecture = any(w in block_lower for w in ['architecture', 'microservices', 'pipeline', 'frontend', 'backend', 'api', 'database', 'rest', 'fastapi', 'distributed'])

        # 5. Problem statement & Solution
        has_problem = any(w in block_lower for w in ['problem', 'challenge', 'aimed to', 'designed to', 'built to', 'address', 'unstructured'])
        has_solution = any(w in block_lower for w in ['implemented', 'engineered', 'developed', 'created', 'solved', 'architected'])

        # Scoring
        depth_score = min(96, 45 + len(techs) * 8 + (15 if has_architecture else 0) + (15 if has_deployment else 0))
        clarity_score = 90 if len(block["lines"]) >= 2 else 70

        current_summary = block_text[:220] + ("..." if len(block_text) > 220 else "")
        tech_str = ", ".join(techs[:3]) if techs else "modern libraries and APIs"

        suggested_structure = {
            "problem": f"Define the core challenge resolved by {title} (e.g., accelerating data processing or automating manual workflows).",
            "implementation": f"Describe technical components engineered with {tech_str}.",
            "architecture": "Detail service structure, communication protocols (REST/gRPC), and persistence tiers.",
            "impact": "[Add verified metric: e.g. 'Reduced latency by X%' or 'Processed N monthly records' - insert real values if measured]."
        }

        suggestions = []
        if not has_metrics:
            suggestions.append("Incorporate quantifiable outcomes (e.g. latency improvement, throughput, or dataset scale).")
        if not has_deployment:
            suggestions.append("Detail hosting and deployment infrastructure (e.g., Docker containerization, AWS, or CI/CD).")
        if not has_architecture:
            suggestions.append("Elaborate on system architecture (e.g., microservices, caching layer, or message queues).")

        analyzed_projects.append({
            "title": title,
            "current_description": current_summary,
            "technologies": techs,
            "technical_depth_score": depth_score,
            "clarity_score": clarity_score,
            "has_problem_statement": has_problem,
            "has_solution": has_solution,
            "has_architecture": has_architecture,
            "has_deployment": has_deployment,
            "has_measurable_results": has_metrics,
            "suggested_structure": suggested_structure,
            "suggestions": suggestions if suggestions else ["Strong technical project description with clear implementation."]
        })

    return analyzed_projects
