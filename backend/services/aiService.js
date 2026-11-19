const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'

/**
 * Perform comprehensive AI resume analysis via FastAPI
 */
export const analyzeResumeAI = async (resumeText, jobDescription = '', targetRole = '') => {
    try {
        const response = await fetch(`${AI_SERVICE_URL}/predict/resume`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resume_text: resumeText,
                job_description: jobDescription,
                target_role: targetRole
            }),
            signal: AbortSignal.timeout(30000)
        })

        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            const errBody = await response.text()
            throw new Error(`AI service returned HTTP ${response.status}: ${errBody}`)
        }
    } catch (err) {
        console.error('FastAPI /predict/resume error:', err.message)
        throw new Error(`AI analysis engine unavailable: ${err.message}`)
    }
}


/**
 * Chat with AI assistant with candidate context
 */
export const askChatbotAI = async (message, context = null) => {
    try {
        const response = await fetch(`${AI_SERVICE_URL}/chatbot/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, prompt: message, context }),
            signal: AbortSignal.timeout(20000)
        })

        if (response.ok) {
            const data = await response.json()
            return data.response || data.reply || 'No response from assistant.'
        }
    } catch (err) {
        console.warn('FastAPI chatbot service unavailable:', err.message)
    }

    // Graceful offline fallback
    if (context?.missing_skills && context.missing_skills.length > 0) {
        return `I can see from your analysis that your key missing skills are: ${context.missing_skills.join(', ')}. Focus on bridging these to improve your ATS score for ${context.predicted_role || 'target roles'}.`
    }
    return "I am currently running in offline assistant mode. Feel free to review your ATS score and skill gaps on the dashboard!"
}

/**
 * Specialized modular caller for specific AI service routes
 */
export const callAIModule = async (endpoint, payload) => {
    try {
        const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(20000)
        })
        if (response.ok) {
            return await response.json()
        }
    } catch (err) {
        console.warn(`FastAPI ${endpoint} error:`, err.message)
    }
    return null
}
