import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleAuth(e: FormEvent, mode: 'login' | 'signup') {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') await signIn(email, password)
      else await signUp(email, password)
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login / Sign Up</h1>
      <form className="space-y-3" onSubmit={(e) => handleAuth(e, 'login')}>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <button
        className="w-full mt-3 bg-gray-200 py-2 rounded"
        onClick={(e) => handleAuth(e as unknown as FormEvent, 'signup')}
        disabled={loading}
      >
        Create Account
      </button>
    </div>
  )
}


