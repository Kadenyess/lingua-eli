import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, BookOpen, TrendingUp, Layers, BookOpen as BookIcon, FlaskConical } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useClassDetails } from '../hooks/useClassDetails'
import StudentTable from '../components/teacher/StudentTable'
import LanguageFunctionsBar from '../components/teacher/LanguageFunctionsBar'
import InsightsPanel from '../components/teacher/InsightsPanel'
import { scoreColor, LANGUAGE_FUNCTION_LABELS } from '../types/teacher'

// ── Loading skeletons ─────────────────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-100 rounded w-2/3" />
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  badge,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  badge?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
        {icon}
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {badge && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge}`}>
            {value}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ClassDetailsPage() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const { isDemo } = useAuth()
  const { classData, studentStats, lfCounts, allResponses, loading, error } =
    useClassDetails(classId)

  // ── Computed class-level stats ──────────────────────────────────────────
  const totalActivities = allResponses.length
  const classAvg =
    allResponses.length > 0
      ? allResponses.reduce((s, r) => s + r.score, 0) / allResponses.length
      : null
  const avgDisplay = classAvg !== null ? classAvg.toFixed(1) : '—'
  const avgBadge = scoreColor(classAvg)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            My Classes
          </button>

          <div className="h-4 w-px bg-gray-200" />

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">
              {loading ? 'Loading…' : classData?.name ?? 'Class'}
            </span>
            {classData && (
              <span className="text-xs text-gray-400">· Grade {classData.grade}</span>
            )}
            {isDemo && (
              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                <FlaskConical size={11} />
                Demo
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-5 py-4">
            <strong>Couldn't load class data.</strong> {error}
          </div>
        )}

        {/* ── Quick stats row ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            This week's overview
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Students"
                value={studentStats.length}
                icon={<Users size={13} />}
              />
              <StatCard
                label="Activities done"
                value={totalActivities}
                icon={<BookOpen size={13} />}
              />
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <TrendingUp size={13} />
                  Avg score
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{avgDisplay}</span>
                  {classAvg !== null && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${avgBadge}`}>
                      / 3
                    </span>
                  )}
                </div>
              </div>
              <StatCard
                label="Language functions"
                value={lfCounts.filter(c => c.count > 0).length}
                icon={<Layers size={13} />}
              />
            </div>
          )}
        </section>

        {/* ── Language functions bar ────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Language functions practiced
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Which sentence structures students used this week — aligned with your current unit.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="flex-1 h-3 bg-gray-100 rounded-full" />
                  <div className="h-3 bg-gray-100 rounded w-6" />
                </div>
              ))}
            </div>
          ) : (
            <LanguageFunctionsBar counts={lfCounts} />
          )}

          {/* Sentence frame examples */}
          {!loading && lfCounts.some(c => c.count > 0) && (
            <div className="mt-6 pt-5 border-t border-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Example sentence frames used
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  [
                    { fn: 'describe'    as const, frame: 'The ___ is ___ and ___.' },
                    { fn: 'opinion'     as const, frame: 'I think ___ because ___.' },
                    { fn: 'retell'      as const, frame: 'First, ___. Then, ___. Finally, ___.' },
                    { fn: 'explain'     as const, frame: '___ happens because ___.' },
                    { fn: 'compare'     as const, frame: '___ is similar to ___ because they both ___.' },
                    { fn: 'sequence'    as const, frame: 'First, ___. Next, ___. Then, ___. Last, ___.' },
                    { fn: 'causeEffect' as const, frame: 'Because ___, ___.' },
                  ]
                )
                  .filter(({ fn }) => (lfCounts.find(c => c.fn === fn)?.count ?? 0) > 0)
                  .slice(0, 4)
                  .map(({ fn, frame }) => (
                    <div
                      key={fn}
                      className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <BookIcon size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-indigo-600">
                          {LANGUAGE_FUNCTION_LABELS[fn]}:{' '}
                        </span>
                        <span className="text-xs text-gray-600 italic">{frame}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Student table ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">Student progress</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Individual performance this week. Students sorted by score — those who may need
              extra support appear first.
            </p>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-gray-50 rounded-lg" />
              ))}
            </div>
          ) : studentStats.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No students found for this class.</p>
          ) : (
            <StudentTable students={studentStats} />
          )}
        </section>

        {/* ── Insights panel ────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">Insights</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Quick notes about this week's practice to help you plan next steps.
            </p>
          </div>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-12 bg-gray-50 rounded-xl" />
              <div className="h-12 bg-gray-50 rounded-xl" />
            </div>
          ) : (
            <InsightsPanel studentStats={studentStats} lfCounts={lfCounts} />
          )}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <p className="text-xs text-gray-300 text-center">
          Lingua ELI · PVUSD EL Supplemental Practice Platform
        </p>
      </footer>
    </div>
  )
}
