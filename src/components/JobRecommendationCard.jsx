import { Building2, Check, ArrowRight, Zap, Target } from 'lucide-react'

const JobRecommendationCard = ({ matchedJobs = [] }) => {
  const jobs = matchedJobs && matchedJobs.length > 0 ? matchedJobs : []

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <Building2 className='w-3.5 h-3.5' /> Verified Dataset Matches
          </div>
          <h2 className='text-2xl font-bold text-white'>Job Recommendations</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Semantic matches from 1,068 verified job postings using Sentence Transformers
          </p>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className='mt-6 space-y-4'>
        {jobs.map((job, idx) => {
          const matchPct = Math.round(job.match_percentage || 80)
          const matchedSkills = job.matched_skills || []
          const missingSkills = job.missing_skills || []
          const jobReadySkills = job.job_ready_skills || missingSkills.slice(0, 3)

          return (
            <div
              key={idx}
              className='bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 transition'
            >
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3'>
                <div>
                  <div className='flex items-center gap-2.5'>
                    <h3 className='text-lg font-bold text-white'>{job.title}</h3>
                    <span className='bg-slate-700/80 text-slate-300 text-[11px] px-2.5 py-0.5 rounded-full font-medium'>
                      {job.experience_level || 'Mid-Level'} ({job.years_of_experience || '1-3'} yrs)
                    </span>
                  </div>
                  {job.job_id && (
                    <span className='text-[10px] text-slate-500 font-mono'>ID: {job.job_id}</span>
                  )}
                </div>

                <div className='flex items-center gap-2'>
                  <div className='text-right'>
                    <div className='text-2xl font-black text-emerald-400'>{matchPct}%</div>
                    <div className='text-[10px] text-slate-400 font-medium'>Profile Match</div>
                  </div>
                </div>
              </div>

              {/* Why it matches */}
              {job.why_it_matches && (
                <div className='bg-slate-900/60 border border-slate-700/40 rounded-xl p-3 mb-3.5 flex items-start gap-2 text-xs'>
                  <Zap className='w-4 h-4 text-cyan-400 shrink-0 mt-0.5' />
                  <p className='text-slate-300 leading-relaxed'>
                    <strong className='text-cyan-300 font-semibold'>Why this job matches: </strong>
                    {job.why_it_matches}
                  </p>
                </div>
              )}

              {/* Skills Grid */}
              <div className='grid sm:grid-cols-2 gap-3 text-xs'>
                {/* Matched */}
                <div className='bg-slate-900/40 p-3 rounded-xl border border-slate-700/30'>
                  <span className='text-slate-400 font-medium flex items-center gap-1.5 mb-2'>
                    <Check className='w-3.5 h-3.5 text-emerald-400' /> Matched Skills ({matchedSkills.length})
                  </span>
                  <div className='flex flex-wrap gap-1.5'>
                    {matchedSkills.map((s, i) => (
                      <span key={i} className='bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[11px]'>
                        {s}
                      </span>
                    ))}
                    {matchedSkills.length === 0 && (
                      <span className='text-slate-500 italic'>General profile alignment</span>
                    )}
                  </div>
                </div>

                {/* Job-Ready / Missing Skills */}
                <div className='bg-slate-900/40 p-3 rounded-xl border border-slate-700/30'>
                  <span className='text-slate-400 font-medium flex items-center gap-1.5 mb-2'>
                    <Target className='w-3.5 h-3.5 text-amber-400' /> Skills to Become 100% Job-Ready
                  </span>
                  <div className='flex flex-wrap gap-1.5'>
                    {jobReadySkills.map((s, i) => (
                      <span key={i} className='bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md text-[11px]'>
                        + {s}
                      </span>
                    ))}
                    {jobReadySkills.length === 0 && (
                      <span className='text-emerald-400 font-medium'>Fully Job Ready!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {jobs.length === 0 && (
          <div className='text-center py-8 text-slate-400 text-sm'>
            No matching jobs found. Upload a resume to trigger semantic dataset recommendations.
          </div>
        )}
      </div>
    </div>
  )
}

export default JobRecommendationCard
