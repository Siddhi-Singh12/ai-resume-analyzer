import { useState, useEffect } from 'react'
import { MapPin, Calendar, CheckSquare, Award, RefreshCw, Compass, ArrowRight, Layers } from 'lucide-react'
import API from '../services/api'

const CareerRoadmapPanel = ({
  roadmap = [],
  targetRole = 'Software Engineer',
  resumeText = '',
  missingSkills = []
}) => {
  const [selectedRole, setSelectedRole] = useState(targetRole || 'Software Engineer')
  const [phases, setPhases] = useState(roadmap && roadmap.length > 0 ? roadmap : [])
  const [loading, setLoading] = useState(false)

  const roles = [
    'Software Engineer',
    'Machine Learning Engineer',
    'Data Scientist',
    'Data Analyst',
    'Cloud / DevOps Engineer'
  ]

  useEffect(() => {
    if (roadmap && roadmap.length > 0) {
      setPhases(roadmap)
    }
  }, [roadmap])

  useEffect(() => {
    if (targetRole) {
      setSelectedRole(targetRole)
    }
  }, [targetRole])

  const handleRoleChange = async (newRole) => {
    setSelectedRole(newRole)
    try {
      setLoading(true)
      const res = await API.post('/career/roadmap', {
        resume_text: resumeText,
        target_role: newRole,
        missing_skills: missingSkills
      })
      if (res.data?.roadmap_phases) {
        setPhases(res.data.roadmap_phases)
      } else if (res.data?.roadmap) {
        setPhases(res.data.roadmap)
      }
    } catch (err) {
      console.error('Error generating roadmap for role:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <Award className='w-3.5 h-3.5' /> Dynamic Career Progression
          </div>
          <h2 className='text-2xl font-bold text-white'>Personalized Career Roadmap</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Sequential 6-phase trajectory to transition into a top-tier {selectedRole}
          </p>
        </div>

        {/* Role Selector & Regenerate */}
        <div className='flex items-center gap-2'>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={loading}
            className='bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-cyan-400'
          >
            {roles.map(r => (
              <option key={r} value={r} className='bg-slate-900 text-white'>
                {r}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleRoleChange(selectedRole)}
            disabled={loading}
            className='bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50 font-medium'
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Generating...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* 6-Phase Timeline */}
      {phases.length > 0 && (
        <div className='mt-8 relative'>
          {/* Vertical line connecting phases */}
          <div className='hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500'></div>

          <div className='space-y-6'>
            {phases.map((phase, idx) => (
              <div key={idx} className='relative flex flex-col sm:flex-row items-start gap-4'>
                {/* Badge/Dot */}
                <div className='sm:w-16 flex sm:justify-center shrink-0 z-10'>
                  <div className='w-9 h-9 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center font-bold text-xs shadow-lg shadow-cyan-500/20'>
                    {phase.phase_number || idx + 1}
                  </div>
                </div>

                {/* Card */}
                <div className='flex-1 bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 hover:bg-slate-800/70 transition w-full'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2'>
                    <h3 className='text-base font-bold text-white'>{phase.phase_name}</h3>
                    <span className='inline-flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full font-medium w-fit'>
                      <Calendar className='w-3 h-3' /> {phase.duration || '3-4 Weeks'}
                    </span>
                  </div>

                  <p className='text-xs text-slate-300 mb-3'>{phase.focus}</p>

                  {/* Key Skills */}
                  {phase.key_skills && phase.key_skills.length > 0 && (
                    <div className='mb-3 flex flex-wrap gap-1.5'>
                      {phase.key_skills.map((skill, i) => (
                        <span key={i} className='bg-slate-700/60 text-slate-200 px-2.5 py-0.5 rounded-md text-[11px] font-medium'>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Deliverables */}
                  {phase.deliverables && (
                    <div className='space-y-1.5 pt-2 border-t border-slate-700/40 text-xs'>
                      {phase.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className='flex items-start gap-2 text-slate-400'>
                          <CheckSquare className='w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5' />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dependencies */}
                  {phase.dependencies && (
                    <div className='mt-3 pt-2 border-t border-slate-700/30 text-[11px] text-slate-500 flex items-center gap-1.5'>
                      <Layers className='w-3 h-3 text-slate-400' />
                      <span><strong>Prerequisite:</strong> {phase.dependencies}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {phases.length === 0 && !loading && (
        <div className='bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center space-y-3 mt-6'>
          <div className='w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto'>
            <Compass className='w-6 h-6' />
          </div>
          <h3 className='font-bold text-base text-white'>Generate a Roadmap</h3>
          <p className='text-xs text-slate-400 max-w-md mx-auto'>
            Generate a sequential 6-phase trajectory to transition into a top-tier {selectedRole} based on your current resume skills and missing requirements.
          </p>
          <button
            onClick={() => handleRoleChange(selectedRole)}
            className='bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition hover:opacity-90 inline-flex items-center gap-2'
          >
            <Compass className='w-3.5 h-3.5' /> Generate {selectedRole} Roadmap
          </button>
        </div>
      )}
    </div>
  )
}

export default CareerRoadmapPanel
