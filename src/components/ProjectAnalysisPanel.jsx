import { useState } from 'react'
import { Code2, Server, Gauge, CheckCircle2, XCircle, ArrowRight, PlusCircle, RefreshCw, FileText } from 'lucide-react'
import API from '../services/api'

const ProjectAnalysisPanel = ({ projects = [], resumeText = '' }) => {
  const [projectList, setProjectList] = useState(projects)
  const [manualTitle, setManualTitle] = useState('')
  const [manualText, setManualText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [showManualForm, setShowManualForm] = useState(false)
  const [showTextInspect, setShowTextInspect] = useState(false)

  // Sync if props update
  if (projects !== projectList && projects.length > 0 && projectList.length === 0) {
    setProjectList(projects)
  }

  const handleManualAnalyze = async (e) => {
    e.preventDefault()
    if (!manualText.trim()) return

    try {
      setAnalyzing(true)
      const formattedInput = manualTitle.trim()
        ? `Projects\n${manualTitle.trim()}\n${manualText.trim()}`
        : `Projects\n${manualText.trim()}`

      const res = await API.post('/resume/project-analyze', {
        resume_text: formattedInput
      })

      if (res.data?.projects && res.data.projects.length > 0) {
        setProjectList(prev => [...prev, ...res.data.projects])
        setManualTitle('')
        setManualText('')
        setShowManualForm(false)
      }
    } catch (err) {
      console.error('Error analyzing manual project:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <Code2 className='w-3.5 h-3.5' /> Project Engineering
          </div>
          <h2 className='text-2xl font-bold text-white'>Project Description Analyzer</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Deep evaluation of technical depth, architecture, deployment, and measurable business impact
          </p>
        </div>

        <button
          onClick={() => setShowManualForm(!showManualForm)}
          className='bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition font-medium w-fit'
        >
          <PlusCircle className='w-3.5 h-3.5' />
          <span>{showManualForm ? 'Close Input' : 'Add / Analyze Project'}</span>
        </button>
      </div>

      {/* Manual Input Form */}
      {showManualForm && (
        <form onSubmit={handleManualAnalyze} className='my-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-xs space-y-3'>
          <h3 className='font-bold text-white text-sm'>Analyze a Specific Project Description</h3>
          <p className='text-slate-400 text-[11px]'>
            Paste the project title and bullet points to evaluate technical depth, architecture signals, and suggested improvements.
          </p>
          <input
            type='text'
            placeholder='Project Name (e.g., Real-Time Fraud Detection System | Python, Kafka, Spark)'
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
            className='w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400'
          />
          <textarea
            rows={4}
            placeholder='Project description / bullet points (e.g., Engineered a streaming pipeline processing 10k events/sec. Deployed on AWS ECS with Docker...)'
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            className='w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400'
          />
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={() => setShowManualForm(false)}
              className='px-3 py-1.5 rounded-xl text-slate-400 hover:text-white transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={analyzing || !manualText.trim()}
              className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-black font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition disabled:opacity-50'
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Analyzing...' : 'Evaluate Project'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className='mt-6 space-y-6'>
        {projectList.map((proj, idx) => {
          const depth = Math.round(proj.technical_depth_score || 75)
          const clarity = Math.round(proj.clarity_score || 80)
          const struct = proj.suggested_structure || {}

          return (
            <div key={idx} className='bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-4'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                <div>
                  <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                    <Server className='w-4 h-4 text-cyan-400' /> {proj.title}
                  </h3>
                  <div className='flex flex-wrap gap-1 mt-1.5'>
                    {(proj.technologies || []).map((t, i) => (
                      <span key={i} className='bg-slate-700/70 text-slate-300 px-2 py-0.5 rounded text-[10px]'>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='flex gap-3 text-xs'>
                  <div className='bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700/40 text-center'>
                    <div className='text-slate-400 text-[10px]'>Tech Depth</div>
                    <div className='font-bold text-cyan-400'>{depth}%</div>
                  </div>
                  <div className='bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700/40 text-center'>
                    <div className='text-slate-400 text-[10px]'>Clarity</div>
                    <div className='font-bold text-emerald-400'>{clarity}%</div>
                  </div>
                </div>
              </div>

              {/* 9 Signals Grid */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs'>
                <div className='bg-slate-900/40 p-2 rounded-xl flex items-center gap-2 border border-slate-700/30'>
                  {proj.has_problem_statement ? <CheckCircle2 className='w-3.5 h-3.5 text-emerald-400' /> : <XCircle className='w-3.5 h-3.5 text-rose-400' />}
                  <span className='text-slate-300'>Problem Statement</span>
                </div>
                <div className='bg-slate-900/40 p-2 rounded-xl flex items-center gap-2 border border-slate-700/30'>
                  {proj.has_architecture ? <CheckCircle2 className='w-3.5 h-3.5 text-emerald-400' /> : <XCircle className='w-3.5 h-3.5 text-rose-400' />}
                  <span className='text-slate-300'>System Architecture</span>
                </div>
                <div className='bg-slate-900/40 p-2 rounded-xl flex items-center gap-2 border border-slate-700/30'>
                  {proj.has_deployment ? <CheckCircle2 className='w-3.5 h-3.5 text-emerald-400' /> : <XCircle className='w-3.5 h-3.5 text-rose-400' />}
                  <span className='text-slate-300'>Live Deployment</span>
                </div>
                <div className='bg-slate-900/40 p-2 rounded-xl flex items-center gap-2 border border-slate-700/30'>
                  {proj.has_measurable_results ? <CheckCircle2 className='w-3.5 h-3.5 text-emerald-400' /> : <XCircle className='w-3.5 h-3.5 text-rose-400' />}
                  <span className='text-slate-300'>Quantified Metrics</span>
                </div>
              </div>

              {/* Suggested Structure */}
              <div className='bg-slate-900/70 border border-slate-700/50 rounded-xl p-4 text-xs space-y-2'>
                <h4 className='font-semibold text-cyan-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5'>
                  <ArrowRight className='w-3.5 h-3.5' /> Suggested Production Structure
                </h4>

                <div className='grid sm:grid-cols-2 gap-3'>
                  <div>
                    <strong className='text-slate-400 block mb-0.5'>1. Problem Statement:</strong>
                    <p className='text-slate-300'>{struct.problem || 'Explain the problem and target user impact.'}</p>
                  </div>
                  <div>
                    <strong className='text-slate-400 block mb-0.5'>2. Technical Implementation:</strong>
                    <p className='text-slate-300'>{struct.implementation || 'Specify languages and core frameworks.'}</p>
                  </div>
                  <div>
                    <strong className='text-slate-400 block mb-0.5'>3. System Architecture:</strong>
                    <p className='text-slate-300'>{struct.architecture || 'Describe services, APIs, and storage tiers.'}</p>
                  </div>
                  <div>
                    <strong className='text-slate-400 block mb-0.5'>4. Impact & Scale:</strong>
                    <p className='text-emerald-300 font-medium'>{struct.impact || '[Add measurable result e.g. latency/users]'}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {projectList.length === 0 && (
          <div className='bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 text-center space-y-3'>
            <div className='w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto'>
              <Code2 className='w-6 h-6' />
            </div>
            <h3 className='font-bold text-base text-white'>Projects could not be identified in the extracted resume text</h3>
            <p className='text-xs text-slate-400 max-w-lg mx-auto leading-relaxed'>
              The section parser looks for dedicated headers such as <em>Projects</em>, <em>Key Projects</em>, or <em>Academic Projects</em>.
              If your resume formats projects under experience or without explicit titles, you can supply one manually above to evaluate it immediately.
            </p>

            <div className='flex items-center justify-center gap-3 pt-2'>
              <button
                onClick={() => setShowManualForm(true)}
                className='bg-cyan-500 text-black font-bold text-xs px-4 py-2 rounded-xl transition hover:opacity-90 flex items-center gap-1.5'
              >
                <PlusCircle className='w-3.5 h-3.5' /> Supply Project Description
              </button>
              {resumeText && (
                <button
                  onClick={() => setShowTextInspect(!showTextInspect)}
                  className='bg-slate-800 text-slate-300 hover:text-white text-xs px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5'
                >
                  <FileText className='w-3.5 h-3.5' /> {showTextInspect ? 'Hide Extracted Text' : 'Inspect Extracted Text'}
                </button>
              )}
            </div>

            {showTextInspect && resumeText && (
              <div className='text-left mt-4 bg-slate-900 border border-slate-700 rounded-xl p-4 max-h-60 overflow-y-auto text-xs text-slate-300 font-mono whitespace-pre-wrap'>
                {resumeText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectAnalysisPanel
