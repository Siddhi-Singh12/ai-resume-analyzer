import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import Resume from '../models/Resume.js'
import { analyzeResumeAI, callAIModule } from '../services/aiService.js'

/**
 * Upload and analyze resume with end-to-end intelligence
 */
export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No resume file uploaded. Please upload a PDF file.'
            })
        }

        let resumeText = ''
        try {
            const dataBuffer = fs.readFileSync(req.file.path)
            const pdfData = await pdf(dataBuffer)
            resumeText = pdfData.text || ''
        } catch (pdfErr) {
            console.warn('pdf-parse threw error, attempting python pdfplumber fallback:', pdfErr.message)
            try {
                const candidatePaths = [
                    path.resolve('ai-service/venv/bin/python'),
                    path.resolve('../ai-service/venv/bin/python'),
                    '/Users/siddhisingh/Desktop/ai-resume-analyzer/ai-service/venv/bin/python'
                ]
                const pythonBin = candidatePaths.find(p => fs.existsSync(p)) || 'python3'
                const script = 'import pdfplumber, sys\nwith pdfplumber.open(sys.argv[1]) as p:\n    print("\\n".join(pg.extract_text() or "" for pg in p.pages))'
                resumeText = execFileSync(pythonBin, ['-c', script, req.file.path], { encoding: 'utf-8' })
            } catch (pyErr) {
                console.error('All PDF parsing attempts failed:', pyErr.message)
                throw new Error(`Failed to extract text from PDF resume: ${pdfErr.message}`)
            }
        }

        const jobDescription = req.body.jobDescription || ''
        const targetRole = req.body.targetRole || ''


        // Run full AI pipeline via FastAPI
        const aiAnalysis = await analyzeResumeAI(resumeText, jobDescription, targetRole)

        const finalAtsScore = aiAnalysis.ats_score ?? aiAnalysis.score ?? 0
        const finalQualityScore = aiAnalysis.quality_score ?? 0
        const feedback = aiAnalysis.feedback || (finalAtsScore >= 75 ? 'Strong profile with solid fundamentals.' : 'Profile requires targeted optimization.')

        // Store analysis in MongoDB
        let savedResume = null
        try {
            const userId = req.user?.id || req.user?._id
            if (userId) {
                savedResume = await Resume.create({
                    user: userId,
                    fileName: req.file.originalname || req.file.filename,
                    resumeText,
                    jobDescription,
                    atsScore: finalAtsScore,
                    atsBreakdown: aiAnalysis.ats_breakdown || {},
                    qualityScore: finalQualityScore,
                    qualityAnalysis: aiAnalysis.quality_analysis || {},
                    predictedRole: aiAnalysis.predicted_role || 'Software Engineer',
                    predictedRoles: aiAnalysis.predicted_roles || [],
                    matchedSkills: aiAnalysis.matched_skills || [],
                    missingSkills: aiAnalysis.missing_skills || [],
                    skillGaps: aiAnalysis.skill_gaps || {},
                    matchedJobs: aiAnalysis.matched_jobs || [],
                    recommendations: aiAnalysis.recommendations || [],
                    resumeImprovements: aiAnalysis.resume_improvements || {},
                    sectionAnalysis: aiAnalysis.section_analysis || {},
                    projectAnalysis: aiAnalysis.project_analysis || [],
                    interviewPrep: aiAnalysis.interview_prep || {},
                    careerRoadmap: aiAnalysis.career_roadmap || [],
                    learningPriorities: aiAnalysis.learning_priorities || [],
                    summaries: aiAnalysis.summaries || {},
                    feedback: typeof feedback === 'string' ? feedback : JSON.stringify(feedback)
                })
            }
        } catch (dbErr) {
            console.warn('MongoDB save warning:', dbErr.message)
        }

        const responsePayload = {
            success: true,
            score: finalAtsScore,
            atsScore: finalAtsScore,
            atsBreakdown: aiAnalysis.ats_breakdown || {},
            qualityScore: finalQualityScore,
            qualityAnalysis: aiAnalysis.quality_analysis || {},
            predictedRole: aiAnalysis.predicted_role || 'Software Engineer',
            predictedRoles: aiAnalysis.predicted_roles || [],
            skills: aiAnalysis.skills || [],
            matchedSkills: aiAnalysis.matched_skills || [],
            missingSkills: aiAnalysis.missing_skills || [],
            skillGaps: aiAnalysis.skill_gaps || {},
            matchedJobs: aiAnalysis.matched_jobs || [],
            recommendations: aiAnalysis.recommendations || [],
            resumeImprovements: aiAnalysis.resume_improvements || {},
            sectionAnalysis: aiAnalysis.section_analysis || {},
            projectAnalysis: aiAnalysis.project_analysis || [],
            interviewPrep: aiAnalysis.interview_prep || {},
            careerRoadmap: aiAnalysis.career_roadmap || [],
            learningPriorities: aiAnalysis.learning_priorities || [],
            summaries: aiAnalysis.summaries || {},
            feedback,
            resumeName: req.file.originalname || req.file.filename,
            resumeText: resumeText.slice(0, 3000),
            resume: savedResume,
            analysisId: savedResume?._id
        }

        res.status(200).json({
            ...responsePayload,
            data: responsePayload
        })

    } catch (error) {
        console.error('Error in analyzeResume:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while analyzing resume'
        })
    }
}

/**
 * Fetch analysis history for the logged in user
 */
export const getAnalysisHistory = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        const history = await Resume.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(20)

        // Calculate score trend (ATS and Quality progressions)
        const trends = history.map(item => ({
            id: item._id,
            date: item.createdAt || item.uploadedAt,
            fileName: item.fileName,
            atsScore: item.atsScore,
            qualityScore: item.qualityScore,
            role: item.predictedRole
        })).reverse()

        res.status(200).json({
            success: true,
            count: history.length,
            history,
            trends
        })
    } catch (error) {
        console.error('Error fetching history:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

/**
 * Fetch a single previous analysis by ID
 */
export const getAnalysisById = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id
        const analysis = await Resume.findOne({ _id: req.params.id, user: userId })

        if (!analysis) {
            return res.status(404).json({ success: false, message: 'Analysis not found' })
        }

        res.status(200).json({
            success: true,
            data: analysis,
            ...analysis.toObject()
        })
    } catch (error) {
        console.error('Error fetching analysis by id:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

/**
 * Feature 11: Multi-Job Description Comparison
 */
export const compareMultipleJDs = async (req, res) => {
    try {
        const { resumeText, jobDescriptions, analysisId } = req.body

        let text = resumeText
        if (!text && analysisId) {
            const analysis = await Resume.findById(analysisId)
            if (analysis) {
                text = analysis.resumeText || ''
            }
        }

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: 'Resume text is required for comparison. Please provide resume text or a valid analysis ID.' })
        }

        if (!jobDescriptions || !Array.isArray(jobDescriptions) || jobDescriptions.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one job description is required for comparison' })
        }

        const comparisons = []
        for (let i = 0; i < jobDescriptions.length; i++) {
            const jd = jobDescriptions[i]
            const jdTitle = jd.title || `Job ${String.fromCharCode(65 + i)}`
            const jdText = jd.text || jd.description || jd

            // Call ATS breakdown and Skill Gaps for this JD
            const atsData = await callAIModule('/ats/analyze', {
                resume_text: text,
                job_description: typeof jdText === 'string' ? jdText : JSON.stringify(jdText)
            })

            const skillsData = await callAIModule('/skills/analyze', {
                resume_text: text,
                job_description: typeof jdText === 'string' ? jdText : JSON.stringify(jdText)
            })

            const atsScore = atsData?.ats_score ?? atsData?.overall_score ?? 0
            const skillsScore = atsData?.skills_score ?? atsData?.breakdown?.skills_score ?? 0

            comparisons.push({
                job_label: jdTitle,
                ats_score: atsScore,
                breakdown: atsData?.breakdown || atsData || {},
                matched_skills: skillsData?.gaps?.strong_skills || skillsData?.skills || [],
                missing_skills: skillsData?.gaps?.missing_skills || [],
                skill_match_percentage: skillsScore,
                main_gaps: (skillsData?.gaps?.missing_skills || []).slice(0, 3)
            })
        }

        res.status(200).json({
            success: true,
            comparisons
        })
    } catch (error) {
        console.error('Multi-JD comparison error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}
