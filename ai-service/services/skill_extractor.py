import os
import re
from typing import Dict, List, Set, Any
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILLS_PATH = os.path.join(BASE_DIR, "datasets", "06_skills.csv")
JOB_DATASET_PATH = os.path.join(BASE_DIR, "datasets", "job_dataset.csv")

# Standard core industry skills across software, ML, data, cloud, and devops
CORE_TECH_SKILLS = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Golang",
    "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "SQL", "Bash", "Shell",
    # Web & Frameworks
    "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Node.js", "Express",
    "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", ".NET Core",
    "HTML", "HTML5", "CSS", "CSS3", "Tailwind CSS", "Bootstrap", "Redux", "GraphQL", "REST APIs",
    # ML & Data Science
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP", "Natural Language Processing",
    "Computer Vision", "TensorFlow", "PyTorch", "Keras", "Scikit-Learn", "Pandas", "NumPy",
    "SciPy", "Matplotlib", "Seaborn", "OpenCV", "Transformers", "Hugging Face", "LLMs",
    "LangChain", "Ollama", "MLflow", "Data Analysis", "Data Visualization", "Big Data",
    "Spark", "Apache Spark", "Hadoop", "Tableau", "Power BI", "Statistics",
    # Cloud & DevOps
    "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes",
    "CI/CD", "Git", "GitHub", "GitLab", "Jenkins", "Terraform", "Ansible", "Linux",
    "Microservices", "Serverless", "Kafka", "RabbitMQ", "Nginx",
    # Databases
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "Elasticsearch",
    "Cassandra", "Oracle", "Firebase", "Supabase", "SQL Server",
    # CS Fundamentals & Methodologies
    "Data Structures", "Algorithms", "System Design", "Agile", "Scrum", "OOP",
    "Object-Oriented Programming", "Unit Testing", "Test Driven Development", "TDD"
]

ALL_KNOWN_SKILLS: Set[str] = set(CORE_TECH_SKILLS)

# Optionally enrich with skills dataset if available
try:
    if os.path.exists(SKILLS_PATH):
        skills_df = pd.read_csv(SKILLS_PATH, nrows=5000)
        raw_skills = skills_df.iloc[:, -1].dropna().tolist()
        for s in raw_skills:
            clean_s = str(s).strip()
            if 2 < len(clean_s) < 30 and not any(ch in clean_s for ch in ['<', '>', '{', '}', '\\', ';']):
                ALL_KNOWN_SKILLS.add(clean_s)
except Exception as e:
    print(f"Warning: Could not load additional skills from CSV: {e}")

# Pre-compile case-insensitive regex patterns for known skills
SKILL_PATTERNS = []
for skill in sorted(ALL_KNOWN_SKILLS, key=lambda s: len(s), reverse=True):
    # Escape special regex characters in skill names like C++, C#, .NET
    escaped = re.escape(skill)
    # If the skill starts or ends with alphanumeric, enforce word boundary
    prefix = r'\b' if re.match(r'^\w', skill) else r'(?:^|\s)'
    suffix = r'\b' if re.match(r'.*\w$', skill) else r'(?:$|\s)'
    pattern = re.compile(prefix + escaped + suffix, re.IGNORECASE)
    SKILL_PATTERNS.append((skill, pattern))

def extract_skills(text: str) -> List[str]:
    """
    Extract skills from text dynamically using boundary-enforced regex matching.
    """
    if not text or not text.strip():
        return []

    found = set()
    for skill, pattern in SKILL_PATTERNS:
        if pattern.search(text):
            found.add(skill)

    # Clean duplicates like ("React", "React.js") keeping the canonical one
    result = []
    found_lower = {s.lower(): s for s in found}
    for s in sorted(found, key=lambda x: x.lower()):
        result.append(s)

    return result

def analyze_skill_gaps(resume_text: str, job_description: str = "", target_role: str = "") -> Dict[str, List[str]]:
    """
    Perform 4-category Skill Gap Analysis:
    - STRONG SKILLS: prominent skills clearly established in the resume
    - DEVELOPING SKILLS: foundational or secondary skills mentioned
    - MISSING SKILLS: skills required by JD or role but missing from resume
    - RECOMMENDED SKILLS: complementary high-value skills to advance career
    """
    resume_skills = extract_skills(resume_text)
    resume_skills_lower = {s.lower(): s for s in resume_skills}

    jd_skills = extract_skills(job_description) if job_description else []
    jd_skills_lower = {s.lower(): s for s in jd_skills}

    # Count occurrences in resume text to separate Strong vs Developing
    text_lower = (resume_text or "").lower()
    strong_skills = []
    developing_skills = []

    for skill in resume_skills:
        # Check occurrences
        count = len(re.findall(r'\b' + re.escape(skill.lower()) + r'\b', text_lower))
        if count >= 2 or skill in ["Python", "SQL", "JavaScript", "React", "Java", "Docker", "Machine Learning"]:
            strong_skills.append(skill)
        else:
            developing_skills.append(skill)

    if not strong_skills and developing_skills:
        strong_skills = developing_skills[:len(developing_skills)//2]
        developing_skills = developing_skills[len(developing_skills)//2:]

    # Missing Skills: required in JD but not in Resume
    missing_skills = []
    for s_lower, s_original in jd_skills_lower.items():
        if s_lower not in resume_skills_lower:
            missing_skills.append(s_original)

    # If no JD provided or few missing skills found, pull from standard role benchmarks
    benchmark_skills = {
        "Data Scientist": ["Python", "SQL", "Pandas", "Scikit-Learn", "Machine Learning", "Statistics", "Docker", "AWS"],
        "Machine Learning Engineer": ["Python", "PyTorch", "TensorFlow", "Docker", "MLOps", "Kubernetes", "AWS", "Git"],
        "AI Researcher": ["PyTorch", "Transformers", "NLP", "Deep Learning", "Mathematics", "Computer Vision"],
        "Software Engineer": ["Data Structures", "Algorithms", "System Design", "Docker", "CI/CD", "SQL", "Git"],
        "Cloud / DevOps Engineer": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Jenkins"]
    }

    role_key = target_role if target_role in benchmark_skills else "Software Engineer"
    role_bench = benchmark_skills.get(role_key, benchmark_skills["Software Engineer"])

    if len(missing_skills) < 3:
        for b_skill in role_bench:
            if b_skill.lower() not in resume_skills_lower and b_skill not in missing_skills:
                missing_skills.append(b_skill)
            if len(missing_skills) >= 5:
                break

    # Recommended Skills: industry standard high-leverage skills
    recommended_pool = ["Docker", "Kubernetes", "AWS", "CI/CD", "System Design", "MLflow", "TypeScript", "GraphQL", "Redis", "Kafka", "PyTorch"]
    recommended_skills = []
    for rec in recommended_pool:
        if rec.lower() not in resume_skills_lower and rec not in missing_skills:
            recommended_skills.append(rec)
        if len(recommended_skills) >= 5:
            break

    return {
        "strong_skills": strong_skills[:12],
        "developing_skills": developing_skills[:8],
        "missing_skills": missing_skills[:8],
        "recommended_skills": recommended_skills[:6]
    }