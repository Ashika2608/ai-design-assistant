import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { user } = useAuth()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="p-6 md:p-10 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 space-y-3">
        <h2 className="font-semibold">Profile</h2>
        <p className="text-sm text-gray-500">Name: {user?.full_name}</p>
        <p className="text-sm text-gray-500">Email: {user?.email}</p>
        <p className="text-sm text-gray-500">Username: {user?.username}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Dark Mode</h2>
          <p className="text-sm text-gray-500">Toggle light/dark theme</p>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className={`w-12 h-6 rounded-full transition-colors ${dark ? 'bg-brand-600' : 'bg-gray-300'}`}
        >
          <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  )
}
