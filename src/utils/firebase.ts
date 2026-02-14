// Firebase configuration and utilities
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Generate a simple student code (e.g., "JUAN2026")
export function generateStudentCode(name: string): string {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${cleanName}${year}${random}`
}

// Save student progress to Firebase
export async function saveProgressToFirebase(studentCode: string, progress: any) {
  if (!firebaseConfig.apiKey) return // Skip if Firebase not configured
  
  try {
    const studentRef = doc(db, 'students', studentCode)
    await setDoc(studentRef, {
      ...progress,
      lastUpdated: new Date().toISOString()
    }, { merge: true })
  } catch (error) {
    console.error('Firebase save error:', error)
  }
}

// Load student progress from Firebase
export async function loadProgressFromFirebase(studentCode: string) {
  if (!firebaseConfig.apiKey) return null
  
  try {
    const studentRef = doc(db, 'students', studentCode)
    const snapshot = await getDoc(studentRef)
    if (snapshot.exists()) {
      return snapshot.data()
    }
    return null
  } catch (error) {
    console.error('Firebase load error:', error)
    return null
  }
}

// Subscribe to real-time updates
export function subscribeToProgress(studentCode: string, callback: (data: any) => void) {
  if (!firebaseConfig.apiKey) return () => {} // No-op if not configured
  
  const studentRef = doc(db, 'students', studentCode)
  return onSnapshot(studentRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data())
    }
  })
}

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey
}
