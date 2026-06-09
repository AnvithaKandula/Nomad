import { useEffect, useState } from 'react'
import { Cloud, Loader2, Lightbulb, Droplets } from 'lucide-react'
import { fetchWeather, getWeatherSuggestions } from '../../lib/weather'
import { WeatherIcon, getWeatherIconStyle } from '../../lib/weatherIcons'
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
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Loading weather...</span>
      </div>
    )
  }

  if (error || days.length === 0) {
    return null
  }

  const minTemp = Math.min(...days.map((d) => d.tempMin))
  const maxTemp = Math.max(...days.map((d) => d.tempMax))
  const hasRain = suggestions.some((s) => s.toLowerCase().includes('rain'))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cloud size={20} className="text-sky-500" strokeWidth={2} />
          <h3 className="text-base font-semibold text-black md:text-lg">Weather Forecast</h3>
        </div>
        <div className="text-right text-sm md:text-base">
          <p className="font-semibold text-black">{minTemp}°–{maxTemp}°C</p>
          {hasRain && (
            <p className="flex items-center justify-end gap-1 text-blue-600">
              <Droplets size={14} /> Rain likely
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
        {days.map((day) => {
          const { bgClassName } = getWeatherIconStyle(day.weatherCode)
          return (
            <div
              key={day.date}
              className={`rounded-xl p-2.5 text-center md:p-3 ${bgClassName}`}
            >
              <p className="text-[10px] font-semibold uppercase text-gray-500 md:text-xs">
                {new Date(day.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' })}
              </p>
              <div className="my-1.5 flex justify-center md:my-2">
                <WeatherIcon code={day.weatherCode} size={24} />
              </div>
              <p className="text-sm font-bold text-black md:text-base">{day.tempMax}°</p>
              <p className="text-xs text-gray-500">{day.tempMin}°</p>
            </div>
          )
        })}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2.5 md:px-4 md:py-3">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
          <p className="text-sm text-gray-800 md:text-base">
            {hasRain
              ? "Rain is expected. Don't forget an umbrella and rain jacket!"
              : suggestions[0]}
          </p>
        </div>
      )}
    </div>
  )
}
