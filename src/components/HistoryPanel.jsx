import { useState, useEffect } from 'react'
import { History, TrendingUp, Calendar, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import API from '../services/api'

const HistoryPanel = ({ onSelectAnalysis }) => {
  const [history, setHistory] = useState([])
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const res = await API.get('/analyze/history')
        if (res.data?.history) {
          setHistory(res.data.history)
          setTrends(res.data.trends || [])
        }
      } catch (err) {
        console.warn('Could not fetch history:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className='bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl'>
      {/* Header */}
      <div className='flex items-center justify-between pb-6 border-b border-slate-800'>
        <div>
          <div className='inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2'>
            <History className='w-3.5 h-3.5' /> MongoDB Persistent Records
          </div>
          <h2 className='text-2xl font-bold text-white'>Analysis History & Progress Trends</h2>
          <p className='text-xs text-slate-400 mt-1'>
            Track your ATS score and resume quality improvement across iterations
          </p>
        </div>
      </div>

      {/* Score Progression Trend Bar if multiple analyses exist */}
      {trends.length > 1 && (
        <div className='my-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3'>
          <h3 className='text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5'>
            <TrendingUp className='w-4 h-4' /> Score Progression Trend
          </h3>

          <div className='grid sm:grid-cols-2 gap-4 text-xs'>
            <div className='bg-slate-900/60 p-3 rounded-xl border border-slate-700/40'>
              <span className='text-slate-400 block mb-1'>ATS Score Progression:</span>
              <div className='flex items-center gap-2 flex-wrap font-bold text-sm text-cyan-300'>
                {trends.map((t, idx) => (
                  <span key={idx} className='flex items-center gap-1.5'>
                    <span>{t.atsScore}%</span>
                    {idx < trends.length - 1 && <span className='text-slate-500'>→</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className='bg-slate-900/60 p-3 rounded-xl border border-slate-700/40'>
              <span className='text-slate-400 block mb-1'>Resume Quality Progression:</span>
              <div className='flex items-center gap-2 flex-wrap font-bold text-sm text-purple-300'>
                {trends.map((t, idx) => (
                  <span key={idx} className='flex items-center gap-1.5'>
                    <span>{t.qualityScore || 70}%</span>
                    {idx < trends.length - 1 && <span className='text-slate-500'>→</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Items List */}
      <div className='mt-5 space-y-3'>
        {history.map((item, idx) => {
          const dateStr = item.createdAt || item.uploadedAt
            ? new Date(item.createdAt || item.uploadedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Recent'

          return (
            <div
              key={idx}
              className='bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition text-xs'
            >
              <div className='flex items-start gap-3'>
                <div className='w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5'>
                  <FileText className='w-4 h-4' />
                </div>
                <div>
                  <h4 className='font-bold text-white text-sm'>{item.fileName || 'resume.pdf'}</h4>
                  <div className='flex items-center gap-2 text-slate-400 text-[11px] mt-0.5'>
                    <span className='flex items-center gap-1'>
                      <Calendar className='w-3 h-3' /> {dateStr}
                    </span>
                    <span>•</span>
                    <span className='text-cyan-300 font-medium'>{item.predictedRole || 'Software Engineer'}</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <span className='text-sm font-black text-cyan-400 block'>{item.atsScore}% ATS</span>
                  <span className='text-[10px] text-purple-400 font-medium'>{item.qualityScore || 70}% Quality</span>
                </div>

                {onSelectAnalysis && (
                  <button
                    onClick={() => onSelectAnalysis(item)}
                    className='bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition'
                  >
                    <span>Load</span>
                    <ArrowRight className='w-3 h-3' />
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {!loading && history.length === 0 && (
          <div className='text-center py-8 text-slate-400 text-xs'>
            No historical analyses recorded yet. Upload and analyze a resume to build your history.
          </div>
        )}

        {loading && (
          <div className='text-center py-6 text-slate-400 text-xs animate-pulse'>
            Loading analysis history...
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPanel
