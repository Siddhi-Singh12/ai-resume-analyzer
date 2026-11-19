import { useState, useEffect, useRef } from 'react'
import {
    Bot,
    X,
    Send,
    Plus,
    Minus,
    Sparkles,
    User
} from 'lucide-react'
import API from '../services/api'

const FloatingChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [chatWidth, setChatWidth] = useState(380)
    const [chatHeight, setChatHeight] = useState(540)
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)

    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: 'Hello! I am your AI Resume & Career Coach. I can analyze your missing skills, explain ATS scores, recommend learning paths, and prepare you for interviews.'
        }
    ])

    const quickQuestions = [
        "What skills am I missing?",
        "Why is my ATS score low?",
        "What should I learn next?",
        "What questions can interviewer ask?",
        "How can I improve my projects?"
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    const handleSendMessage = async (textToSend = null) => {
        const text = (textToSend || message).trim()
        if (!text || sending) return

        setMessage('')
        setMessages(prev => [...prev, { sender: 'user', text }])
        setSending(true)

        // Read analysis context from storage if available
        let analysisContext = null
        try {
            const raw = localStorage.getItem('lastAnalysisResult')
            if (raw) {
                const parsed = JSON.parse(raw)
                analysisContext = {
                    ats_score: parsed.score || parsed.atsScore,
                    quality_score: parsed.qualityScore,
                    predicted_role: parsed.predictedRole,
                    matched_skills: parsed.matchedSkills || parsed.skills,
                    missing_skills: parsed.missingSkills
                }
            }
        } catch (e) {
            // ignore
        }

        try {
            const res = await API.post('/chatbot/chat', {
                message: text,
                prompt: text,
                context: analysisContext
            })
            const reply = res.data?.response || res.data?.reply || "I analyzed your question, but could not produce a response."
            setMessages(prev => [...prev, { sender: 'ai', text: reply }])
        } catch (err) {
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: analysisContext?.missing_skills
                    ? `Based on your analysis, your missing skills are: ${analysisContext.missing_skills.join(', ')}. Focus on bridging these to boost your ATS score for ${analysisContext.predicted_role || 'target roles'}.`
                    : 'Career Assistant is currently operating in offline mode. Please verify the AI service is active.'
            }])
        } finally {
            setSending(false)
        }
    }

    const increaseWidth = () => setChatWidth((prev) => Math.min(600, prev + 25))
    const decreaseWidth = () => setChatWidth((prev) => Math.max(300, prev - 25))
    const increaseHeight = () => setChatHeight((prev) => Math.min(750, prev + 30))
    const decreaseHeight = () => setChatHeight((prev) => Math.max(420, prev - 30))

    return (
        <div className='fixed bottom-6 right-6 z-50'>
            {isOpen && (
                <div
                    style={{
                        width: `${chatWidth}px`,
                        height: `${chatHeight}px`
                    }}
                    className='fixed bottom-24 right-6 overflow-hidden rounded-[26px] border border-slate-700/80 bg-[#081028]/95 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 flex flex-col transition-all duration-200'
                >
                    {/* Header */}
                    <div className='px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0b1220]'>
                        <div className='flex items-center gap-2.5'>
                            <div className='w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30'>
                                <Bot className='text-cyan-400 w-5 h-5' />
                            </div>
                            <div>
                                <h3 className='text-white font-bold text-sm flex items-center gap-1.5'>
                                    Career AI Assistant
                                    <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></span>
                                </h3>
                                <p className='text-slate-400 text-[10px]'>Context-Aware ATS & Career Guide</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-1'>
                            <button onClick={decreaseWidth} title="Narrower" className='w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300'>
                                <Minus className='w-3 h-3' />
                            </button>
                            <button onClick={increaseWidth} title="Wider" className='w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300'>
                                <Plus className='w-3 h-3' />
                            </button>
                            <button onClick={decreaseHeight} title="Shorter" className='w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 text-xs'>
                                ↓
                            </button>
                            <button onClick={increaseHeight} title="Taller" className='w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 text-xs'>
                                ↑
                            </button>
                            <button onClick={() => setIsOpen(false)} className='text-slate-400 hover:text-white transition ml-1 p-1'>
                                <X className='w-4 h-4' />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#020617] text-xs'>
                        {messages.map((msg, index) => {
                            const isUser = msg.sender === 'user'
                            return (
                                <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[85%] px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                                            isUser
                                                ? 'bg-cyan-500 text-black font-medium rounded-br-sm'
                                                : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-bl-sm shadow-md'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            )
                        })}

                        {sending && (
                            <div className='flex justify-start'>
                                <div className='bg-slate-800/80 border border-slate-700/60 text-cyan-300 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2'>
                                    <Sparkles className='w-3.5 h-3.5 animate-spin' />
                                    <span>AI Assistant is analyzing context...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Context Quick Questions */}
                    <div className='px-3 py-2 bg-[#081028] border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar'>
                        {quickQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSendMessage(q)}
                                disabled={sending}
                                className='text-[10px] bg-slate-800/80 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-lg shrink-0 border border-slate-700/50 transition disabled:opacity-50'
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className='p-3 border-t border-slate-800 bg-[#081028]'>
                        <div className='flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-2xl px-3 py-1.5'>
                            <input
                                type='text'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSendMessage()
                                }}
                                placeholder={sending ? 'Thinking...' : 'Ask about missing skills, ATS, roadmap...'}
                                disabled={sending}
                                className='flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 text-xs px-1'
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={sending || !message.trim()}
                                className='bg-cyan-500 hover:bg-cyan-400 text-black p-2 rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-40'
                            >
                                <Send className='w-3.5 h-3.5' />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-13 h-13 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 flex items-center justify-center shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105 p-3.5'
            >
                <Bot className='text-black w-6 h-6' />
            </button>
        </div>
    )
}

export default FloatingChatBot