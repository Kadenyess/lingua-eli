import { useNavigate } from 'react-router-dom'
import { Users, BookOpen, TrendingUp, ChevronRight } from 'lucide-react'
import type { ClassWeeklyStats } from '../../types/teacher'
import {
  scoreColor,
  LANGUAGE_FUNCTION_LABELS,
} from '../../types/teacher'

interface Props {
  stats: ClassWeeklyStats
}

export default function ClassCard({ stats }: Props) {
  const navigate = useNavigate()
  const { classData, studentCount, activitiesCompleted, averageScore, topLanguageFunctions } = stats

  const scoreBadge = scoreColor(averageScore)
  const avgDisplay = averageScore !== null ? averageScore.toFixed(1) : '—'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Card header */}
      <div className="p-6 pb-4 border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{classData.name}</h3>
        <p className="text-sm text-gray-400 mt-0.5">Grade {classData.grade}</p>
      </div>

      {/* Stats */}
      <div className="p-6 flex-1 space-y-5">
        {/* Student count */}
        <div className="flex items-center gap-2.5 text-gray-600">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Users size={15} className="text-indigo-500" />
          </div>
          <span className="text-sm">
            <span className="font-semibold text-gray-900">{studentCount}</span> students
          </span>
        </div>

        {/* This week summary */}
        <div className="rounded-xl bg-gray-50 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">This week</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen size={14} />
              <span className="text-sm">
                <span className="font-semibold text-gray-900">{activitiesCompleted}</span> activities done
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp size={14} />
              <span className="text-sm">Average score</span>
            </div>
            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${scoreBadge}`}>
              {avgDisplay} / 3
            </span>
          </div>
        </div>

        {/* Top language functions */}
        {topLanguageFunctions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Top language functions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {topLanguageFunctions.map(({ fn, count }) => (
                <span
                  key={fn}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium"
                >
                  {LANGUAGE_FUNCTION_LABELS[fn]}
                  <span className="text-indigo-400 font-normal">· {count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {activitiesCompleted === 0 && (
          <p className="text-sm text-gray-400 italic">No activity this week yet.</p>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <button
          onClick={() => navigate(`/dashboard/class/${classData.id}`)}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-150"
        >
          View class details
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
