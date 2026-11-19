import express from 'express'
import {
    predictRoles,
    analyzeSkills,
    recommendJobs,
    analyzeATS,
    improveResume,
    generateSummary,
    analyzeSections,
    analyzeProjects,
    generateInterviewQuestions,
    generateCareerRoadmap,
    generateLearningPlan
} from '../controllers/moduleController.js'

const router = express.Router()

router.post('/ats/analyze', analyzeATS)
router.post('/roles/predict', predictRoles)
router.post('/skills/analyze', analyzeSkills)
router.post('/jobs/recommend', recommendJobs)
router.post('/resume/improve', improveResume)
router.post('/resume/summary', generateSummary)
router.post('/resume/section-analyze', analyzeSections)
router.post('/resume/project-analyze', analyzeProjects)
router.post('/interview/questions', generateInterviewQuestions)
router.post('/career/roadmap', generateCareerRoadmap)
router.post('/career/learning-plan', generateLearningPlan)

export default router
