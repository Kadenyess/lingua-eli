import { useMemo, useState } from 'react'
import { AlertTriangle, Download, Filter, Search, ShieldCheck, Siren, TimerReset } from 'lucide-react'
import type { Skill } from '../../types/teacher'
import type { GapSupportTier, InterventionStudent, RiskTier } from '../../utils/intervention'

interface Props {
  students: InterventionStudent[]
}

type ScoreBand = 'all' | 'below_2_2' | 'below_2_0' | 'below_1_8'
type InactivityFilter = 'all' | 'days_3_plus' | 'days_7_plus' | 'never'
type GapFilter = 'all' | 'uncleared' | 'severe' | 'moderate_plus' | 'cleared'
type TriagePreset = 'all_students' | 'urgent_now' | 'severe_gaps' | 'reengage_inactive' | 'custom'

const riskLabel: Record<RiskTier, string> = {
  urgent: 'Urgent',
  watch: 'Watch',
  stable: 'Stable',
}

const riskStyle: Record<RiskTier, string> = {
  urgent: 'bg-red-100 text-red-700',
  watch: 'bg-amber-100 text-amber-700',
  stable: 'bg-green-100 text-green-700',
}

const gapLabel: Record<GapSupportTier, string> = {
  severe: 'Severe Gap',
  moderate: 'Moderate Gap',
  mild: 'Mild Gap',
  cleared: 'Cleared',
}

const gapStyle: Record<GapSupportTier, string> = {
  severe: 'bg-red-100 text-red-700',
  moderate: 'bg-amber-100 text-amber-700',
  mild: 'bg-blue-100 text-blue-700',
  cleared: 'bg-emerald-100 text-emerald-700',
}

function gapTierWeight(tier: GapSupportTier): number {
  if (tier === 'severe') return 3
  if (tier === 'moderate') return 2
  if (tier === 'mild') return 1
  return 0
}

function scoreBandMatch(avg: number | null, band: ScoreBand): boolean {
  if (band === 'all') return true
  if (avg === null) return band !== 'below_2_2'
  if (band === 'below_2_2') return avg < 2.2
  if (band === 'below_2_0') return avg < 2.0
  return avg < 1.8
}

function inactivityMatch(days: number | null, filter: InactivityFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'never') return days === null
  if (days === null) return false
  if (filter === 'days_7_plus') return days >= 7
  return days >= 3
}

function sortByPriority(items: InterventionStudent[]) {
  return [...items].sort((a, b) => {
    if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore
    if (gapTierWeight(b.gapSupportTier) !== gapTierWeight(a.gapSupportTier)) {
      return gapTierWeight(b.gapSupportTier) - gapTierWeight(a.gapSupportTier)
    }
    const aAvg = a.averageScore ?? 0
    const bAvg = b.averageScore ?? 0
    if (aAvg !== bAvg) return aAvg - bAvg
    return a.studentName.localeCompare(b.studentName)
  })
}

function csvEscape(value: string | number | null): string {
  if (value === null) return ''
  const text = String(value)
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function downloadInterventionCsv(rows: InterventionStudent[]) {
  const header = [
    'student_id',
    'student_name',
    'class_name',
    'risk_score',
    'risk_tier',
    'gap_status',
    'gap_score_percent',
    'gap_dimensions_flagged',
    'curriculum_level',
    'weakest_skill',
    'days_since_last_activity',
    'recommended_next_step',
  ]
  const lines = rows.map((row) => [
    row.studentId,
    row.studentName,
    row.className,
    row.riskScore,
    row.riskTier,
    row.gapSupportTier,
    row.gapScorePercent,
    row.gapDimensionsFlagged,
    row.estimatedCurriculumLevel,
    row.weakestSkill ?? '',
    row.daysSinceLastActivity === null ? '' : row.daysSinceLastActivity,
    row.recommendation,
  ])

  const csv = [header, ...lines]
    .map((cells) => cells.map((cell) => csvEscape(cell as string | number | null)).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const timestamp = new Date().toISOString().slice(0, 10)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `intervention-priority-${timestamp}.csv`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export default function InterventionDashboard({ students }: Props) {
  const [search, setSearch] = useState('')
  const [activePreset, setActivePreset] = useState<TriagePreset>('all_students')
  const [classFilter, setClassFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState<RiskTier | 'all'>('all')
  const [eldFilter, setEldFilter] = useState<'all' | 'Emerging' | 'Expanding' | 'Bridging'>('all')
  const [skillFilter, setSkillFilter] = useState<Skill | 'all'>('all')
  const [scoreFilter, setScoreFilter] = useState<ScoreBand>('all')
  const [inactivityFilter, setInactivityFilter] = useState<InactivityFilter>('all')
  const [gapFilter, setGapFilter] = useState<GapFilter>('all')

  const classOptions = useMemo(() => {
    const set = new Set(students.map((s) => s.className))
    return ['all', ...Array.from(set).sort()]
  }, [students])

  const applyPreset = (preset: TriagePreset) => {
    setActivePreset(preset)
    if (preset === 'all_students') {
      setRiskFilter('all')
      setGapFilter('all')
      setInactivityFilter('all')
      setScoreFilter('all')
      setSkillFilter('all')
      return
    }
    if (preset === 'urgent_now') {
      setRiskFilter('urgent')
      setGapFilter('moderate_plus')
      setInactivityFilter('all')
      setScoreFilter('below_2_2')
      setSkillFilter('all')
      return
    }
    if (preset === 'severe_gaps') {
      setRiskFilter('all')
      setGapFilter('severe')
      setInactivityFilter('all')
      setScoreFilter('all')
      setSkillFilter('all')
      return
    }
    setRiskFilter('watch')
    setGapFilter('uncleared')
    setInactivityFilter('days_7_plus')
    setScoreFilter('all')
    setSkillFilter('all')
  }

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    const rows = students.filter((row) => {
      if (needle) {
        const matchName = row.studentName.toLowerCase().includes(needle)
        const matchClass = row.className.toLowerCase().includes(needle)
        if (!matchName && !matchClass) return false
      }
      if (classFilter !== 'all' && row.className !== classFilter) return false
      if (riskFilter !== 'all' && row.riskTier !== riskFilter) return false
      if (eldFilter !== 'all' && row.eldLevel !== eldFilter) return false
      if (skillFilter !== 'all' && row.weakestSkill !== skillFilter) return false
      if (!scoreBandMatch(row.averageScore, scoreFilter)) return false
      if (!inactivityMatch(row.daysSinceLastActivity, inactivityFilter)) return false
      if (gapFilter === 'uncleared' && row.gapCheckCleared) return false
      if (gapFilter === 'severe' && row.gapSupportTier !== 'severe') return false
      if (gapFilter === 'moderate_plus' && !['severe', 'moderate'].includes(row.gapSupportTier)) return false
      if (gapFilter === 'cleared' && !row.gapCheckCleared) return false
      return true
    })
    return sortByPriority(rows)
  }, [students, search, classFilter, riskFilter, eldFilter, skillFilter, scoreFilter, inactivityFilter, gapFilter])

  const summary = useMemo(() => {
    const urgent = filtered.filter((row) => row.riskTier === 'urgent').length
    const watch = filtered.filter((row) => row.riskTier === 'watch').length
    const inactive = filtered.filter((row) => row.daysSinceLastActivity === null || (row.daysSinceLastActivity ?? 0) >= 7).length
    const gapAlerts = filtered.filter((row) => !row.gapCheckCleared).length
    const avgRisk = filtered.length > 0 ? Math.round(filtered.reduce((sum, row) => sum + row.riskScore, 0) / filtered.length) : 0
    return { urgent, watch, inactive, gapAlerts, avgRisk }
  }, [filtered])

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Intervention Command Center</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Prioritized list of students who need support first.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
          <Filter size={12} />
          {filtered.length} shown
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-5">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-700 text-xs font-semibold uppercase tracking-wider">
            <Siren size={13} />
            Urgent
          </div>
          <p className="text-2xl font-bold text-red-800 mt-1">{summary.urgent}</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle size={13} />
            Watch
          </div>
          <p className="text-2xl font-bold text-amber-800 mt-1">{summary.watch}</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <TimerReset size={13} />
            Inactive (7+ days)
          </div>
          <p className="text-2xl font-bold text-indigo-800 mt-1">{summary.inactive}</p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
          <div className="flex items-center gap-2 text-violet-700 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle size={13} />
            Gap Alerts
          </div>
          <p className="text-2xl font-bold text-violet-800 mt-1">{summary.gapAlerts}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={13} />
            Avg Risk
          </div>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{summary.avgRisk}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('urgent_now')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
              activePreset === 'urgent_now'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            Immediate Support
          </button>
          <button
            type="button"
            onClick={() => applyPreset('severe_gaps')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
              activePreset === 'severe_gaps'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Severe Gaps
          </button>
          <button
            type="button"
            onClick={() => applyPreset('reengage_inactive')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
              activePreset === 'reengage_inactive'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            Re-Engage Inactive
          </button>
          <button
            type="button"
            onClick={() => applyPreset('all_students')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
              activePreset === 'all_students'
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            All Students
          </button>
          </div>
          <button
            type="button"
            onClick={() => downloadInterventionCsv(filtered)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
          >
            <Download size={12} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
        <label className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setActivePreset('custom')
            }}
            placeholder="Search student or class"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        <select
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value)
            setActivePreset('custom')
          }}
          className="h-9 rounded-lg border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls === 'all' ? 'All classes' : cls}
            </option>
          ))}
        </select>
        <select
          value={riskFilter}
          onChange={(e) => {
            setRiskFilter(e.target.value as RiskTier | 'all')
            setActivePreset('custom')
          }}
          className="h-9 rounded-lg border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">All risk tiers</option>
          <option value="urgent">Urgent</option>
          <option value="watch">Watch</option>
          <option value="stable">Stable</option>
        </select>
        <select
          value={eldFilter}
          onChange={(e) => {
            setEldFilter(e.target.value as typeof eldFilter)
            setActivePreset('custom')
          }}
          className="h-9 rounded-lg border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">All ELD levels</option>
          <option value="Emerging">Emerging</option>
          <option value="Expanding">Expanding</option>
          <option value="Bridging">Bridging</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
        <select
          value={skillFilter}
          onChange={(e) => {
            setSkillFilter(e.target.value as Skill | 'all')
            setActivePreset('custom')
          }}
          className="h-9 rounded-lg border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">Any weakest skill</option>
          <option value="reading">Reading</option>
          <option value="writing">Writing</option>
          <option value="speaking">Speaking</option>
          <option value="vocabulary">Vocabulary</option>
        </select>
        <select
          value={scoreFilter}
          onChange={(e) => {
            setScoreFilter(e.target.value as ScoreBand)
            setActivePreset('custom')
          }}
          className="h-9 rounded-lg border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">Any average score</option>
          <option value="below_2_2">Below 2.2</option>
          <option value="below_2_0">Below 2.0</option>
          <option value="below_1_8">Below 1.8</option>
        </select>
        <select
          value={inactivityFilter}
          onChange={(e) => {
            setInactivityFilter(e.target.value as InactivityFilter)
            setActivePreset('custom')
          }}
          className="h-9 rounded-lg border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">Any activity recency</option>
          <option value="days_3_plus">Inactive 3+ days</option>
          <option value="days_7_plus">Inactive 7+ days</option>
          <option value="never">No activity recorded</option>
        </select>
        <select
          value={gapFilter}
          onChange={(e) => {
            setGapFilter(e.target.value as GapFilter)
            setActivePreset('custom')
          }}
          className="h-9 rounded-lg border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">Any gap status</option>
          <option value="uncleared">Any uncleared gaps</option>
          <option value="severe">Severe gaps only</option>
          <option value="moderate_plus">Moderate + severe</option>
          <option value="cleared">Gap checks cleared</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Student</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Class</th>
              <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Risk</th>
              <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Level</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Gap Check</th>
              <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Avg</th>
              <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Acts</th>
              <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Inactive</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Weakest</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Recommended next step</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((row) => (
              <tr key={row.studentId} className={row.riskTier === 'urgent' ? 'bg-red-50/40' : 'hover:bg-gray-50/60'}>
                <td className="py-3.5 pr-4">
                  <div className="font-medium text-gray-900">{row.studentName}</div>
                  <div className="text-xs text-gray-400">{row.eldLevel}</div>
                </td>
                <td className="py-3.5 pr-4 text-gray-700">{row.className}</td>
                <td className="py-3.5 pr-4 text-center">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-bold text-gray-900">{row.riskScore}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskStyle[row.riskTier]}`}>
                      {riskLabel[row.riskTier]}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-center">{row.estimatedCurriculumLevel}</td>
                <td className="py-3.5 pr-4">
                  <div className="space-y-1">
                    <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${gapStyle[row.gapSupportTier]}`}>
                      {gapLabel[row.gapSupportTier]}
                    </span>
                    <div className="text-xs text-gray-500">
                      {row.gapScorePercent}% score · {row.gapDimensionsFlagged} flagged
                    </div>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-center">{row.averageScore === null ? '—' : row.averageScore.toFixed(1)}</td>
                <td className="py-3.5 pr-4 text-center">{row.activitiesCompleted}</td>
                <td className="py-3.5 pr-4 text-center">
                  {row.daysSinceLastActivity === null ? 'Never' : `${row.daysSinceLastActivity}d`}
                </td>
                <td className="py-3.5 pr-4">{row.weakestSkill ?? '—'}</td>
                <td className="py-3.5 text-gray-700">{row.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
