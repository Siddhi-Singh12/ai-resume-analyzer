# 🚀 AI Resume Analyzer

An advanced AI-powered Resume Analyzer built using the MERN Stack, FastAPI, Machine Learning, NLP, and Phi-3 LLM integration.

The platform analyzes resumes, predicts ATS scores, extracts skills, recommends job roles, performs semantic job matching, and provides intelligent AI-generated career guidance.

---

# 🌟 Features

## 🔐 Authentication & Security

- JWT-based Authentication
- Secure User Registration & Login
- Password Hashing using bcryptjs
- Protected Routes
- Helmet Security Middleware
- Express Rate Limiting
- MongoDB Sanitization
- XSS Protection

---

# 📄 Resume Analysis Features

- PDF Resume Upload
- Resume Text Extraction
- ATS Score Prediction
- Resume Role Prediction
- Skill Extraction using NLP
- Resume Parsing
- Resume Improvement Suggestions
- Resume Skill Gap Analysis

---

# 🤖 AI Features

- Phi-3 AI Chatbot Integration using Ollama
- AI Career Guidance
- AI Resume Feedback
- AI-based Resume Optimization Suggestions
- Intelligent Career Recommendations
- Semantic Job Matching using Sentence Transformers

---

# 📊 Machine Learning Features

- Logistic Regression Role Prediction Model
- Random Forest ATS Prediction Model
- TF-IDF Vectorization
- Semantic Similarity Matching
- Dataset-driven ML Pipeline
- NLP-based Resume Processing
- Scikit-learn Model Training
- Real-time Prediction APIs

---

# 🎨 Frontend Features

- Modern Responsive UI
- Dark Professional Theme
- React + Vite Frontend
- Protected Authentication Flow
- Resume Upload Dashboard
- AI Chatbot Interface
- Dynamic Navigation
- Production-style Routing

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Framer Motion

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- pdf-parse
- Helmet
- Express Rate Limit

---

## AI / ML Service

- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy
- NLTK
- Sentence Transformers
- Ollama
- Phi-3 LLM
- SpaCy

---

# 🧠 AI Architecture

```text
Frontend (React)
        │
        ▼
Node.js Backend API
        │
        ▼
FastAPI AI Service
        │
 ┌──────┼───────────────┐
 │       │                  |
 ▼      ▼                  ▼
ATS ML  Role ML           Phi-3 AI
Model   Model              Chatbot
```

---

# 📁 Project Structure

```text
ai-resume-analyzer/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── ai-service/
│   ├── datasets/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── training/
│   ├── utils/
│   ├── uploads/
│   ├── venv/
│   ├── app.py
│   └── requirements.txt
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# ⚙️ Installation Guide

# 1️⃣ Clone Repository

```bash
git clone https://github.com/Vanshika-devi/ai-resume-analyzer.git

cd ai-resume-analyzer
```

---

# 🌐 Frontend Setup

```bash
npm install
```

Run Frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🖥️ Backend Setup

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run Backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# 🧠 AI Service Setup

Go to AI service folder:

```bash
cd ai-service
```

---

# Create Virtual Environment

## Windows

```bash
py -3.11 -m venv venv
```

Activate virtual environment:

```bash
venv\Scripts\activate
```

---

# Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

# Install SpaCy Model

```bash
python -m spacy download en_core_web_sm
```

---

# 🤖 Ollama Setup

Install Ollama:

```text
https://ollama.com
```

Pull Phi-3 model:

```bash
ollama pull phi3
```

Start Ollama:

```bash
ollama serve
```

---

# ▶️ Quick Start Guide

### 1. Start MongoDB
Ensure MongoDB is running on default port `27017`:
```bash
brew services start mongodb-community
# or run directly:
mongod --dbpath /path/to/data/db
```

### 2. Start FastAPI AI Service (Port 8000)
```bash
cd ai-service
# activate virtual environment
source venv/bin/activate
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
Swagger API Documentation: `http://127.0.0.1:8000/docs`

