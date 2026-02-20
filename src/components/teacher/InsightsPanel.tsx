import { Lightbulb, AlertCircle, TrendingUp } from 'lucide-react'
import type { StudentStats, LanguageFunction } from '../../types/teacher'
import { LANGUAGE_FUNCTION_LABELS, ALL_LANGUAGE_FUNCTIONS } from '../../types/teacher'

interface Props {
  studentStats: StudentStats[]
  lfCounts: { fn: LanguageFunction; count: number }[]
}

interface Insight {
  type: 'warning' | 'tip' | 'positive'
  message: string
}

function buildInsights(
  studentStats: StudentStats[],
  lfCounts: { fn: LanguageFunction; count: number }[],
): Insight[] {
  const insights: Insight[] = []

  // ── Struggling students ─────────────────────────────────────────────────
  const struggling = studentStats.filter(
    s => s.averageScore !== null && s.averageScore < 2.0,
  )
  if (struggling.length > 0) {
    insights.push({
      type: 'warning',
      message: `${struggling.length} student${struggling.length > 1 ? 's have' : ' has'} an overall average below 2.0. They may need additional small-group support.`,
    })
  }

  // ── Students with no activity ───────────────────────────────────────────
  const inactive = studentStats.filter(s => s.activitiesCompleted === 0)
  if (inactive.length > 0) {
    insights.push({
      type: 'warning',
      message: `${inactive.length} student${inactive.length > 1 ? 's' : ''} completed no activities this week. Check in to see if they need help getting started.`,
    })
  }

  // ── Skill-specific struggles ────────────────────────────────────────────
  const skills = ['vocabulary', 'reading', 'speaking', 'writing'] as const
  for (const skill of skills) {
    const withData = studentStats.filter(s => s.scoreBySkill[skill] !== undefined)
    if (withData.length === 0) continue
    const avg =
      withData.reduce((sum, s) => sum + (s.scoreBySkill[skill] ?? 0), 0) /
      withData.length
    if (avg < 2.0) {
      insights.push({
        type: 'warning',
        message: `Class average for ${skill} is ${avg.toFixed(1)}. Consider reviewing the sentence frames used in ${skill} activities before the next practice session.`,
      })
    }
  }

  // ── Language function imbalance ─────────────────────────────────────────
  const activeLFs = lfCounts.filter(c => c.count > 0)
  const totalResponses = lfCounts.reduce((s, c) => s + c.count, 0)

  if (activeLFs.length > 0 && totalResponses > 0) {
    const topFn = activeLFs[0]
    const topPct = Math.round((topFn.count / totalResponses) * 100)

    // If more than 50% of responses are from one language function, flag it
    if (topPct >= 50) {
      const unused = ALL_LANGUAGE_FUNCTIONS.filter(
        fn => !activeLFs.some(a => a.fn === fn),
      )
      const unusedLabel =
        unused.length > 0
          ? ` Consider adding activities for ${unused
              .slice(0, 2)
              .map(fn => LANGUAGE_FUNCTION_LABELS[fn])
              .join(' or ')} to match your current unit.`
          : ''
      insights.push({
        type: 'tip',
        message: `${topPct}% of this week's practice has focused on "${LANGUAGE_FUNCTION_LABELS[topFn.fn]}".${unusedLabel}`,
      })
    }
  }

  // ── Positive: high performers ───────────────────────────────────────────
  const highPerformers = studentStats.filter(
    s => s.averageScore !== null && s.averageScore >= 2.8,
  )
  if (highPerformers.length > 0 && studentStats.length > 0) {
    insights.push({
      type: 'positive',
      message: `${highPerformers.length} student${highPerformers.length > 1 ? 's are' : ' is'} averaging 2.8 or higher — great work this week!`,
    })
  }

  // ── Positive: broad language function coverage ──────────────────────────
  if (activeLFs.length >= 4) {
    insights.push({
      type: 'positive',
      message: `Students practiced ${activeLFs.length} different language functions this week — strong curriculum alignment!`,
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: 'tip',
      message: 'No activity recorded yet this week. Once students complete activities, insights will appear here.',
    })
  }

  return insights
}

const ICON_MAP = {
  warning: <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />,
  tip: <Lightbulb size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />,
  positive: <TrendingUp size={16} className="text-green-500 flex-shrink-0 mt-0.5" />,
}

const BG_MAP = {
  warning: 'bg-amber-50 border-amber-100',
  tip: 'bg-blue-50 border-blue-100',
  positive: 'bg-green-50 border-green-100',
}

const TEXT_MAP = {
  warning: 'text-amber-800',
  tip: 'text-blue-800',
  positive: 'text-green-800',
}

export default function InsightsPanel({ studentStats, lfCounts }: Props) {
  const insights = buildInsights(studentStats, lfCounts)

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 p-4 rounded-xl border ${BG_MAP[insight.type]}`}
        >
          {ICON_MAP[insight.type]}
          <p className={`text-sm leading-relaxed ${TEXT_MAP[insight.type]}`}>
            {insight.message}
          </p>
        </div>
      ))}
    </div>
  )
}
