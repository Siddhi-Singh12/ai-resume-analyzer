import { Check, AlertTriangle, Lightbulb, ShieldCheck } from 'lucide-react'

const ResumeQualityCard = ({ qualityScore = 78, qualityAnalysis = {} }) => {
  const score = Math.round(qualityScore)
  const strengths = qualityAnalysis.strengths || ['Clear section organization', 'Technical proficiencies identified']
  const weaknesses = qualityAnalysis.weaknesses || ['Few quantified outcomes in project descriptions']
  const improvements = qualityAnalysis.improvements || ['Add quantifiable impact metrics to bullet points']
  const contact = qualityAnalysis.contact_details || {}

  const getBadgeColor = (s) => {
    if (s >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    if (s >= 65) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  }

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <span>💎</span> Standalone Evaluation
          </div>
          <h2 className='text-2xl font-bold text-white'>Resume Quality Score</h2>
          <p className='text-xs text-slate-400 mt-1'>Evaluates content depth, formatting, metrics, and completeness</p>
        </div>

        <div className={`px-5 py-2.5 rounded-2xl border ${getBadgeColor(score)} flex items-center gap-2`}>
          <ShieldCheck className='w-5 h-5' />
          <span className='text-3xl font-extrabold'>{score}</span>
          <span className='text-xs text-slate-400'>/100</span>
        </div>
      </div>

      {/* Contact Channels Grid */}
      <div className='my-5 grid grid-cols-4 gap-2 text-center text-xs'>
        <div className={`p-2.5 rounded-xl border ${contact.has_email ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
          ✉️ Email {contact.has_email ? '✓' : '✗'}
        </div>
        <div className={`p-2.5 rounded-xl border ${contact.has_phone ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
          📞 Phone {contact.has_phone ? '✓' : '✗'}
        </div>
        <div className={`p-2.5 rounded-xl border ${contact.has_linkedin ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
          🔗 LinkedIn {contact.has_linkedin ? '✓' : '✗'}
        </div>
        <div className={`p-2.5 rounded-xl border ${contact.has_github ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
          🐙 GitHub {contact.has_github ? '✓' : '✗'}
        </div>
      </div>

      {/* Strengths */}
      <div className='space-y-4'>
        <div>
          <h3 className='text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5'>
            <Check className='w-4 h-4' /> Strengths ({strengths.length})
          </h3>
          <div className='space-y-2'>
            {strengths.map((item, idx) => (
              <div key={idx} className='bg-emerald-500/5 border border-emerald-500/20 text-slate-200 text-xs p-2.5 rounded-xl flex items-start gap-2'>
                <span className='text-emerald-400 font-bold'>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div>
          <h3 className='text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5'>
            <AlertTriangle className='w-4 h-4' /> Areas for Attention ({weaknesses.length})
          </h3>
          <div className='space-y-2'>
            {weaknesses.map((item, idx) => (
              <div key={idx} className='bg-amber-500/5 border border-amber-500/20 text-slate-300 text-xs p-2.5 rounded-xl flex items-start gap-2'>
                <span className='text-amber-400 font-bold'>!</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Improvements */}
        <div>
          <h3 className='text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5'>
            <Lightbulb className='w-4 h-4' /> Recommended Improvements
          </h3>
          <div className='space-y-2'>
            {improvements.map((item, idx) => (
              <div key={idx} className='bg-cyan-500/5 border border-cyan-500/20 text-slate-300 text-xs p-2.5 rounded-xl flex items-start gap-2'>
                <span className='text-cyan-400 font-bold'>→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeQualityCard
