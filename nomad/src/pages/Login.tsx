import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

export function Login() {
  const { signIn, signInAsGuest } = useAuth()
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

  const handleGuest = () => {
    signInAsGuest()
    navigate('/trips', { replace: true })
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f4f4f5] px-6 safe-top safe-bottom dark:bg-neutral-950">
      <div className="mb-10 w-full max-w-md">
        <Logo size="lg" />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <Button variant="outline" onClick={handleGuest} className="mt-4 w-full max-w-md">
        Continue as Guest
      </Button>

      <div className="mt-6 w-full max-w-md space-y-2 text-center text-sm">
        <Link to="/forgot-password" className="text-gray-600 hover:text-black hover:underline dark:text-gray-400 dark:hover:text-white">
          Forgot password?
        </Link>
        <p className="text-gray-500 dark:text-gray-400">
          No account?{' '}
          <Link to="/register" className="font-medium text-black hover:underline dark:text-white">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
