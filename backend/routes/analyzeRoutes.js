import express from 'express'
import upload from '../utils/upload.js'
import protect from '../middleware/authMiddleware.js'
import {
    analyzeResume,
    getAnalysisHistory,
    getAnalysisById,
    compareMultipleJDs
} from '../controllers/analyzeController.js'

const router = express.Router()

// Resume Upload & Analysis
router.post(
    '/resume',
    protect,
    upload.single('resume'),
    analyzeResume
)

router.post(
    '/upload',
    protect,
    upload.single('resume'),
    analyzeResume
)

// History & Score Progression Trends
router.get(
    '/history',
    protect,
    getAnalysisHistory
)

router.get(
    '/:id',
    protect,
    getAnalysisById
)

// Multi-Job Description Comparison
router.post(
    '/compare',
    protect,
    compareMultipleJDs
)

export default router
