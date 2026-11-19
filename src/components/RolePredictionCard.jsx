import { Briefcase, Check, Plus } from 'lucide-react'

const RolePredictionCard = ({ predictedRole = 'Software Engineer', predictedRoles = [] }) => {
  const roles = predictedRoles && predictedRoles.length > 0
    ? predictedRoles
    : [
        { role: predictedRole, confidence: 85, supporting_skills: ['Python', 'SQL'], missing_skills: ['Docker'] }
      ]

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <Briefcase className='w-3.5 h-3.5' /> Multi-Role Classification
          </div>
          <h2 className='text-2xl font-bold text-white'>Job Role Match & Alignment</h2>
          <p className='text-xs text-slate-400 mt-1'>Probabilistic ML alignment based on your skills and experience</p>
        </div>
      </div>

      {/* Role list */}
      <div className='mt-6 space-y-4'>
        {roles.map((item, index) => {
          const confidence = Math.round(item.confidence || 70)
          const isTop = index === 0

          return (
            <div
              key={index}
              className={`p-4 rounded-2xl border transition ${
                isTop
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70'
              }`}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isTop ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {index + 1}
                  </span>
                  <span className='font-semibold text-white text-base'>{item.role}</span>
                  {isTop && (
                    <span className='text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium'>
                      Top Match
                    </span>
                  )}
                </div>

                <span className='font-bold text-cyan-400 text-sm'>{confidence}% Match</span>
              </div>

              {/* Progress bar */}
              <div className='h-2 w-full bg-slate-700/60 rounded-full overflow-hidden my-2.5'>
                <div
                  style={{ width: `${confidence}%` }}
                  className={`h-full rounded-full transition-all duration-700 ${
                    isTop ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-slate-500'
                  }`}
                />
              </div>

              {/* Supporting and Missing Skills */}
              <div className='grid sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-700/40 text-xs'>
                <div>
                  <span className='text-slate-400 font-medium flex items-center gap-1 mb-1.5'>
                    <Check className='w-3 h-3 text-emerald-400' /> Supporting Skills:
                  </span>
                  <div className='flex flex-wrap gap-1'>
                    {(item.supporting_skills || []).slice(0, 4).map((s, i) => (
                      <span key={i} className='bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md text-[11px]'>
                        {s}
                      </span>
                    ))}
                    {(!item.supporting_skills || item.supporting_skills.length === 0) && (
                      <span className='text-slate-500 italic'>Foundational skills</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className='text-slate-400 font-medium flex items-center gap-1 mb-1.5'>
                    <Plus className='w-3 h-3 text-amber-400' /> Bridge Skill Gap:
                  </span>
                  <div className='flex flex-wrap gap-1'>
                    {(item.missing_skills || []).slice(0, 3).map((s, i) => (
                      <span key={i} className='bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md text-[11px]'>
                        {s}
                      </span>
                    ))}
                    {(!item.missing_skills || item.missing_skills.length === 0) && (
                      <span className='text-slate-500 italic'>None critical</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RolePredictionCard
