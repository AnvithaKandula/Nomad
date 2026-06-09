import type { BannerTheme, LocationSuggestion } from '../types'

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

function unsplashUrl(query: string): string {
  return `https://source.unsplash.com/featured/800x400/?${encodeURIComponent(query)}`
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
    return unsplashUrl(`${flower},flower`)
  }

  if (theme === 'local_food') {
    const food = countryCode
      ? (FAMOUS_FOODS[countryCode] ?? `${city} famous food`)
      : `${city} famous food`
    return unsplashUrl(`${food},food,cuisine`)
  }

  if (theme === 'cityscape') {
    return unsplashUrl(`${city},skyline,cityscape`)
  }

  if (theme === 'landmark') {
    try {
      const wikiRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`,
      )
      if (wikiRes.ok) {
        const wiki = await wikiRes.json()
        if (wiki.thumbnail?.source) return wiki.thumbnail.source
        if (wiki.originalimage?.source) return wiki.originalimage.source
      }
    } catch {
      // fall through
    }
    return unsplashUrl(`${city},landmark,travel`)
  }

  return unsplashUrl(`${destination},travel`)
}
