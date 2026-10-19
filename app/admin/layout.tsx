'use client'
import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getClientSnapshot() {
  return localStorage.getItem('plp_admin_access') === 'granted'
}

function getServerSnapshot() {
  return false
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const storedAuth = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const [localAuth, setLocalAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const isAuthenticated = storedAuth || localAuth

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // THE SECRET PASSCODE (You can change "admin123" to anything you want)
    if (password === 'admin123') {
      localStorage.setItem('plp_admin_access', 'granted')
      setLocalAuth(true)
    } else {
      setError('Incorrect passcode. Access denied.')
      setPassword('')
    }
  }

  // THE LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans text-gray-900">
        <Link href="/" className="mb-8 text-sm font-bold text-gray-400 hover:text-emerald-800 transition tracking-widest uppercase">
          ← Back to Public Site
        </Link>
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md text-center">
          <span className="text-emerald-800 font-bold tracking-widest uppercase text-xs mb-4 block">— Restricted Area</span>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">HQ Command Center</h1>
          <p className="text-gray-500 mb-8 text-sm">Please enter your master passcode to access the database.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Passcode..."
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded focus:bg-white outline-none focus:border-emerald-800 transition text-center tracking-widest text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-emerald-800 text-white font-bold tracking-widest uppercase py-4 rounded hover:bg-emerald-900 transition shadow-sm">
              Unlock System
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 font-bold text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  // IF UNLOCKED, SHOW THE ACTUAL ADMIN PAGES
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}
