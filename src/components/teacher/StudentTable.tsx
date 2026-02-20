import { AlertCircle } from 'lucide-react'
import type { StudentStats, Skill } from '../../types/teacher'
import {
  scoreColor,
  scoreDotColor,
  ELD_LEVEL_COLORS,
  SKILL_LABELS,
  ALL_SKILLS,
} from '../../types/teacher'

interface Props {
  students: StudentStats[]
}

function ScoreDot({ skill, avg }: { skill: Skill; avg: number | undefined }) {
  const dotColor = scoreDotColor(avg ?? null)
  const label = avg !== null && avg !== undefined ? avg.toFixed(1) : '—'
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`w-3 h-3 rounded-full ${dotColor}`}
        title={`${SKILL_LABELS[skill]}: ${label}`}
      />
      <span className="text-[10px] text-gray-400">{SKILL_LABELS[skill].slice(0, 4)}</span>
    </div>
  )
}

export default function StudentTable({ students }: Props) {
  // Sort: struggling students first (lowest avg score), then alphabetical
  const sorted = [...students].sort((a, b) => {
    const aScore = a.averageScore ?? 0
    const bScore = b.averageScore ?? 0
    return aScore - bScore
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">
              Student
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">
              ELD Level
            </th>
            <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">
              Activities
            </th>
            <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">
              Avg Score
            </th>
            <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
              Skills (V · R · S · W)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map(({ student, activitiesCompleted, averageScore, scoreBySkill }) => {
            const isStruggling = averageScore !== null && averageScore < 2.0
            const avgBadge = scoreColor(averageScore)
            const avgDisplay = averageScore !== null ? averageScore.toFixed(1) : '—'

            return (
              <tr
                key={student.id}
                className={`${isStruggling ? 'bg-red-50/40' : ''} hover:bg-gray-50/60 transition-colors`}
              >
                {/* Name + alert icon */}
                <td className="py-3.5 pr-4 font-medium text-gray-900 flex items-center gap-1.5">
                  {isStruggling && (
                    <AlertCircle
                      size={14}
                      className="text-red-400 flex-shrink-0"
                      aria-label="Needs support"
                    />
                  )}
                  {student.name}
                </td>

                {/* ELD Level badge */}
                <td className="py-3.5 pr-4">
                  <span
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${ELD_LEVEL_COLORS[student.level]}`}
                  >
                    {student.level}
                  </span>
                </td>

                {/* Activities count */}
                <td className="py-3.5 pr-4 text-center text-gray-700 font-semibold">
                  {activitiesCompleted}
                </td>

                {/* Average score */}
                <td className="py-3.5 pr-4 text-center">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${avgBadge}`}>
                    {avgDisplay}
                  </span>
                </td>

                {/* Skill dots */}
                <td className="py-3.5">
                  <div className="flex items-center justify-center gap-3">
                    {ALL_SKILLS.map(skill => (
                      <ScoreDot key={skill} skill={skill} avg={scoreBySkill[skill]} />
                    ))}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 px-1 text-xs text-gray-400">
        <span className="font-medium text-gray-500">Score key:</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> 2.5–3 Strong
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> 1.8–2.4 Developing
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> &lt;1.8 Needs support
        </span>
      </div>
    </div>
  )
}
