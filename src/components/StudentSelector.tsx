import { useState, useEffect } from 'react'
import { User, Plus, X, LogOut } from 'lucide-react'
import { soundEffects } from '../utils/soundEffects'
import './StudentSelector.css'

interface StudentProfile {
  id: string
  name: string
  color: string
  createdAt: number
}

interface StudentSelectorProps {
  onSelectStudent: (studentId: string | null) => void
  currentStudentId: string | null
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export function StudentSelector({ onSelectStudent, currentStudentId }: StudentSelectorProps) {
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [showSelector, setShowSelector] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('students')
    if (saved) {
      setStudents(JSON.parse(saved))
    }
  }, [])

  const saveStudents = (updated: StudentProfile[]) => {
    localStorage.setItem('students', JSON.stringify(updated))
    setStudents(updated)
  }

  const handleAddStudent = () => {
    if (!newName.trim()) return
    
    soundEffects.playClick()
    const newStudent: StudentProfile = {
      id: 'student_' + Date.now(),
      name: newName.trim(),
      color: COLORS[students.length % COLORS.length],
      createdAt: Date.now()
    }
    
    const updated = [...students, newStudent]
    saveStudents(updated)
    setNewName('')
    setIsAdding(false)
    onSelectStudent(newStudent.id)
    setShowSelector(false)
  }

  const handleDeleteStudent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    soundEffects.playClick()
    const updated = students.filter(s => s.id !== id)
    saveStudents(updated)
    
    // Also delete their progress
    localStorage.removeItem(`progress_${id}`)
    localStorage.removeItem(`journal_${id}`)
    
    if (currentStudentId === id) {
      onSelectStudent(null)
    }
  }

  const handleSelectStudent = (id: string) => {
    soundEffects.playClick()
    onSelectStudent(id)
    setShowSelector(false)
  }

  const handleLogout = () => {
    soundEffects.playClick()
    onSelectStudent(null)
  }

  const currentStudent = students.find(s => s.id === currentStudentId)

  if (currentStudent) {
    return (
      <div className="student-indicator">
        <div 
          className="student-avatar"
          style={{ backgroundColor: currentStudent.color }}
          onClick={() => setShowSelector(true)}
        >
          {currentStudent.name.charAt(0).toUpperCase()}
        </div>
        <span className="student-name">{currentStudent.name}</span>
        <button className="logout-btn" onClick={handleLogout} title="Cambiar estudiante">
          <LogOut size={16} />
        </button>

        {showSelector && (
          <div className="student-dropdown">
            <div className="dropdown-header">
              <span>Cambiar a:</span>
            </div>
            {students.filter(s => s.id !== currentStudentId).map(student => (
              <button 
                key={student.id}
                className="student-option"
                onClick={() => handleSelectStudent(student.id)}
              >
                <div 
                  className="student-avatar-small"
                  style={{ backgroundColor: student.color }}
                >
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <span>{student.name}</span>
              </button>
            ))}
            <button className="add-student-option" onClick={() => { setIsAdding(true); setShowSelector(false); }}>
              <Plus size={16} />
              <span>Nuevo estudiante</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="student-selector">
      {!isAdding ? (
        <>
          <h3>¿Quién está aprendiendo hoy?</h3>
          <div className="students-grid">
            {students.map(student => (
              <button 
                key={student.id}
                className="student-card"
                onClick={() => handleSelectStudent(student.id)}
              >
                <div 
                  className="student-avatar-large"
                  style={{ backgroundColor: student.color }}
                >
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <span className="student-card-name">{student.name}</span>
                <button 
                  className="delete-student-btn"
                  onClick={(e) => handleDeleteStudent(student.id, e)}
                >
                  <X size={14} />
                </button>
              </button>
            ))}
            <button className="add-student-card" onClick={() => setIsAdding(true)}>
              <Plus size={32} />
              <span>Nuevo estudiante</span>
            </button>
          </div>
        </>
      ) : (
        <div className="add-student-form">
          <h3>Agregar nuevo estudiante</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre del estudiante"
            maxLength={20}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
          />
          <div className="form-buttons">
            <button className="cancel-btn" onClick={() => { setIsAdding(false); setNewName(''); }}>
              Cancelar
            </button>
            <button 
              className="confirm-btn" 
              onClick={handleAddStudent}
              disabled={!newName.trim()}
            >
              Agregar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
