import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Note: real email-sending backend endpoint is a phase-2 addition.
    setSent(true)
    toast.success('If that email exists, a reset link has been sent.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 via-indigo-500 to-purple-600 p-4">
      <div className="w-full max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold mb-1">Forgot password</h1>
        <p className="text-sm text-gray-500 mb-6">We'll send you a reset link.</p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" required placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
            />
            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-2.5 text-sm font-semibold">
              Send Reset Link
            </button>
          </form>
        ) : (
          <p className="text-sm text-green-600">Check your inbox for the reset link.</p>
        )}

        <p className="text-sm text-center mt-6 text-gray-500">
          <Link to="/login" className="text-brand-600 font-medium hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
