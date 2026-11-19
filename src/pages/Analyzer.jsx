import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, FileText, CheckCircle2, Target, ArrowRight } from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ResumeUpload from '../components/ResumeUpload'
import LoadingSpinner from '../components/LoadingSpinner'
import { uploadResume } from '../services/resumeService'
import { AuthContext } from '../context/authContextObject'

const Analyzer = () => {
  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const rolesList = [
    'Auto Detect (ML Classifier)',
    'Machine Learning Engineer',
    'Data Scientist',
    'Software Engineer',
    'AI Researcher',
    'Cloud / DevOps Engineer',
    'Data Analyst',
    'Cybersecurity Analyst'
  ]

  const analyzeResumeHandler = async () => {
    setErrorMsg('')
    if (!resume) {
      setErrorMsg('Please upload your resume file (PDF) to proceed.')
      return
    }

    const token = localStorage.getItem('token') || user?.token || (() => {
      try {
        const u = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo'))
        return u?.token
      } catch {
        return null
      }
    })()

    if (!token) {
      alert('Please log in to analyze your resume and save results.')
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('resume', resume)
      formData.append('jobDescription', jobDescription.trim())
      if (targetRole && !targetRole.includes('Auto Detect')) {
        formData.append('targetRole', targetRole)
      }

      const response = await uploadResume(formData, token)
      const resultData = response.data || response


      // Save to local storage for contextual chat and persistent state
      try {
        localStorage.setItem('lastAnalysisResult', JSON.stringify(resultData))
      } catch (e) {}

      navigate('/dashboard', {
        state: resultData,
      })
    } catch (error) {
      console.error('Analysis error:', error)
      const msg = error?.response?.data?.message || error.message || 'Server Error while analyzing resume'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black'>
      <Navbar />

      {/* Glow effects */}
      <div className='fixed top-24 left-10 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none'></div>
      <div className='fixed bottom-10 right-10 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none'></div>

      <main className='flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 relative z-10'>
        {/* Hero */}
        <div className='text-center max-w-3xl mx-auto mb-10'>
          <div className='inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4'>
            <Sparkles className='w-3.5 h-3.5' /> AI-Powered Career Intelligence
          </div>

          <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight'>
            AI Resume Analyzer & <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>Career Matcher</span>
          </h1>

          <p className='text-slate-400 text-sm sm:text-base mt-3 leading-relaxed'>
            Upload your resume for explainable 7-factor ATS scoring, standalone quality auditing, multi-role prediction, verified dataset matching, and interview preparation.
          </p>
        </div>

        {errorMsg && (
          <div className='max-w-xl mx-auto mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-2xl text-xs text-center'>
            {errorMsg}
          </div>
        )}

        {/* Loading overlay */}
        {loading ? (
          <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-12 max-w-xl mx-auto shadow-2xl backdrop-blur-xl'>
            <LoadingSpinner text="Running ML role prediction, ATS explainability models, and job semantic search..." />
          </div>
        ) : (
          /* Main Input Form */
          <div className='grid lg:grid-cols-2 gap-6 items-stretch'>
            {/* Left: Upload Card */}
            <ResumeUpload setResume={setResume} resume={resume} />

            {/* Right: Job Description & Target Role */}
            <div className='space-y-5 flex flex-col justify-between'>
              <div className='bg-slate-900/90 border border-slate-800 rounded-[28px] p-6 shadow-2xl backdrop-blur-xl flex-1 flex flex-col'>
                {/* Target Role Selector */}
                <div className='mb-4'>
                  <label className='block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5'>
                    <Target className='w-3.5 h-3.5 text-cyan-400' /> Target Career Role (Optional)
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className='w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-400 transition'
                  >
                    {rolesList.map((r, i) => (
                      <option key={i} value={r.includes('Auto Detect') ? '' : r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Description Textarea */}
                <div className='flex-1 flex flex-col'>
                  <div className='flex items-center justify-between mb-1.5'>
                    <label className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
                      Target Job Description (Optional)
                    </label>
                    <span className='text-[10px] text-slate-500 font-medium'>
                      Leave empty for standalone resume evaluation
                    </span>
                  </div>

                  <textarea
                    rows='6'
                    placeholder='Paste target job description to calculate exact ATS keyword & skills match ratio...'
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className='w-full flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none text-slate-200 placeholder:text-slate-500 text-xs focus:border-cyan-400 transition resize-none leading-relaxed'
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={analyzeResumeHandler}
                disabled={loading}
                className='w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 transition duration-300 py-4 rounded-2xl text-base font-bold text-black shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2'
              >
                <Sparkles className='w-5 h-5 text-black' />
                <span>Run Full AI Resume Analysis</span>
                <ArrowRight className='w-4 h-4 text-black' />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Analyzer