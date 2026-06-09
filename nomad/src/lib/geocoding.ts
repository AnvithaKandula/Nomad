import type { BannerTheme, LocationSuggestion } from '../types'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '6',
    addressdetails: '1',
  })

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { 'Accept-Language': 'en' } },
  )
  if (!res.ok) return []

  const data = await res.json()
  return data.map(
    (item: {
      display_name: string
      lat: string
      lon: string
      address?: { country_code?: string }
    }) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      country_code: item.address?.country_code?.toUpperCase() ?? '',
    }),
  )
}

const NATIONAL_FLOWERS: Record<string, string> = {
  US: 'rose',
  GB: 'rose',
  FR: 'iris',
  JP: 'cherry blossom',
  IN: 'lotus',
  AU: 'golden wattle',
  CA: 'maple leaf',
  IT: 'lily',
  ES: 'carnation',
  DE: 'cornflower',
  BR: 'cattleya orchid',
  MX: 'dahlia',
  TH: 'ratchaphruek',
  NL: 'tulip',
  CH: 'edelweiss',
  GR: 'olive branch',
  KR: 'mugunghwa',
  NZ: 'kowhai',
  ZA: 'protea',
  IE: 'shamrock',
}

const FAMOUS_FOODS: Record<string, string> = {
  US: 'hamburger',
  GB: 'fish and chips',
  FR: 'croissant',
  IT: 'pizza',
  ES: 'paella',
  MX: 'tacos',
  JP: 'sushi',
  IN: 'biryani',
  TH: 'pad thai',
  CN: 'dim sum',
  KR: 'kimchi',
  GR: 'gyro',
  TR: 'kebab',
  VN: 'pho',
  BR: 'feijoada',
  CA: 'poutine',
  DE: 'pretzel',
  NL: 'stroopwafel',
  BE: 'waffles',
  PT: 'pastel de nata',
  AR: 'empanadas',
  AU: 'meat pie',
  MA: 'tagine',
  EG: 'koshari',
  IL: 'falafel',
  LB: 'hummus',
  CH: 'fondue',
  AT: 'schnitzel',
  PL: 'pierogi',
  SE: 'meatballs',
  NO: 'salmon',
  IE: 'irish stew',
  NZ: 'pavlova',
  ZA: 'braai',
  SG: 'chili crab',
  MY: 'nasi lemak',
  ID: 'nasi goreng',
  PH: 'adobo',
  CO: 'arepa',
  PE: 'ceviche',
  CL: 'empanada',
  CU: 'cuban sandwich',
  JM: 'jerk chicken',
  HK: 'dim sum',
  TW: 'beef noodle soup',
}

function cityName(destination: string): string {
  return destination.split(',')[0].trim()
}

function fallbackImage(seed: string): string {
  const safe = seed.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase().slice(0, 60)
  return `https://picsum.photos/seed/${safe}/800/400`
}

async function fetchWikipediaImage(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    )
    if (!res.ok) return null
    const wiki = await res.json()
    return wiki.thumbnail?.source ?? wiki.originalimage?.source ?? null
  } catch {
    return null
  }
}

async function fetchUnsplashSearch(query: string): Promise<string | null> {
  if (!UNSPLASH_KEY?.trim()) return null
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.results?.[0]?.urls?.regular ?? null
  } catch {
    return null
  }
}

async function firstAvailableImage(
  seed: string,
  sources: Array<() => Promise<string | null>>,
): Promise<string> {
  for (const source of sources) {
    const url = await source()
    if (url) return url
  }
  return fallbackImage(seed)
}

export async function fetchLocationImage(
  destination: string,
  theme: BannerTheme = 'landmark',
  countryCode?: string,
): Promise<string> {
  const city = cityName(destination)

  if (theme === 'flag' && countryCode) {
    return `https://flagcdn.com/w640/${countryCode.toLowerCase()}.png`
  }

  if (theme === 'national_flower') {
    const flower = countryCode ? (NATIONAL_FLOWERS[countryCode] ?? 'national flower') : 'national flower'
    return firstAvailableImage(`${theme}-${flower}`, [
      () => fetchUnsplashSearch(`${flower} flower`),
      () => fetchWikipediaImage(flower),
    ])
  }

  if (theme === 'local_food') {
    const food = countryCode
      ? (FAMOUS_FOODS[countryCode] ?? `${city} cuisine`)
      : `${city} cuisine`
    return firstAvailableImage(`${theme}-${food}`, [
      () => fetchUnsplashSearch(`${food} food`),
      () => fetchWikipediaImage(food),
    ])
  }

  if (theme === 'cityscape') {
    return firstAvailableImage(`${theme}-${city}`, [
      () => fetchUnsplashSearch(`${city} skyline`),
      () => fetchWikipediaImage(city),
    ])
  }

  if (theme === 'landmark') {
    return firstAvailableImage(`${theme}-${city}`, [
      () => fetchWikipediaImage(city),
      () => fetchUnsplashSearch(`${city} landmark`),
    ])
  }

  return firstAvailableImage(`travel-${destination}`, [
    () => fetchWikipediaImage(city),
    () => fetchUnsplashSearch(`${destination} travel`),
  ])
}
