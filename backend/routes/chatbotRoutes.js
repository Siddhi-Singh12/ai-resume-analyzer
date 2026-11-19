import express from 'express'
import { chatHandler } from '../controllers/chatbotController.js'

const router = express.Router()

router.post('/chat', chatHandler)
router.post('/ask', chatHandler)

export default router
