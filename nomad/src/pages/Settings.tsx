import { LogOut, Database, Check, Palette } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTrips } from '../contexts/TripContext'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { PageContainer } from '../components/layout/PageContainer'
import { BannerThemeIcon } from '../lib/categoryIcons'
import { isSupabaseConfigured } from '../lib/supabase'
import type { BannerTheme } from '../types'

const themes: { id: BannerTheme; label: string; description: string }[] = [
  { id: 'landmark', label: 'Famous Landmark', description: 'Iconic buildings & monuments' },
  { id: 'flag', label: 'Country Flag', description: 'National flag of destination' },
  { id: 'national_flower', label: 'National Flower', description: 'Floral symbol of the country' },
]

export function Settings() {
  const { signOut, isGuest, user } = useAuth()
  const { bannerTheme, setBannerTheme } = useTrips()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <PageContainer>
      <PageHeader title="Settings" subtitle="Customize your Nomad experience" />

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Palette size={18} className="text-gray-600" strokeWidth={1.75} />
          <h2 className="font-semibold text-black">Trip Banner Style</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Choose what style of image is used for trip banners.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:max-w-3xl">
          {themes.map(({ id, label, description }) => (
            <button
              key={id}
              onClick={() => setBannerTheme(id)}
              className={`relative rounded-2xl border p-4 text-left transition-colors ${
                bannerTheme === id
                  ? 'border-black bg-gray-50 ring-1 ring-black'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {bannerTheme === id && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                  <Check size={12} />
                </span>
              )}
              <BannerThemeIcon
                theme={id}
                className={bannerTheme === id ? 'text-black' : 'text-gray-500'}
              />
              <p className="mt-2 text-sm font-semibold text-black">{label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 shrink-0 text-gray-600" size={20} strokeWidth={1.75} />
          <div>
            <p className="font-medium text-black">Supabase Connection</p>
            <p className="mt-1 text-sm text-gray-500">
              {isGuest
                ? 'Guest mode — sample data stored locally'
                : isSupabaseConfigured
                  ? 'Connected — your data syncs to the cloud'
                  : 'Not configured — using local storage'}
            </p>
            {user && <p className="mt-1 text-xs text-gray-400">{user.email}</p>}
          </div>
        </div>
      </section>

      <Button variant="outline" onClick={handleSignOut} className="w-full">
        <LogOut size={16} className="mr-2 inline" /> Sign Out
      </Button>
    </PageContainer>
  )
}
