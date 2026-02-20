import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, FlaskConical } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { isFirebaseConfigured } from '../utils/firebase'

export default function TeacherLogin() {
  const { user, loading, error, isDemo, signInWithGoogle, enterDemoMode } = useAuth()
  const navigate = useNavigate()

  // Redirect once authenticated
  useEffect(() => {
    if (!loading && (user || isDemo)) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, isDemo, navigate])

  const firebaseReady = isFirebaseConfigured()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-lg">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Lingua ELI</h1>
          <p className="text-gray-500 mt-1">Teacher Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">
            Sign in with your PVUSD Google account to view your class progress.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Google sign-in */}
          <button
            onClick={signInWithGoogle}
            disabled={!firebaseReady || loading}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-150 mb-3"
          >
            {/* Google G icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8055.54-1.8354.859-3.0477.859-2.344 0-4.3282-1.5836-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5482 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
              <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.891 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1632 6.656 3.5795 9 3.5795z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          {!firebaseReady && (
            <p className="text-xs text-center text-gray-400 mb-3">
              Firebase not configured — use Demo Mode to explore the dashboard.
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Demo mode */}
          <button
            onClick={enterDemoMode}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 font-medium py-3 px-4 rounded-xl transition-colors duration-150 text-sm"
          >
            <FlaskConical size={16} />
            Explore with demo data
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Lingua ELI · PVUSD English Learner Supplemental Practice
        </p>
      </div>
    </div>
  )
}
