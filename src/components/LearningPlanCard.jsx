import { Compass, TrendingUp, BarChart3, ArrowRight } from 'lucide-react'

const LearningPlanCard = ({ priorities = [] }) => {
  const items = priorities && priorities.length > 0 ? priorities : []

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <Compass className='w-3.5 h-3.5' /> Market Demand Index
          </div>
          <h2 className='text-2xl font-bold text-white'>What Should I Learn Next?</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Prioritized recommendations calculated from 1,068 verified job postings in our dataset
          </p>
        </div>
      </div>

      {/* Prioritized List */}
      <div className='mt-6 space-y-3.5'>
        {items.map((item, idx) => {
          const demand = Math.round(item.demand_percentage || 60)

          return (
            <div
              key={idx}
              className='bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-2xl p-4 transition'
            >
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2'>
                <div className='flex items-center gap-3'>
                  <span className='w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center text-xs'>
                    #{item.priority || idx + 1}
                  </span>
                  <div>
                    <h3 className='font-bold text-base text-white'>{item.skill}</h3>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <span className='text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20'>
                    {demand}% Market Demand
                  </span>
                </div>
              </div>

              {/* Demand Progress Bar */}
              <div className='h-2 w-full bg-slate-700/50 rounded-full overflow-hidden my-2'>
                <div
                  style={{ width: `${demand}%` }}
                  className='h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700'
                />
              </div>

              {/* Supporting Evidence & Suggested Exercise */}
              <div className='mt-2.5 space-y-1.5 text-xs text-slate-300'>
                <p className='flex items-start gap-1'>
                  <span className='text-cyan-400 font-semibold'>Benchmark Evidence:</span>{' '}
                  <span className='text-slate-300'>{item.supporting_evidence || item.reason}</span>
                </p>
                {item.suggested_exercise && (
                  <p className='flex items-start gap-1 bg-slate-900/60 p-2 rounded-xl border border-slate-700/40 text-slate-300'>
                    <span className='text-emerald-400 font-semibold'>Action Exercise:</span>{' '}
                    <span>{item.suggested_exercise}</span>
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {items.length === 0 && (
          <div className='text-center py-6 text-slate-400 text-xs'>
            Learning priorities computed dynamically from missing skills.
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningPlanCard
