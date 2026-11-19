import { askChatbotAI } from '../services/aiService.js'

export const chatHandler = async (req, res) => {
    try {
        const { message, prompt, context } = req.body
        const userMessage = message || prompt || ''

        const reply = await askChatbotAI(userMessage, context)

        res.status(200).json({
            success: true,
            response: reply,
            reply: reply
        })
    } catch (error) {
        console.error('Chat error:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Error communicating with career assistant'
        })
    }
}
