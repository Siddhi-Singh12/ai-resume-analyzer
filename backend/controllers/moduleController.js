import { callAIModule } from '../services/aiService.js'

export const predictRoles = async (req, res) => {
    try {
        const { resume_text, resumeText } = req.body
        const text = resume_text || resumeText || ''
        const data = await callAIModule('/roles/predict', { resume_text: text })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const analyzeSkills = async (req, res) => {
    try {
        const { resume_text, resumeText, job_description, jobDescription, target_role, targetRole } = req.body
        const data = await callAIModule('/skills/analyze', {
            resume_text: resume_text || resumeText || '',
            job_description: job_description || jobDescription || '',
            target_role: target_role || targetRole || ''
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const recommendJobs = async (req, res) => {
    try {
        const { resume_text, resumeText } = req.body
        const data = await callAIModule('/jobs/recommend', { resume_text: resume_text || resumeText || '' })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const analyzeATS = async (req, res) => {
    try {
        const { resume_text, resumeText, job_description, jobDescription } = req.body
        const data = await callAIModule('/ats/analyze', {
            resume_text: resume_text || resumeText || '',
            job_description: job_description || jobDescription || ''
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const improveResume = async (req, res) => {
    try {
        const { resume_text, resumeText, job_description, jobDescription } = req.body
        const data = await callAIModule('/resume/improve', {
            resume_text: resume_text || resumeText || '',
            job_description: job_description || jobDescription || ''
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const generateSummary = async (req, res) => {
    try {
        const { resume_text, resumeText, target_role, targetRole } = req.body
        const data = await callAIModule('/resume/summary', {
            resume_text: resume_text || resumeText || '',
            target_role: target_role || targetRole || ''
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const analyzeSections = async (req, res) => {
    try {
        const { resume_text, resumeText } = req.body
        const data = await callAIModule('/resume/section-analyze', {
            resume_text: resume_text || resumeText || ''
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const analyzeProjects = async (req, res) => {
    try {
        const { resume_text, resumeText } = req.body
        const data = await callAIModule('/resume/project-analyze', {
            resume_text: resume_text || resumeText || ''
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const generateInterviewQuestions = async (req, res) => {
    try {
        const { resume_text, resumeText, role, difficulty, category } = req.body
        const data = await callAIModule('/interview/questions', {
            resume_text: resume_text || resumeText || '',
            role: role || 'Software Engineer',
            difficulty: difficulty || 'Medium',
            category: category || 'All'
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const generateCareerRoadmap = async (req, res) => {
    try {
        const { resume_text, resumeText, target_role, targetRole, missing_skills, missingSkills } = req.body
        const data = await callAIModule('/career/roadmap', {
            resume_text: resume_text || resumeText || '',
            target_role: target_role || targetRole || 'Machine Learning Engineer',
            missing_skills: missing_skills || missingSkills || null
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

export const generateLearningPlan = async (req, res) => {
    try {
        const { resume_text, resumeText, target_role, targetRole, missing_skills, missingSkills } = req.body
        const data = await callAIModule('/career/learning-plan', {
            resume_text: resume_text || resumeText || '',
            target_role: target_role || targetRole || 'Machine Learning Engineer',
            missing_skills: missing_skills || missingSkills || null
        })
        res.status(200).json({ success: true, ...data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}
