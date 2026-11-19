import { useState, useEffect } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, RefreshCw, Sparkles, Filter, Copy, Check, AlertCircle } from 'lucide-react'
import API from '../services/api'

const InterviewPrepPanel = ({ initialPrep = {}, resumeText = '', predictedRole = 'Software Engineer' }) => {
  const [prepData, setPrepData] = useState(initialPrep)
  const [difficulty, setDifficulty] = useState(initialPrep.difficulty || 'Medium')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)

  useEffect(() => {
    if (initialPrep && initialPrep.questions && initialPrep.questions.length > 0) {
      setPrepData(initialPrep)
      if (initialPrep.difficulty) setDifficulty(initialPrep.difficulty)
    }
  }, [initialPrep])

  const questions = prepData.questions || []
  const categories = ['All', 'Technical', 'Project', 'DSA', 'ML', 'Behavioral', 'HR']

  const filteredQuestions = selectedCategory === 'All'
    ? questions
    : questions.filter(q => (q.category || '').toLowerCase() === selectedCategory.toLowerCase())

  const handleRegenerate = async (newDifficulty = difficulty, newCategory = selectedCategory) => {
    try {
      setLoading(true)
      setErrorMsg('')
      const res = await API.post('/interview/questions', {
        resume_text: resumeText,
        role: predictedRole,
        difficulty: newDifficulty,
        category: 'All' // generate full suite so all category tabs work
      })
      if (res.data?.questions && res.data.questions.length > 0) {
        setPrepData(res.data)
      } else {
        setErrorMsg('Failed to generate interview questions. Please try again.')
      }
    } catch (err) {
      console.error('Error generating questions:', err)
      setErrorMsg(err.response?.data?.message || err.message || 'Error communicating with interview service.')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const copyAnswer = (answer, idx) => {
    navigator.clipboard.writeText(answer)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <HelpCircle className='w-3.5 h-3.5' /> AI Mock Interviewer
          </div>
          <h2 className='text-2xl font-bold text-white'>Interview Preparation</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Targeted technical, project, DSA, ML, behavioral, and HR questions with ideal answer strategies
          </p>
        </div>

        {/* Controls */}
        <div className='flex items-center gap-2'>
          <div className='flex bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs'>
            {['Easy', 'Medium', 'Hard'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setDifficulty(lvl)
                  handleRegenerate(lvl, selectedCategory)
                }}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  difficulty === lvl ? 'bg-cyan-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleRegenerate(difficulty, selectedCategory)}
            disabled={loading}
            className='bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50'
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className='flex gap-1.5 my-5 overflow-x-auto pb-2 text-xs'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions Accordion */}
      <div className='space-y-3'>
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedIndex === idx

          return (
            <div
              key={idx}
              className='bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 rounded-2xl overflow-hidden transition'
            >
              <button
                onClick={() => toggleExpand(idx)}
                className='w-full p-4 text-left flex items-start justify-between gap-3'
              >
                <div className='flex items-start gap-3'>
                  <span className='w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5'>
                    Q{idx + 1}
                  </span>
                  <div>
                    <span className='text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/50 mr-2'>
                      {q.category}
                    </span>
                    <h3 className='text-sm font-semibold text-white inline'>{q.question}</h3>
                  </div>
                </div>

                <div className='text-slate-400 mt-1 shrink-0'>
                  {isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
                </div>
              </button>

              {isExpanded && (
                <div className='px-5 pb-5 pt-1 border-t border-slate-700/40 bg-slate-900/40 text-xs text-slate-300 leading-relaxed'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='flex items-center gap-1.5 text-emerald-400 font-semibold'>
                      <Sparkles className='w-3.5 h-3.5' /> Model Answer & Talking Points:
                    </span>
                    <button
                      onClick={() => copyAnswer(q.answer, idx)}
                      className='text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg transition'
                    >
                      {copiedIndex === idx ? <Check className='w-3 h-3 text-emerald-400' /> : <Copy className='w-3 h-3' />}
                      <span>{copiedIndex === idx ? 'Copied!' : 'Copy Answer'}</span>
                    </button>
                  </div>
                  <p className='bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/50 text-slate-200 leading-relaxed whitespace-pre-wrap'>
                    {q.answer || 'Provide a structured answer following the STAR methodology.'}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {errorMsg && (
          <div className='bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2'>
            <AlertCircle className='w-4 h-4 shrink-0' />
            <span>{errorMsg}</span>
          </div>
        )}

        {questions.length === 0 && !loading && (
          <div className='bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center space-y-3'>
            <div className='w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto'>
              <HelpCircle className='w-6 h-6' />
            </div>
            <h3 className='font-bold text-base text-white'>Generate Interview Questions</h3>
            <p className='text-xs text-slate-400 max-w-md mx-auto'>
              Synthesize interview questions and ideal answers across Technical, Project, DSA, ML, Behavioral, and HR categories tailored to your profile.
            </p>
            <button
              onClick={() => handleRegenerate(difficulty, 'All')}
              className='bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition hover:opacity-90 inline-flex items-center gap-2'
            >
              <Sparkles className='w-3.5 h-3.5' /> Generate Questions for {predictedRole}
            </button>
          </div>
        )}

        {questions.length > 0 && filteredQuestions.length === 0 && (
          <div className='text-center py-8 text-slate-400 text-xs'>
            No interview questions in the '{selectedCategory}' category. Click 'All' to view all questions or 'Regenerate'.
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewPrepPanel
