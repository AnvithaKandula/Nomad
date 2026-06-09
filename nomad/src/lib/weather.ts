import type { WeatherDay } from '../types'

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
}

export function getWeatherSuggestions(days: WeatherDay[]): string[] {
  const suggestions: string[] = []
  const hasRain = days.some(
    (d) => d.precipitation > 1 || [61, 63, 65, 80, 81, 82, 95].includes(d.weatherCode),
  )
  const hasSnow = days.some((d) => [71, 73, 75].includes(d.weatherCode))
  const avgMax = days.reduce((s, d) => s + d.tempMax, 0) / days.length
  const avgMin = days.reduce((s, d) => s + d.tempMin, 0) / days.length

  if (hasRain) suggestions.push('Rain expected — pack an umbrella and rain jacket')
  if (hasSnow) suggestions.push('Snow forecast — pack warm layers and waterproof boots')
  if (avgMax > 28) suggestions.push('Hot weather — pack sunscreen, hat, and light clothing')
  if (avgMin < 5) suggestions.push('Cold nights — pack a warm jacket and layers')
  if (avgMax > 20 && !hasRain) suggestions.push('Pleasant weather — great for sightseeing')

  return suggestions
}

export async function fetchWeather(
  lat: number,
  lng: number,
  startDate: string,
  endDate: string,
): Promise<WeatherDay[]> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
    timezone: 'auto',
    start_date: startDate,
    end_date: endDate,
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) throw new Error('Weather API request failed')

  const data = await res.json()
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, weathercode } =
    data.daily

  return time.map((date: string, i: number) => ({
    date,
    tempMax: Math.round(temperature_2m_max[i]),
    tempMin: Math.round(temperature_2m_min[i]),
    precipitation: precipitation_sum[i],
    weatherCode: weathercode[i],
    description: WMO_CODES[weathercode[i]] ?? 'Unknown',
  }))
}
