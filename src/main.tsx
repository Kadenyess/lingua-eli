import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import TeacherLogin from './pages/TeacherLogin.tsx'
import TeacherDashboard from './pages/TeacherDashboard.tsx'
import ClassDetailsPage from './pages/ClassDetailsPage.tsx'
import ProtectedRoute from './components/teacher/ProtectedRoute.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import StudentHomeDashboard from './student-ui/StudentHomeDashboard.tsx'
import {
  GrammarDetectiveModePage,
  LogicCheckModePage,
  MyProgressPage,
  PeerReviewModePage,
  SentenceBuilderModePage,
  SentenceExpansionModePage,
  SettingsPage,
  StoryBuilderModePage,
  TimedPracticeModePage,
  VocabularyUnlockModePage,
} from './student-ui/pages/StudentModePages.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        {/* Student-facing learning app (new mode-separated UI) */}
        <Route path="/" element={<StudentHomeDashboard />} />
        <Route path="/modes/sentence-builder" element={<SentenceBuilderModePage />} />
        <Route path="/modes/grammar-detective" element={<GrammarDetectiveModePage />} />
        <Route path="/modes/logic-check" element={<LogicCheckModePage />} />
        <Route path="/modes/sentence-expansion" element={<SentenceExpansionModePage />} />
        <Route path="/modes/story-builder" element={<StoryBuilderModePage />} />
        <Route path="/modes/peer-review" element={<PeerReviewModePage />} />
        <Route path="/modes/vocabulary-unlock" element={<VocabularyUnlockModePage />} />
        <Route path="/modes/timed-practice" element={<TimedPracticeModePage />} />
        <Route path="/progress" element={<MyProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Legacy combined student app preserved during migration */}
        <Route path="/legacy" element={<App />} />

        {/* Teacher dashboard */}
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/class/:classId"
          element={
            <ProtectedRoute>
              <ClassDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
