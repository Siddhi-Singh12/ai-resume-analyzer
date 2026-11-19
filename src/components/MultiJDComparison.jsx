import { useState } from 'react'
import { GitCompare, Plus, Trash2, ArrowRight, Check, AlertCircle } from 'lucide-react'
import API from '../services/api'

const MultiJDComparison = ({ resumeText = '', analysisId = null }) => {
  const [jds, setJds] = useState([
    { title: 'Job A: Full-Stack Developer', text: 'Looking for a Full-Stack Engineer with React, Node.js, TypeScript, PostgreSQL, and AWS.' },
    { title: 'Job B: Machine Learning Engineer', text: 'Seeking an ML Engineer proficient in Python, PyTorch, Docker, MLOps, and SQL.' }
  ])
  const [comparisons, setComparisons] = useState([])
  const [loading, setLoading] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newText, setNewText] = useState('')

  const addJD = () => {
    if (!newText.trim()) return
    const title = newTitle.trim() || `Job ${String.fromCharCode(65 + jds.length)}`
    setJds(prev => [...prev, { title, text: newText.trim() }])
    setNewTitle('')
    setNewText('')
  }

  const removeJD = (idx) => {
    setJds(prev => prev.filter((_, i) => i !== idx))
  }

  const runComparison = async () => {
    if (jds.length === 0) return
    try {
      setLoading(true)
      const res = await API.post('/analyze/compare', {
        resumeText: resumeText || 'Experienced Software Engineer skilled in Python, React, SQL, and Docker.',
        jobDescriptions: jds,
        analysisId
      })
      if (res.data?.comparisons) {
        setComparisons(res.data.comparisons)
      }
    } catch (err) {
      console.error('Comparison error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <GitCompare className='w-3.5 h-3.5' /> Multi-JD Comparator
          </div>
          <h2 className='text-2xl font-bold text-white'>Multi-Job Description Comparison</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Benchmark your single resume across multiple job requirements side-by-side
          </p>
        </div>

        <button
          onClick={runComparison}
          disabled={loading || jds.length === 0}
          className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-black font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition disabled:opacity-50'
        >
          {loading ? 'Evaluating JDs...' : 'Compare All Jobs'}
        </button>
      </div>

      {/* Input New JD */}
      <div className='my-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-xs space-y-3'>
        <h3 className='font-bold text-white text-sm'>Add Target Job Description to Compare</h3>
        <div className='grid sm:grid-cols-3 gap-2'>
          <input
            type='text'
            placeholder='Job Title / Label (e.g. Job C: Data Scientist)'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className='sm:col-span-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400'
          />
          <input
            type='text'
            placeholder='Paste skills or JD snippet...'
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className='sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400'
          />
        </div>
        <div className='flex justify-end'>
          <button
            onClick={addJD}
            className='bg-slate-700 hover:bg-slate-600 text-cyan-300 px-4 py-1.5 rounded-xl flex items-center gap-1.5 font-medium transition'
          >
            <Plus className='w-3.5 h-3.5' /> Add Job
          </button>
        </div>
      </div>

      {/* Current JDs to compare */}
      <div className='mb-6 space-y-2'>
        <h4 className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
          Target Comparison Queue ({jds.length})
        </h4>
        <div className='grid sm:grid-cols-2 gap-2'>
          {jds.map((jd, idx) => (
            <div key={idx} className='bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl flex items-center justify-between text-xs'>
              <div>
                <strong className='text-white block'>{jd.title}</strong>
                <p className='text-slate-400 text-[11px] truncate max-w-xs'>{jd.text}</p>
              </div>
              <button
                onClick={() => removeJD(idx)}
                className='text-slate-500 hover:text-rose-400 p-1 transition'
              >
                <Trash2 className='w-3.5 h-3.5' />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      {comparisons.length > 0 && (
        <div className='mt-6 pt-6 border-t border-slate-800 space-y-4'>
          <h3 className='font-bold text-white text-base'>Comparative Analysis Results</h3>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {comparisons.map((c, idx) => {
              const score = Math.round(c.ats_score || 70)
              const matchPct = Math.round(c.skill_match_percentage || 75)

              return (
                <div key={idx} className='bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 text-xs space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-bold text-white text-sm'>{c.job_label}</h4>
                    <span className='text-lg font-black text-cyan-400'>{score}% ATS</span>
                  </div>

                  <div className='h-2 w-full bg-slate-700/50 rounded-full overflow-hidden'>
                    <div
                      style={{ width: `${score}%` }}
                      className='h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500'
                    />
                  </div>

                  <div className='space-y-1.5 pt-1'>
                    <div className='flex items-center justify-between text-slate-300'>
                      <span>Skill Match Ratio:</span>
                      <strong className='text-emerald-400'>{matchPct}%</strong>
                    </div>

                    <div>
                      <span className='text-slate-400 block mb-1'>Primary Gaps to Bridge:</span>
                      <div className='flex flex-wrap gap-1'>
                        {(c.main_gaps || []).map((g, i) => (
                          <span key={i} className='bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded text-[10px]'>
                            {g}
                          </span>
                        ))}
                        {(!c.main_gaps || c.main_gaps.length === 0) && (
                          <span className='text-emerald-400 text-[11px]'>High skill compatibility!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiJDComparison
