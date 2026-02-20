import { useNavigate } from 'react-router-dom'
import { BookOpen, LogOut, FlaskConical } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTeacherClasses } from '../hooks/useTeacherClasses'
import ClassCard from '../components/teacher/ClassCard'

// ── Skeleton card for loading state ──────────────────────────────────────
function ClassCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/4 mb-6" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
      <div className="space-y-2 bg-gray-50 rounded-xl p-4 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="h-10 bg-gray-100 rounded-xl" />
    </div>
  )
}

export default function TeacherDashboard() {
  const { user, isDemo, signOutUser, teacherUid } = useAuth()
  const { teacher, classes, loading, error } = useTeacherClasses(teacherUid)
  const navigate = useNavigate()

  const teacherName = teacher?.name ?? user?.displayName ?? 'Teacher'

  const handleSignOut = async () => {
    await signOutUser()
    navigate('/teacher-login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Lingua ELI</span>
            {isDemo && (
              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                <FlaskConical size={11} />
                Demo
              </span>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi, {teacherName} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            Here's how your Lingua ELI classes are doing this week.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-5 py-4 mb-8">
            <strong>Couldn't load your classes.</strong> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div>
            <p className="text-sm text-gray-400 mb-5">Loading your classes…</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ClassCardSkeleton />
              <ClassCardSkeleton />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && classes.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No classes yet</h3>
            <p className="text-sm text-gray-500">
              Ask your Lingua ELI administrator to add your classes, or use Demo Mode to explore.
            </p>
          </div>
        )}

        {/* Class grid */}
        {!loading && classes.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-5">
              {classes.length} class{classes.length > 1 ? 'es' : ''} · last 7 days
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map(stats => (
                <ClassCard key={stats.classData.id} stats={stats} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 mt-8">
        <p className="text-xs text-gray-300 text-center">
          Lingua ELI · PVUSD EL Supplemental Practice Platform
        </p>
      </footer>
    </div>
  )
}
