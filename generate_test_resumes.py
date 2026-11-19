import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

os.makedirs("test_resumes", exist_ok=True)
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#0f172a'),
    spaceAfter=4
)
subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontSize=9,
    leading=12,
    textColor=colors.HexColor('#475569'),
    spaceAfter=12
)
section_style = ParagraphStyle(
    'SectionHeader',
    parent=styles['Heading2'],
    fontSize=12,
    leading=15,
    textColor=colors.HexColor('#0369a1'),
    spaceBefore=8,
    spaceAfter=4
)
body_style = ParagraphStyle(
    'BodyTextCustom',
    parent=styles['Normal'],
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#1e293b'),
    spaceAfter=4
)

# 1. Machine Learning Engineer Resume
ml_pdf = "test_resumes/ml_engineer_resume.pdf"
doc1 = SimpleDocTemplate(ml_pdf, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
story1 = [
    Paragraph("Alex Rivera", title_style),
    Paragraph("Email: alex.rivera@example.com | Phone: (415) 555-0192 | LinkedIn: linkedin.com/in/alexrivera-ml | GitHub: github.com/alexrivera-ml", subtitle_style),
    Paragraph("Professional Summary", section_style),
    Paragraph("Results-oriented Machine Learning Engineer with 3+ years of experience designing, training, and deploying deep learning pipelines in production. Proficient in PyTorch, TensorFlow, Scikit-learn, and containerized cloud deployment with Docker and AWS.", body_style),
    Paragraph("Technical Skills", section_style),
    Paragraph("<b>Languages:</b> Python, SQL, C++, Bash<br/><b>Frameworks & Tools:</b> PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, Hugging Face, OpenCV, Docker, Kubernetes, Git, AWS, FastAPI", body_style),
    Paragraph("Professional Experience", section_style),
    Paragraph("<b>Machine Learning Engineer</b> - Apex Neural Systems (2022 - Present)", body_style),
    Paragraph("• Architected an NLP classification pipeline using Hugging Face Transformers and PyTorch, increasing inference throughput by 35%.", body_style),
    Paragraph("• Deployed low-latency inference microservices using FastAPI and Docker on AWS ECS, serving over 500,000 daily API requests with 99.9% uptime.", body_style),
    Paragraph("• Implemented automated model monitoring and drift detection with MLflow, reducing false positives by 18%.", body_style),
    Paragraph("Key Projects", section_style),
    Paragraph("<b>AI Document Intelligence System</b> | Python, PyTorch, Docker, FastAPI", body_style),
    Paragraph("• Developed end-to-end OCR and document classification system parsing 10,000+ unstructured financial reports monthly with 94% accuracy.", body_style),
    Paragraph("• Containerized model services using Docker and orchestrated automated CI/CD builds with GitHub Actions.", body_style),
    Paragraph("Education & Certifications", section_style),
    Paragraph("<b>B.Tech in Computer Science</b> - University of California, Berkeley (2018 - 2022)<br/>AWS Certified Machine Learning Specialist", body_style)
]
doc1.build(story1)
print(f"Generated {ml_pdf}")

# 2. Data Scientist Resume
ds_pdf = "test_resumes/data_scientist_resume.pdf"
doc2 = SimpleDocTemplate(ds_pdf, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
story2 = [
    Paragraph("Elena Chen", title_style),
    Paragraph("Email: elena.chen@example.com | Phone: (206) 555-0144 | LinkedIn: linkedin.com/in/elenachen-ds | GitHub: github.com/elenachen-ds", subtitle_style),
    Paragraph("Professional Summary", section_style),
    Paragraph("Data Scientist specializing in statistical modeling, predictive analytics, and experimentation. Expert in Python, SQL, Pandas, Tableau, and applying machine learning algorithms to drive customer growth and revenue optimization.", body_style),
    Paragraph("Technical Skills", section_style),
    Paragraph("<b>Languages & Analysis:</b> Python, SQL, R, Statistics, Exploratory Data Analysis, Hypothesis Testing<br/><b>Libraries & Platforms:</b> Pandas, NumPy, Scikit-Learn, Statsmodels, Matplotlib, Seaborn, Tableau, Power BI, Snowflake, Git", body_style),
    Paragraph("Professional Experience", section_style),
    Paragraph("<b>Data Scientist</b> - Global Retail Analytics (2021 - Present)", body_style),
    Paragraph("• Designed customer churn prediction model using Random Forest and Logistic Regression, reducing quarterly churn by 14%.", body_style),
    Paragraph("• Formulated A/B testing framework evaluating pricing strategies across 2.5 million active users, resulting in $1.2M incremental revenue.", body_style),
    Paragraph("• Automated SQL ETL data pipelines in Snowflake, reducing report generation latency from 4 hours to 15 minutes.", body_style),
    Paragraph("Key Projects", section_style),
    Paragraph("<b>E-Commerce Demand Forecasting Engine</b> | Python, Scikit-learn, SQL, Tableau", body_style),
    Paragraph("• Built time-series forecasting model predicting inventory requirements across 500+ SKUs with an 88% forecast accuracy rate.", body_style),
    Paragraph("• Designed executive Tableau dashboards tracking real-time conversion rates and margin volatility.", body_style),
    Paragraph("Education", section_style),
    Paragraph("<b>M.S. in Data Science</b> - University of Washington (2021)<br/><b>B.S. in Mathematics</b> - University of Washington (2019)", body_style)
]
doc2.build(story2)
print(f"Generated {ds_pdf}")

# 3. Software Engineer Resume
se_pdf = "test_resumes/software_engineer_resume.pdf"
doc3 = SimpleDocTemplate(se_pdf, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
story3 = [
    Paragraph("Marcus Vance", title_style),
    Paragraph("Email: marcus.vance@example.com | Phone: (512) 555-0188 | LinkedIn: linkedin.com/in/marcusvance | GitHub: github.com/marcusvance", subtitle_style),
    Paragraph("Professional Summary", section_style),
    Paragraph("Full-Stack Software Engineer with 4 years of experience building secure, scalable web applications. Proficient in React, Node.js, Express, PostgreSQL, MongoDB, TypeScript, and microservice architectures.", body_style),
    Paragraph("Technical Skills", section_style),
    Paragraph("<b>Frontend:</b> JavaScript, TypeScript, React, HTML5, CSS3, Tailwind CSS, Redux<br/><b>Backend & Databases:</b> Node.js, Express, Python, PostgreSQL, MongoDB, Redis, REST APIs, GraphQL<br/><b>DevOps & Tools:</b> Docker, Git, CI/CD, Jest, Agile", body_style),
    Paragraph("Professional Experience", section_style),
    Paragraph("<b>Software Engineer</b> - CloudScale Tech (2020 - Present)", body_style),
    Paragraph("• Developed scalable RESTful microservices in Node.js and Express handling 1.2M transactions daily.", body_style),
    Paragraph("• Engineered interactive React dashboards with real-time WebSocket state management, reducing client render times by 40%.", body_style),
    Paragraph("• Migrated monolithic data storage to PostgreSQL and Redis caching, improving database response time from 320ms to 45ms.", body_style),
    Paragraph("Key Projects", section_style),
    Paragraph("<b>Distributed Job Scheduling Platform</b> | React, Node.js, Redis, Docker, PostgreSQL", body_style),
    Paragraph("• Built distributed background job queue with Redis handling concurrent asynchronous tasks with fault tolerance.", body_style),
    Paragraph("• Containerized entire environment using Docker Compose and implemented end-to-end integration testing.", body_style),
    Paragraph("Education", section_style),
    Paragraph("<b>B.S. in Computer Science</b> - University of Texas at Austin (2016 - 2020)", body_style)
]
doc3.build(story3)
print(f"Generated {se_pdf}")
