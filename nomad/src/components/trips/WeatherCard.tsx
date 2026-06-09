import { useEffect, useState } from 'react'
import { Cloud, Loader2, Lightbulb } from 'lucide-react'
import { fetchWeather, getWeatherSuggestions } from '../../lib/weather'
import { WeatherIllustration } from '../../lib/weatherIcons'
import {
  formatPrecipitation,
  getStoredTempUnit,
  storeTempUnit,
  toDisplayTemp,
  type TempUnit,
} from '../../lib/temperature'
import type { Trip } from '../../types'

interface WeatherCardProps {
  trip: Trip
}

export function WeatherCard({ trip }: WeatherCardProps) {
  const [days, setDays] = useState<Awaited<ReturnType<typeof fetchWeather>>>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<TempUnit>(getStoredTempUnit)

  useEffect(() => {
    const lat = trip.lat_long?.lat
    const lng = trip.lat_long?.lng
    if (!lat || !lng) {
      setError('Location coordinates missing')
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
      .catch(() => setError('Could not load forecast'))
      .finally(() => setLoading(false))
  }, [trip])

  const toggleUnit = (next: TempUnit) => {
    setUnit(next)
    storeTempUnit(next)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading weather...</span>
      </div>
    )
  }

  if (error || days.length === 0) {
    return null
  }

  const hasRain = suggestions.some((s) => s.toLowerCase().includes('rain'))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Cloud size={22} className="text-amber-500" strokeWidth={1.75} />
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white md:text-xl">
            Weather Forecast
          </h3>
        </div>
        <div className="flex shrink-0 rounded-full border border-gray-200 bg-gray-100 p-0.5 text-xs font-semibold dark:border-neutral-600 dark:bg-neutral-800">
          <button
            type="button"
            onClick={() => toggleUnit('C')}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              unit === 'C'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => toggleUnit('F')}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              unit === 'F'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 sm:gap-2.5">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex min-w-[5.25rem] shrink-0 flex-col items-center rounded-2xl bg-slate-50 px-3 py-3.5 sm:min-w-[5.75rem] sm:px-3.5 sm:py-4 md:min-w-[6.25rem] md:px-4 dark:bg-neutral-800"
          >
            <p className="mb-2 text-[10px] font-medium tracking-widest text-slate-500 sm:text-[11px] dark:text-gray-400">
              {new Date(day.date + 'T12:00:00')
                .toLocaleDateString('en', { weekday: 'short' })
                .toUpperCase()}
            </p>
            <WeatherIllustration code={day.weatherCode} size={40} />
            <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              {toDisplayTemp(day.tempMax, unit)}°
            </p>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {toDisplayTemp(day.tempMin, unit)}°
            </p>
            {day.precipitation > 0 && (
              <p className="mt-1 text-[10px] font-medium text-sky-600 sm:text-[11px] dark:text-sky-400">
                {formatPrecipitation(day.precipitation, unit)}
              </p>
            )}
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 md:px-4 md:py-3 dark:bg-amber-950/40">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
          <p className="text-sm text-slate-700 dark:text-amber-100 md:text-base">
            {hasRain
              ? "Rain is expected. Don't forget an umbrella and rain jacket!"
              : suggestions[0]}
          </p>
        </div>
      )}
    </div>
  )
}
