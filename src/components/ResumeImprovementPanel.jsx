import { useState } from 'react'
import { Sparkles, Copy, Check, ArrowRight, FileText, CheckCircle2 } from 'lucide-react'

const ResumeImprovementPanel = ({ improvements = {}, summaries = {} }) => {
  const [copiedKey, setCopiedKey] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const improvedSummary = summaries.professional_summary || improvements.improved_summary || ''
  const improvedBullets = improvements.improved_bullets || []
  const atsKeywords = improvements.ats_keyword_suggestions || ['CI/CD', 'Docker', 'RESTful APIs', 'System Design']
  const skillWording = improvements.skill_wording_suggestions || []

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <Sparkles className='w-3.5 h-3.5' /> AI Optimization
          </div>
          <h2 className='text-2xl font-bold text-white'>AI Resume Improvement</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Action-verb enhancement, metric placeholders, and ATS keyword tailoring
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 my-5 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-medium'>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'summary' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Professional Summary
        </button>
        <button
          onClick={() => setActiveTab('bullets')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'bullets' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Experience Bullets ({improvedBullets.length})
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'keywords' ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          ATS Keywords & Wording
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className='space-y-4'>
          {/* 4 Summary Variations */}
          <div className='bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-bold text-white flex items-center gap-2'>
                <FileText className='w-4 h-4 text-cyan-400' /> Recommended Professional Summary
              </h3>
              <button
                onClick={() => copyToClipboard(improvedSummary, 'prof_sum')}
                className='text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-lg transition'
              >
                {copiedKey === 'prof_sum' ? <Check className='w-3.5 h-3.5 text-emerald-400' /> : <Copy className='w-3.5 h-3.5' />}
                {copiedKey === 'prof_sum' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className='text-slate-300 text-xs leading-relaxed'>{improvedSummary}</p>
          </div>

          {summaries.ats_friendly_summary && (
            <div className='bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-xs font-semibold text-slate-300'>ATS-Friendly Dense Summary</h4>
                <button
                  onClick={() => copyToClipboard(summaries.ats_friendly_summary, 'ats_sum')}
                  className='text-xs flex items-center gap-1 text-slate-400 hover:text-slate-200'
                >
                  {copiedKey === 'ats_sum' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className='text-slate-400 text-xs leading-relaxed'>{summaries.ats_friendly_summary}</p>
            </div>
          )}

          {summaries.linkedin_summary && (
            <div className='bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-xs font-semibold text-slate-300'>LinkedIn About / Bio Style</h4>
                <button
                  onClick={() => copyToClipboard(summaries.linkedin_summary, 'li_sum')}
                  className='text-xs flex items-center gap-1 text-slate-400 hover:text-slate-200'
                >
                  {copiedKey === 'li_sum' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className='text-slate-400 text-xs leading-relaxed'>{summaries.linkedin_summary}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bullets' && (
        <div className='space-y-4'>
          {improvedBullets.map((bullet, idx) => (
            <div key={idx} className='bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3'>
              {/* Original */}
              <div className='bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 text-xs'>
                <span className='text-rose-400 font-semibold block mb-1'>Original Weak Phrasing:</span>
                <p className='text-slate-400 line-through'>{bullet.original}</p>
              </div>

              {/* Improved */}
              <div className='bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs'>
                <div className='flex items-center justify-between mb-1'>
                  <span className='text-emerald-400 font-semibold flex items-center gap-1'>
                    <CheckCircle2 className='w-3.5 h-3.5' /> AI-Optimized Bullet Point:
                  </span>
                  <button
                    onClick={() => copyToClipboard(bullet.improved, `bullet_${idx}`)}
                    className='text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1'
                  >
                    {copiedKey === `bullet_${idx}` ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className='text-slate-200 font-medium leading-relaxed'>{bullet.improved}</p>
              </div>

              {bullet.rationale && (
                <p className='text-[11px] text-slate-400 italic pl-1'>
                  💡 Why: {bullet.rationale}
                </p>
              )}
            </div>
          ))}

          {improvedBullets.length === 0 && (
            <div className='text-center py-6 text-slate-400 text-xs'>
              Bullet point optimizations ready. Upload a resume to generate specific rewrites.
            </div>
          )}
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className='space-y-4 text-xs'>
          <div>
            <h3 className='font-semibold text-white mb-2'>High-Demand ATS Keywords to Incorporate:</h3>
            <div className='flex flex-wrap gap-2'>
              {atsKeywords.map((kw, i) => (
                <span key={i} className='bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-xl'>
                  + {kw}
                </span>
              ))}
            </div>
          </div>

          {skillWording.length > 0 && (
            <div className='mt-4 space-y-2'>
              <h3 className='font-semibold text-white mb-2'>Skill Organization Advice:</h3>
              {skillWording.map((sw, i) => (
                <div key={i} className='bg-slate-800/40 p-3 rounded-xl border border-slate-700/40'>
                  <strong className='text-cyan-300'>{sw.area}: </strong>
                  <span className='text-slate-300'>{sw.suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ResumeImprovementPanel
