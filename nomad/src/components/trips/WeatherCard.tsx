import { useEffect, useState } from 'react'
import { Cloud, Loader2, Lightbulb } from 'lucide-react'
import { fetchWeather, getWeatherSuggestions } from '../../lib/weather'
import { WeatherIllustration } from '../../lib/weatherIcons'
import type { Trip } from '../../types'

interface WeatherCardProps {
  trip: Trip
}

export function WeatherCard({ trip }: WeatherCardProps) {
  const [days, setDays] = useState<Awaited<ReturnType<typeof fetchWeather>>>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-6">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Loading weather...</span>
      </div>
    )
  }

  if (error || days.length === 0) {
    return null
  }

  const hasRain = suggestions.some((s) => s.toLowerCase().includes('rain'))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <Cloud size={22} className="text-amber-500" strokeWidth={1.75} />
        <h3 className="font-serif text-lg font-bold text-slate-900 md:text-xl">Weather Forecast</h3>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 sm:gap-2.5">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex min-w-[5.25rem] shrink-0 flex-col items-center rounded-2xl bg-slate-50 px-3 py-3.5 sm:min-w-[5.75rem] sm:px-3.5 sm:py-4 md:min-w-[6.25rem] md:px-4"
          >
            <p className="mb-2 text-[10px] font-medium tracking-widest text-slate-500 sm:text-[11px]">
              {new Date(day.date + 'T12:00:00')
                .toLocaleDateString('en', { weekday: 'short' })
                .toUpperCase()}
            </p>
            <WeatherIllustration code={day.weatherCode} size={36} />
            <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">{day.tempMax}°</p>
            <p className="text-sm text-slate-500">{day.tempMin}°</p>
            {day.precipitation > 0 && (
              <p className="mt-1 text-[10px] font-medium text-sky-600 sm:text-[11px]">
                {Math.round(day.precipitation)}mm
              </p>
            )}
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 md:px-4 md:py-3">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
          <p className="text-sm text-slate-700 md:text-base">
            {hasRain
              ? "Rain is expected. Don't forget an umbrella and rain jacket!"
              : suggestions[0]}
          </p>
        </div>
      )}
    </div>
  )
}
