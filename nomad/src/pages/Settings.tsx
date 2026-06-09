import { Flag, Landmark, Flower2, LogOut, Database } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTrips } from '../contexts/TripContext'
import { Button } from '../components/ui/Button'
import { isSupabaseConfigured } from '../lib/supabase'
import type { BannerTheme } from '../types'

const themes: { id: BannerTheme; label: string; icon: typeof Flag; description: string }[] = [
  { id: 'landmark', label: 'Landmark', icon: Landmark, description: 'Famous sites & cityscapes' },
  { id: 'flag', label: 'Country Flag', icon: Flag, description: 'National flag of destination' },
  { id: 'national_flower', label: 'National Flower', icon: Flower2, description: 'Floral symbol of the country' },
]

export function Settings() {
  const { signOut, isDemo, user } = useAuth()
  const { bannerTheme, setBannerTheme } = useTrips()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-2 text-2xl font-bold">Settings</h1>
      {user && <p className="mb-6 text-sm text-nomad-muted">{user.email}</p>}

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-nomad-muted">
          Banner Theme
        </h2>
        <p className="mb-4 text-sm text-nomad-muted">
          Choose how trip banners display destination imagery
        </p>
        <div className="space-y-2">
          {themes.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setBannerTheme(id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                bannerTheme === id
                  ? 'border-nomad-teal-light bg-nomad-teal/20'
                  : 'border-slate-700 bg-nomad-surface hover:border-slate-600'
              }`}
            >
              <Icon size={22} className="text-nomad-teal-light" />
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-xs text-nomad-muted">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-700 bg-nomad-surface p-4">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 shrink-0 text-nomad-teal-light" size={20} />
          <div>
            <p className="font-medium">Supabase Connection</p>
            <p className="mt-1 text-sm text-nomad-muted">
              {isSupabaseConfigured
                ? 'Connected — your data syncs to the cloud'
                : isDemo
                  ? 'Demo mode — data stored locally in this browser'
                  : 'Not configured'}
            </p>
            {!isSupabaseConfigured && (
              <p className="mt-2 text-xs text-nomad-muted">
                Add <code className="text-nomad-teal-light">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-nomad-teal-light">VITE_SUPABASE_ANON_KEY</code> to a{' '}
                <code className="text-nomad-teal-light">.env</code> file, then restart the dev server.
              </p>
            )}
          </div>
        </div>
      </section>

      <Button variant="danger" onClick={handleSignOut} className="w-full">
        <LogOut size={16} className="mr-2 inline" /> Sign Out
      </Button>
    </div>
  )
}
