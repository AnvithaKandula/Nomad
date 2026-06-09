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
    <div className="flex min-h-dvh bg-[#f4f4f5] safe-top safe-bottom lg:grid lg:grid-cols-2">
      <div className="hidden items-center justify-center border-r border-gray-200 bg-white px-12 lg:flex xl:px-20">
        <div className="max-w-md">
          <Logo size="lg" />
          <p className="mt-8 text-base leading-relaxed text-gray-500">
            Plan trips, pack smarter, and stay ready for wherever you go.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-10 md:px-12 lg:px-16 xl:px-24">
      <div className="mb-8 lg:hidden">
        <Logo size="lg" />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 md:max-w-md">
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <Button variant="outline" onClick={handleGuest} className="mt-4 w-full max-w-sm md:max-w-md">
        Continue as Guest
      </Button>

      <div className="mt-6 space-y-2 text-center text-sm">
        <Link to="/forgot-password" className="text-gray-600 hover:text-black hover:underline">
          Forgot password?
        </Link>
        <p className="text-gray-500">
          No account?{' '}
          <Link to="/register" className="font-medium text-black hover:underline">
            Register
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}
