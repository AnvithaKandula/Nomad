import { useEffect, useState } from 'react'
import { Cloud, Sun, CloudRain, Snowflake, CloudSun, Loader2, Lightbulb } from 'lucide-react'
import { fetchWeather, getWeatherSuggestions } from '../../lib/weather'
import type { Trip, WeatherDay } from '../../types'

interface WeatherCardProps {
  trip: Trip
}

function WeatherIcon({ code }: { code: number }) {
  if ([71, 73, 75].includes(code)) return <Snowflake className="text-gray-600" size={20} />
  if ([61, 63, 65, 80, 81, 82, 95].includes(code)) return <CloudRain className="text-gray-600" size={20} />
  if (code <= 2) return <Sun className="text-gray-700" size={20} />
  return <CloudSun className="text-gray-500" size={20} />
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

  const minTemp = Math.min(...days.map((d) => d.tempMin))
  const maxTemp = Math.max(...days.map((d) => d.tempMax))
  const hasRain = suggestions.some((s) => s.toLowerCase().includes('rain'))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud size={18} className="text-gray-600" />
          <h3 className="font-semibold text-black">Weather Forecast</h3>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium">{minTemp}°–{maxTemp}°C</p>
          {hasRain && <p className="text-gray-500">Rain likely</p>}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <div
            key={day.date}
            className="min-w-[64px] shrink-0 rounded-xl bg-gray-50 p-2.5 text-center"
          >
            <p className="text-[10px] font-medium uppercase text-gray-500">
              {new Date(day.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' })}
            </p>
            <div className="my-1 flex justify-center">
              <WeatherIcon code={day.weatherCode} />
            </div>
            <p className="text-sm font-semibold">{day.tempMax}°</p>
            <p className="text-xs text-gray-400">{day.tempMin}°</p>
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-100 px-3 py-2.5">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-gray-600" />
          <p className="text-sm text-gray-700">
            {hasRain
              ? "Rain is expected. Don't forget an umbrella and rain jacket!"
              : suggestions[0]}
          </p>
        </div>
      )}
    </div>
  )
}