### 3. Start Express Backend (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### 4. Start React Frontend (Port 5173)
```bash
# from root project directory
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. (Optional) Run Ollama Phi-3 for Conversational AI
```bash
ollama serve
ollama pull phi3
```
*Note: The platform features an intelligent, zero-latency rule-based NLP fallback engine for instant resume analysis, and connects to Ollama Phi-3 when available.*

---

# 🖥️ Interactive Dashboard Panels

1. **Executive Overview**: Explainable 0-100 ATS match, Resume Quality score, primary predicted role with calibrated confidence, and high-level gap overview.
2. **Job Recommendations**: Semantic matching against 1,068 verified job postings using Sentence Transformers, displaying fit reasons and job-ready skills.
3. **Resume Improvements**: Bullet-point rewrite generator replacing weak verbs with strong metrics and ATS keywords, plus 4 distinct summary variations with one-click copying.
4. **Section & Project Audit**: Complete audit of 8 essential resume sections and deep project analysis (architecture, tech stack, and quantified metrics).
5. **Interview Preparation**: Dynamic technical, project, and behavioral interview questions with STAR answers, filterable by difficulty (Easy, Medium, Hard) and category.
6. **Career Roadmap & Learning Plan**: 6-phase progressive career milestones with real dataset market demand percentages and actionable exercises.
7. **Multi-Job Description Comparator**: Side-by-side comparison of candidate resumes against multiple job postings with gap diagnostics.
8. **Analysis History & Progress Trends**: MongoDB persistent analysis logs with score progression tracking and instant state reload.
9. **Context-Aware Floating Chatbot**: AI career mentor maintaining live candidate resume context.

---

# 📡 Full API Endpoints

### Authentication APIs
- `POST /api/auth/register` - User registration with password hashing
- `POST /api/auth/login` - User login with JWT generation
- `GET /api/auth/profile` - Authenticated user profile

### Resume Analysis APIs
- `POST /api/analyze/resume` - Multi-part PDF upload with end-to-end ML & NLP analysis
- `GET /api/analyze/history` - MongoDB historical analyses for current user
- `GET /api/analyze/:id` - Fetch single analysis record by ID
- `POST /api/analyze/compare` - Compare single resume against multiple job descriptions

### Modular AI APIs
- `POST /api/roles/predict` - Multi-role prediction with supporting skills
- `POST /api/skills/analyze` - Skill extraction and gap analysis
- `POST /api/jobs/recommend` - Semantic job recommendations from dataset
- `POST /api/interview/questions` - Role and difficulty-tailored interview prep
- `POST /api/career/roadmap` - Target role career phase generator
- `POST /api/career/learning-plan` - Dataset-backed market demand learning plan
- `POST /api/resume/project-analyze` - Project architecture and metric extraction
- `POST /api/chatbot/chat` - Context-aware AI career assistant

---

# 📊 Machine Learning Models

| Model | Purpose |
|---|---|
| Logistic Regression | Job Role Prediction |
| Random Forest Regressor | ATS Score Prediction |
| Sentence Transformers | Semantic Job Matching |
| TF-IDF Vectorizer | Resume Text Processing |


---

# 🧠 Datasets Used

- AI_Resume_Screening.csv
- job_dataset.csv
- resume_dataset_1200.csv
- 06_skills.csv
- 05_person_skills.csv
- 04_experience.csv
- 03_education.csv
- 02_abilities.csv
- 01_people.csv

---

# 🔒 Security Features

- JWT Authentication
- Protected APIs
- Password Encryption
- Helmet Security
- Rate Limiting
- MongoDB Sanitization
- XSS Protection

---

# 📈 Future Improvements

- Resume vs Job Description Matching
- AI Interview Question Generator
- Resume Ranking System
- AI-powered Resume Builder
- Voice-based AI Assistant
- Cloud Deployment
- Docker Support
- CI/CD Pipeline
- Real-time Analytics Dashboard
- Advanced NLP Pipeline
- Vector Database Integration
- Multi-language Resume Analysis
- Multi-career support system

---

# 💡 Learning Outcomes

This project demonstrates:

- Full Stack MERN Development
- REST API Development
- FastAPI Integration
- Authentication & Security
- Machine Learning Pipelines
- NLP & Semantic Search
- AI Chatbot Integration
- Dataset Processing
- Model Training & Evaluation
- Production-style Project Architecture

---

# 👩‍💻 Author

## Vanshika Devi

GitHub:

```text
https://github.com/Vanshika-devi
```

---

# ⭐ Project Highlights

- Full Stack AI + ML Project
- MERN + FastAPI Hybrid Architecture
- Real-world Resume Intelligence System
- Semantic AI Matching
- Phi-3 AI Chatbot
- Dataset-driven Machine Learning
- Production-style Authentication System
- Portfolio-ready Advanced Project

---

# 📜 License

This project is licensed under the MIT License.
