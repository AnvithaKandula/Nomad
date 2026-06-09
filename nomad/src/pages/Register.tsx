import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) setError(error)
    else navigate('/trips')
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-nomad-dark px-6 safe-top safe-bottom">
      <h1 className="mb-8 text-2xl font-bold">Create Account</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Register'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-nomad-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-nomad-teal-light hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
