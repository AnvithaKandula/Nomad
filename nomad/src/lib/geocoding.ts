import type { LocationSuggestion } from '../types'

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

export async function fetchLocationImage(
  destination: string,
  theme: 'landmark' | 'flag' | 'national_flower' = 'landmark',
  countryCode?: string,
): Promise<string> {
  if (theme === 'flag' && countryCode) {
    return `https://flagcdn.com/w640/${countryCode.toLowerCase()}.png`
  }

  if (theme === 'national_flower' && countryCode) {
    const flower = NATIONAL_FLOWERS[countryCode] ?? 'national flower'
    return `https://source.unsplash.com/featured/800x400/?${encodeURIComponent(flower)}`
  }

  try {
    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination.split(',')[0].trim())}`,
    )
    if (wikiRes.ok) {
      const wiki = await wikiRes.json()
      if (wiki.thumbnail?.source) return wiki.thumbnail.source
      if (wiki.originalimage?.source) return wiki.originalimage.source
    }
  } catch {
    // fall through to unsplash
  }

  return `https://source.unsplash.com/featured/800x400/?${encodeURIComponent(destination)},landmark,travel`
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
