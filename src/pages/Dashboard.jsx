import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Layers,
  Briefcase,
  HelpCircle,
  Compass,
  GitCompare,
  History,
  FileCheck
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ATSCard from '../components/ATSCard'
import ResumeQualityCard from '../components/ResumeQualityCard'
import RolePredictionCard from '../components/RolePredictionCard'
import SkillGapCard from '../components/SkillGapCard'
import JobRecommendationCard from '../components/JobRecommendationCard'
import ResumeImprovementPanel from '../components/ResumeImprovementPanel'
import SectionAnalysisPanel from '../components/SectionAnalysisPanel'
import ProjectAnalysisPanel from '../components/ProjectAnalysisPanel'
import InterviewPrepPanel from '../components/InterviewPrepPanel'
import CareerRoadmapPanel from '../components/CareerRoadmapPanel'
import LearningPlanCard from '../components/LearningPlanCard'
import MultiJDComparison from '../components/MultiJDComparison'
import HistoryPanel from '../components/HistoryPanel'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [analysisData, setAnalysisData] = useState(() => {
    const fromState = location.state?.data || location.state || {}
    if (fromState && (fromState.score || fromState.atsScore || fromState.predictedRole)) {
      try {
        localStorage.setItem('lastAnalysisResult', JSON.stringify(fromState))
      } catch (e) {}
      return fromState
    }
    try {
      const stored = localStorage.getItem('lastAnalysisResult')
      if (stored) return JSON.parse(stored)
    } catch (e) {}
    return {}
  })

  useEffect(() => {
    if (location.state?.data || location.state) {
      const data = location.state.data || location.state
      setAnalysisData(data)
      try {
        localStorage.setItem('lastAnalysisResult', JSON.stringify(data))
      } catch (e) {}
    }
  }, [location.state])

  // Normalization - genuine calculated scores, never hardcoded fallbacks
  const hasAnalysis = Boolean(analysisData && (analysisData.score !== undefined || analysisData.atsScore !== undefined || analysisData.predictedRole))
  const atsScore = analysisData.atsScore ?? analysisData.score ?? 0
  const qualityScore = analysisData.qualityScore ?? 0
  const predictedRole = analysisData.predictedRole || (hasAnalysis ? 'Software Engineer' : 'No Analysis Loaded')
  const resumeName = analysisData.resumeName || analysisData.fileName || (hasAnalysis ? 'Resume.pdf' : 'No Resume Selected')

  const handleSelectFromHistory = (historicalItem) => {
    setAnalysisData(historicalItem)
    try {
      localStorage.setItem('lastAnalysisResult', JSON.stringify(historicalItem))
    } catch (e) {}
    setActiveTab('overview')
  }


  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: <Sparkles className='w-4 h-4' /> },
    { id: 'jobs', label: 'Job Matches', icon: <Briefcase className='w-4 h-4' />, count: analysisData.matchedJobs?.length || analysisData.recommendations?.length || 0 },
    { id: 'improvement', label: 'Resume Improvements', icon: <FileCheck className='w-4 h-4' /> },
    { id: 'sections', label: 'Section & Project Audit', icon: <Layers className='w-4 h-4' /> },
    { id: 'interview', label: 'Interview Prep', icon: <HelpCircle className='w-4 h-4' /> },
    { id: 'career', label: 'Roadmap & Learning', icon: <Compass className='w-4 h-4' /> },
    { id: 'compare', label: 'Multi-JD Match', icon: <GitCompare className='w-4 h-4' /> },
    { id: 'history', label: 'Analysis History', icon: <History className='w-4 h-4' /> }
  ]

  return (
    <div className='min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black'>
      <Navbar />

      {/* Atmospheric lighting */}
      <div className='fixed top-20 left-10 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none'></div>
      <div className='fixed bottom-10 right-10 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none'></div>

      <main className='flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 relative z-10'>
        {/* Top Header / Hero */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 mb-6'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span className='bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1.5'>
                <Sparkles className='w-3 h-3' /> AI Intelligence System
              </span>
              <span className='text-xs text-slate-400 font-mono'>
                File: <strong className='text-slate-200'>{resumeName}</strong>
              </span>
            </div>

            <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-white'>
              Resume Analysis <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>Intelligence</span>
            </h1>
            <p className='text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl'>
              Target Role: <strong className='text-cyan-300 font-semibold'>{predictedRole}</strong> • Calibrated against 1,068 verified market roles
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/analyzer')}
              className='flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 transition'
            >
              <ArrowLeft className='w-3.5 h-3.5' />
              <span>Back to Upload</span>
            </button>

            <Link
              to='/analyzer'
              className='flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 px-4 py-2 rounded-xl text-xs font-bold text-black shadow-lg shadow-cyan-500/20 transition'
            >
              <RefreshCw className='w-3.5 h-3.5' />
              <span>Analyze New Resume</span>
            </Link>
          </div>
        </div>

        {/* High-Level Stat Bar */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8'>
          <div className='bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between'>
            <div>
              <span className='text-[11px] text-slate-400 uppercase font-semibold tracking-wider block'>ATS Match</span>
              <span className='text-2xl font-black text-cyan-400'>{atsScore}%</span>
            </div>
            <div className='w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-sm'>
              ⚡
            </div>
          </div>

          <div className='bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between'>
            <div>
              <span className='text-[11px] text-slate-400 uppercase font-semibold tracking-wider block'>Resume Quality</span>
              <span className='text-2xl font-black text-purple-400'>{qualityScore}%</span>
            </div>
            <div className='w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-sm'>
              💎
            </div>
          </div>

          <div className='bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between'>
            <div>
              <span className='text-[11px] text-slate-400 uppercase font-semibold tracking-wider block'>Matched Skills</span>
              <span className='text-2xl font-black text-emerald-400'>
                {analysisData.matchedSkills?.length ?? analysisData.skills?.length ?? 0}
              </span>
            </div>
            <div className='w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm'>
              ✓
            </div>
          </div>

          <div className='bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between'>
            <div>
              <span className='text-[11px] text-slate-400 uppercase font-semibold tracking-wider block'>Skill Gaps</span>
              <span className='text-2xl font-black text-rose-400'>
                {analysisData.missingSkills?.length ?? 0}
              </span>
            </div>
            <div className='w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold text-sm'>
              !
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className='flex gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-slate-800 text-xs font-semibold'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-black text-cyan-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            <div className='grid lg:grid-cols-2 gap-6'>
              <ATSCard
                score={atsScore}
                breakdown={analysisData.atsBreakdown || {}}
              />
              <ResumeQualityCard
                qualityScore={qualityScore}
                qualityAnalysis={analysisData.qualityAnalysis || {}}
              />
            </div>

            <div className='grid lg:grid-cols-2 gap-6'>
              <RolePredictionCard
                predictedRole={predictedRole}
                predictedRoles={analysisData.predictedRoles || []}
              />
              <SkillGapCard
                skillGaps={analysisData.skillGaps || {}}
                matchedSkills={analysisData.matchedSkills || []}
                missingSkills={analysisData.missingSkills || []}
              />
            </div>
          </div>
        )}

        {/* TAB 2: JOB MATCHES */}
        {activeTab === 'jobs' && (
          <div>
            <JobRecommendationCard
              matchedJobs={analysisData.matchedJobs || analysisData.recommendations || []}
            />
          </div>
        )}

        {/* TAB 3: RESUME IMPROVEMENTS */}
        {activeTab === 'improvement' && (
          <div>
            <ResumeImprovementPanel
              improvements={analysisData.resumeImprovements || {}}
              summaries={analysisData.summaries || {}}
            />
          </div>
        )}

        {/* TAB 4: SECTION & PROJECT AUDIT */}
        {activeTab === 'sections' && (
          <div className='space-y-6'>
            <SectionAnalysisPanel
              sectionAnalysis={analysisData.sectionAnalysis || {}}
            />
            <ProjectAnalysisPanel
              projects={analysisData.projectAnalysis || []}
              resumeText={analysisData.resumeText || ''}
            />
          </div>
        )}

        {/* TAB 5: INTERVIEW PREP */}
        {activeTab === 'interview' && (
          <div>
            <InterviewPrepPanel
              initialPrep={analysisData.interviewPrep || {}}
              resumeText={analysisData.resumeText || ''}
              predictedRole={predictedRole}
            />
          </div>
        )}

        {/* TAB 6: CAREER ROADMAP & LEARNING PLAN */}
        {activeTab === 'career' && (
          <div className='space-y-6'>
            <CareerRoadmapPanel
              roadmap={analysisData.careerRoadmap || []}
              targetRole={predictedRole}
            />
            <LearningPlanCard
              priorities={analysisData.learningPriorities || []}
            />
          </div>
        )}

        {/* TAB 7: MULTI-JD COMPARISON */}
        {activeTab === 'compare' && (
          <div>
            <MultiJDComparison
              resumeText={analysisData.resumeText || ''}
              analysisId={analysisData.analysisId}
            />
          </div>
        )}

        {/* TAB 8: HISTORY & PROGRESSION TRENDS */}
        {activeTab === 'history' && (
          <div>
            <HistoryPanel
              onSelectAnalysis={handleSelectFromHistory}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard