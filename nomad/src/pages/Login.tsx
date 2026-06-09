import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function Login() {
  const { signIn, isDemo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error)
    else navigate('/trips')
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-nomad-dark px-6 safe-top safe-bottom">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-nomad-teal/20">
          <Compass className="text-nomad-teal-light" size={32} />
        </div>
        <h1 className="text-3xl font-bold">Nomad</h1>
        <p className="mt-2 text-sm text-nomad-muted">
          Your intelligent travel companion
        </p>
      </div>

      {isDemo && (
        <div className="mb-4 w-full max-w-sm rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-200">
          Demo mode — connect Supabase in Settings to sync data
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm">
        <Link to="/forgot-password" className="text-nomad-teal-light hover:underline">
          Forgot password?
        </Link>
        <p className="text-nomad-muted">
          No account?{' '}
          <Link to="/register" className="text-nomad-teal-light hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
