import type { LanguageFunction } from '../../types/teacher'
import { LANGUAGE_FUNCTION_LABELS, LF_COLORS } from '../../types/teacher'

interface Props {
  counts: { fn: LanguageFunction; count: number }[]
  /** Show only functions that have at least 1 response, unless showAll is true */
  showAll?: boolean
}

export default function LanguageFunctionsBar({ counts, showAll = false }: Props) {
  const data = showAll ? counts : counts.filter(c => c.count > 0)
  const maxCount = Math.max(...data.map(c => c.count), 1)

  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No language function data for this week yet.
      </p>
    )
  }

  return (
    <div className="space-y-2.5">
      {data.map(({ fn, count }) => {
        const pct = Math.round((count / maxCount) * 100)
        return (
          <div key={fn} className="flex items-center gap-3">
            {/* Label */}
            <span className="text-sm text-gray-600 w-28 flex-shrink-0">
              {LANGUAGE_FUNCTION_LABELS[fn]}
            </span>

            {/* Bar */}
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${LF_COLORS[fn]}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Count */}
            <span className="text-sm font-semibold text-gray-700 w-8 text-right">
              {count}
            </span>
          </div>
        )
      })}

      <p className="text-xs text-gray-400 pt-1">
        Numbers show student responses tied to each language function this week.
      </p>
    </div>
  )
}
