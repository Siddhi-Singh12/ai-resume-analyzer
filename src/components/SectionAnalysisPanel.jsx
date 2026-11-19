import { CheckCircle2, AlertCircle, Layers } from 'lucide-react'

const SectionAnalysisPanel = ({ sectionAnalysis = {} }) => {
  const sections = Object.values(sectionAnalysis || {})

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <Layers className='w-3.5 h-3.5' /> Granular Section Audit
          </div>
          <h2 className='text-2xl font-bold text-white'>Resume Section Analyzer</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Detailed diagnosis of Contact, Summary, Education, Experience, Projects, Skills, and Certifications
          </p>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className='mt-6 grid md:grid-cols-2 gap-4'>
        {sections.map((sec, idx) => {
          const score = Math.round(sec.quality_score || 70)
          const isPresent = sec.present

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition ${
                isPresent ? 'bg-slate-800/40 border-slate-700/60' : 'bg-rose-500/5 border-rose-500/20'
              }`}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  {isPresent ? (
                    <CheckCircle2 className='w-4 h-4 text-emerald-400' />
                  ) : (
                    <AlertCircle className='w-4 h-4 text-rose-400' />
                  )}
                  <h3 className='font-bold text-sm text-white'>{sec.name} Section</h3>
                </div>

                <div className='flex items-center gap-2'>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPresent ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                    {isPresent ? 'Present' : 'Missing'}
                  </span>
                  <span className='font-bold text-xs text-cyan-400'>{score}/100</span>
                </div>
              </div>

              {/* Progress */}
              <div className='h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden my-2'>
                <div
                  style={{ width: `${score}%` }}
                  className={`h-full rounded-full ${score >= 75 ? 'bg-emerald-400' : score >= 50 ? 'bg-cyan-400' : 'bg-rose-400'}`}
                />
              </div>

              {/* Problems and Suggestions */}
              <div className='mt-3 space-y-1.5 text-xs'>
                {sec.problems && sec.problems.length > 0 && sec.problems[0] !== "No critical issues" && (
                  <p className='text-amber-300/90 flex items-start gap-1.5'>
                    <span className='font-bold'>Issue:</span> {sec.problems[0]}
                  </p>
                )}
                {sec.suggestions && sec.suggestions.length > 0 && (
                  <p className='text-slate-300 flex items-start gap-1.5'>
                    <span className='text-cyan-400 font-bold'>Tip:</span> {sec.suggestions[0]}
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {sections.length === 0 && (
          <div className='text-center py-8 text-slate-400 text-xs col-span-2'>
            No section diagnostics available. Upload and analyze a resume to inspect granular section health.
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionAnalysisPanel
