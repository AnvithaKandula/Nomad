import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await resetPassword(email)
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f4f4f5] px-6 safe-top safe-bottom">
      <h1 className="mb-2 font-serif text-2xl font-bold">Reset Password</h1>
      <p className="mb-8 text-center text-sm text-gray-500">
        Enter your email and we'll send a reset link
      </p>
      {sent ? (
        <p className="text-center text-black">Check your email for the reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      )}
      <Link to="/login" className="mt-6 text-sm text-gray-600 hover:text-black hover:underline">
        Back to login
      </Link>
    </div>
  )
}
