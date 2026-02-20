import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import TeacherLogin from './pages/TeacherLogin.tsx'
import TeacherDashboard from './pages/TeacherDashboard.tsx'
import ClassDetailsPage from './pages/ClassDetailsPage.tsx'
import ProtectedRoute from './components/teacher/ProtectedRoute.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        {/* Student-facing learning app */}
        <Route path="/" element={<App />} />

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
