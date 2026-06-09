import { useEffect, useState } from 'react'
import { Cloud, Sun, CloudRain, Snowflake, Thermometer, Loader2, AlertCircle } from 'lucide-react'
import { fetchWeather, getWeatherSuggestions } from '../../lib/weather'
import type { Trip, WeatherDay } from '../../types'

interface WeatherCardProps {
  trip: Trip
}

function WeatherIcon({ code }: { code: number }) {
  if ([71, 73, 75].includes(code)) return <Snowflake className="text-blue-300" size={20} />
  if ([61, 63, 65, 80, 81, 82, 95].includes(code)) return <CloudRain className="text-blue-400" size={20} />
  if (code <= 2) return <Sun className="text-amber-400" size={20} />
  return <Cloud className="text-slate-400" size={20} />
}

export function WeatherCard({ trip }: WeatherCardProps) {
  const [days, setDays] = useState<WeatherDay[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const lat = trip.lat_long?.lat
    const lng = trip.lat_long?.lng
    if (!lat || !lng) {
      setError('Location coordinates missing — edit trip to set destination')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    fetchWeather(lat, lng, trip.start_date, trip.end_date)
      .then((forecast) => {
        setDays(forecast)
        setSuggestions(getWeatherSuggestions(forecast))
      })
      .catch(() => setError('Could not load forecast. Check your connection and try again.'))
      .finally(() => setLoading(false))
  }, [trip])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-nomad-surface p-6">
        <Loader2 className="h-5 w-5 animate-spin text-nomad-teal-light" />
        <span className="text-sm text-nomad-muted">Loading weather forecast...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 shrink-0 text-amber-400" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-200">Weather unavailable</p>
            <p className="mt-1 text-xs text-amber-200/70">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-2xl bg-nomad-surface p-4">
      <div className="flex items-center gap-2">
        <Thermometer size={18} className="text-nomad-teal-light" />
        <h3 className="font-semibold">Weather Forecast</h3>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <div
            key={day.date}
            className="min-w-[72px] shrink-0 rounded-xl bg-nomad-dark/50 p-3 text-center"
          >
            <p className="text-xs text-nomad-muted">
              {new Date(day.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' })}
            </p>
            <div className="my-1 flex justify-center">
              <WeatherIcon code={day.weatherCode} />
            </div>
            <p className="text-sm font-medium">{day.tempMax}°</p>
            <p className="text-xs text-nomad-muted">{day.tempMin}°</p>
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2 border-t border-slate-700 pt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-nomad-muted">
            Packing suggestions
          </p>
          {suggestions.map((s) => (
            <p key={s} className="text-sm text-slate-300">• {s}</p>
          ))}
        </div>
      )}
    </div>
  )
}
