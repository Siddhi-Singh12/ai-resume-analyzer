import { CheckCircle2, AlertCircle } from 'lucide-react'

const ATSCard = ({ score = 75, breakdown = {} }) => {
  const getScoreColor = (val) => {
    if (val >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500', bar: 'from-emerald-500 to-cyan-400' }
    if (val >= 65) return { text: 'text-cyan-400', bg: 'bg-cyan-500', bar: 'from-cyan-500 to-blue-500' }
    if (val >= 50) return { text: 'text-amber-400', bg: 'bg-amber-500', bar: 'from-amber-500 to-yellow-400' }
    return { text: 'text-rose-400', bg: 'bg-rose-500', bar: 'from-rose-500 to-orange-500' }
  }

  const overall = Math.round(score)
  const colors = getScoreColor(overall)

  const items = [
    { label: 'Keyword Match', value: breakdown.keyword_score ?? 78, icon: '🔑' },
    { label: 'Skills Match', value: breakdown.skills_score ?? 82, icon: '🎯' },
    { label: 'Experience Match', value: breakdown.experience_score ?? 75, icon: '💼' },
    { label: 'Education Match', value: breakdown.education_score ?? 85, icon: '🎓' },
    { label: 'Resume Structure', value: breakdown.structure_score ?? 80, icon: '📐' },
    { label: 'Formatting / Parseability', value: breakdown.formatting_score ?? 85, icon: '📄' },
    { label: 'JD Relevance', value: breakdown.jd_relevance_score ?? 76, icon: '⚡' },
  ]

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <span>✨</span> ATS Intelligence
          </div>
          <h2 className='text-2xl font-bold text-white'>Overall ATS Score</h2>
          <p className='text-xs text-slate-400 mt-1'>Explainable 7-factor recruitment compatibility index</p>
        </div>

        {/* Circular / Large Score Badge */}
        <div className='flex items-center gap-4'>
          <div className='text-right'>
            <div className={`text-5xl font-extrabold ${colors.text} tracking-tight`}>
              {overall}<span className='text-2xl text-slate-500 font-normal'>/100</span>
            </div>
            <div className='text-xs text-slate-400 mt-0.5 font-medium'>
              {overall >= 75 ? 'ATS Optimized' : overall >= 60 ? 'Competitive' : 'Needs Optimization'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Overall Progress Bar */}
      <div className='my-5'>
        <div className='h-3.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50'>
          <div
            style={{ width: `${Math.min(100, Math.max(5, overall))}%` }}
            className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-1000`}
          />
        </div>
      </div>

      {/* 7 Breakdown Factors */}
      <div className='mt-6 space-y-3.5'>
        <h3 className='text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3'>
          Component Breakdown
        </h3>

        {items.map((item, idx) => {
          const itemVal = Math.round(item.value)
          const itemCol = getScoreColor(itemVal)
          return (
            <div key={idx} className='bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 rounded-xl p-3 transition'>
              <div className='flex items-center justify-between mb-1.5'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>{item.icon}</span>
                  <span className='text-sm font-medium text-slate-200'>{item.label}</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <span className={`text-sm font-bold ${itemCol.text}`}>{itemVal}%</span>
                  {itemVal >= 75 ? (
                    <CheckCircle2 className='w-3.5 h-3.5 text-emerald-400' />
                  ) : (
                    <AlertCircle className='w-3.5 h-3.5 text-amber-400' />
                  )}
                </div>
              </div>
              <div className='h-2 w-full bg-slate-700/50 rounded-full overflow-hidden'>
                <div
                  style={{ width: `${Math.min(100, itemVal)}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${itemCol.bar} transition-all duration-700`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ATSCard