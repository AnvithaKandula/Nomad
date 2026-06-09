import { LogOut, Database, Check, Palette, Sun, Moon, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTrips } from '../contexts/TripContext'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { PageContainer } from '../components/layout/PageContainer'
import { BannerThemeIcon } from '../lib/categoryIcons'
import { isSupabaseConfigured } from '../lib/supabase'
import type { BannerTheme, ColorMode } from '../types'

const bannerThemes: { id: BannerTheme; label: string; description: string }[] = [
  { id: 'landmark', label: 'Famous Landmark', description: 'Iconic buildings & monuments' },
  { id: 'cityscape', label: 'City Skyline', description: 'Urban skyline & cityscape views' },
  { id: 'local_food', label: 'Local Food', description: 'Signature dish the destination is known for' },
  { id: 'flag', label: 'Country Flag', description: 'National flag of destination' },
  { id: 'national_flower', label: 'National Flower', description: 'Floral symbol of the country' },
]

export function Settings() {
  const { signOut, isGuest, user } = useAuth()
  const { bannerTheme, colorMode, themeApplying, setBannerTheme, setColorMode } = useTrips()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleColorMode = (mode: ColorMode) => {
    setColorMode(mode)
  }

  return (
    <PageContainer>
      <PageHeader title="Settings" subtitle="Customize your Nomad experience" />

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Sun size={18} className="text-gray-600 dark:text-gray-400" strokeWidth={1.75} />
          <h2 className="font-semibold text-black dark:text-white">Appearance</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Choose light or dark mode across the entire app.
        </p>
        <div className="grid max-w-md grid-cols-2 gap-3">
          {(['light', 'dark'] as ColorMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleColorMode(mode)}
              className={`relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                colorMode === mode
                  ? 'border-black bg-gray-50 ring-1 ring-black dark:border-white dark:bg-neutral-800 dark:ring-white'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600'
              }`}
            >
              {colorMode === mode && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                  <Check size={12} />
                </span>
              )}
              {mode === 'light' ? (
                <Sun size={22} className="text-amber-500" />
              ) : (
                <Moon size={22} className="text-indigo-400" />
              )}
              <div>
                <p className="text-sm font-semibold capitalize text-black dark:text-white">{mode} Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {mode === 'light' ? 'Clean white interface' : 'Easy on the eyes at night'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Palette size={18} className="text-gray-600 dark:text-gray-400" strokeWidth={1.75} />
          <h2 className="font-semibold text-black dark:text-white">Trip Banner Style</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Applies to all your trips — each banner image updates when you pick a style.
        </p>
        {themeApplying && (
          <p className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Loader2 size={14} className="animate-spin" />
            Updating all trip banners...
          </p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-3xl">
          {bannerThemes.map(({ id, label, description }) => (
            <button
              key={id}
              onClick={() => setBannerTheme(id)}
              disabled={themeApplying}
              className={`relative rounded-2xl border p-4 text-left transition-colors disabled:opacity-60 ${
                bannerTheme === id
                  ? 'border-black bg-gray-50 ring-1 ring-black dark:border-white dark:bg-neutral-800 dark:ring-white'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600'
              }`}
            >
              {bannerTheme === id && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                  <Check size={12} />
                </span>
              )}
              <BannerThemeIcon
                theme={id}
                className={bannerTheme === id ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}
              />
              <p className="mt-2 text-sm font-semibold text-black dark:text-white">{label}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 shrink-0 text-gray-600 dark:text-gray-400" size={20} strokeWidth={1.75} />
          <div>
            <p className="font-medium text-black dark:text-white">Supabase Connection</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
