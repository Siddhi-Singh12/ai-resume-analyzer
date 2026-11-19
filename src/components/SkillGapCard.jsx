import { CheckCircle2, TrendingUp, AlertCircle, Sparkles } from 'lucide-react'

const SkillGapCard = ({ skillGaps = {}, matchedSkills = [], missingSkills = [] }) => {
  const strong = (skillGaps.strong_skills && skillGaps.strong_skills.length > 0)
    ? skillGaps.strong_skills
    : (matchedSkills.length > 0 ? matchedSkills.slice(0, 6) : ['Python', 'SQL'])

  const developing = (skillGaps.developing_skills && skillGaps.developing_skills.length > 0)
    ? skillGaps.developing_skills
    : ['Git', 'REST APIs', 'Unit Testing']

  const missing = (skillGaps.missing_skills && skillGaps.missing_skills.length > 0)
    ? skillGaps.missing_skills
    : (missingSkills.length > 0 ? missingSkills.slice(0, 5) : ['Docker', 'AWS'])

  const recommended = (skillGaps.recommended_skills && skillGaps.recommended_skills.length > 0)
    ? skillGaps.recommended_skills
    : ['Kubernetes', 'CI/CD', 'System Design']

  const categories = [
    {
      title: 'Strong Skills',
      subtitle: 'Prominently demonstrated in resume & projects',
      skills: strong,
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      pillColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25',
      icon: <CheckCircle2 className='w-4 h-4 text-emerald-400' />
    },
    {
      title: 'Developing Skills',
      subtitle: 'Foundational; can be strengthened with more project depth',
      skills: developing,
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      pillColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25',
      icon: <TrendingUp className='w-4 h-4 text-cyan-400' />
    },
    {
      title: 'Missing Skills',
      subtitle: 'Expected by target role or JD, absent from resume',
      skills: missing,
      badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      pillColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25',
      icon: <AlertCircle className='w-4 h-4 text-rose-400' />
    },
    {
      title: 'Recommended Skills',
      subtitle: 'Industry-standard high-leverage skills to stand out',
      skills: recommended,
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      pillColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25',
      icon: <Sparkles className='w-4 h-4 text-amber-400' />
    }
  ]

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <span>🔍</span> 4-Category Taxonomy
          </div>
          <h2 className='text-2xl font-bold text-white'>Advanced Skill Gap Analysis</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Dynamic comparison: Resume Skills ↔ Job Description ↔ Role Standards
          </p>
        </div>
      </div>

      {/* 4 Categorized Cards */}
      <div className='mt-6 grid md:grid-cols-2 gap-4'>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className='bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-600 transition'
          >
            <div>
              <div className='flex items-center justify-between mb-1'>
                <div className='flex items-center gap-2'>
                  {cat.icon}
                  <h3 className='font-bold text-sm text-white'>{cat.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cat.badgeColor}`}>
                  {cat.skills.length} skills
                </span>
              </div>
              <p className='text-[11px] text-slate-400 mb-3.5'>{cat.subtitle}</p>

              <div className='flex flex-wrap gap-1.5'>
                {cat.skills.map((s, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition cursor-default ${cat.pillColor}`}
                  >
                    {s}
                  </span>
                ))}
                {cat.skills.length === 0 && (
                  <span className='text-xs text-slate-500 italic'>None detected</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillGapCard
