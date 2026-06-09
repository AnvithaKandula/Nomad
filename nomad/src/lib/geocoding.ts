import type { BannerTheme, LocationSuggestion } from '../types'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined
const IMAGE_WIDTH = 1600

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

function upgradeThumbnail(url: string): string {
  return url.replace(/\/\d+px-/, `/${IMAGE_WIDTH}px-`)
}

async function fetchWikipediaImage(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    )
    if (!res.ok) return null
    const wiki = await res.json()
    if (wiki.originalimage?.source) return wiki.originalimage.source
    if (wiki.thumbnail?.source) return upgradeThumbnail(wiki.thumbnail.source)
  } catch {
    // ignore
  }
  return null
}

async function fetchWikimediaImage(search: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${search}`,
      gsrnamespace: '6',
      gsrlimit: '8',
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: String(IMAGE_WIDTH),
    })
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`)
    if (!res.ok) return null
    const data = await res.json()
    const pages = data.query?.pages
    if (!pages) return null

    for (const page of Object.values(pages) as { imageinfo?: { url?: string; thumburl?: string }[] }[]) {
      const info = page.imageinfo?.[0]
      if (info?.url && !info.url.endsWith('.svg')) return info.url
      if (info?.thumburl) return info.thumburl
    }
  } catch {
    // ignore
  }
  return null
}

async function fetchUnsplashSearch(query: string): Promise<string | null> {
  if (!UNSPLASH_KEY?.trim()) return null
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.results?.[0]?.urls?.regular ?? null
  } catch {
    return null
  }
}

async function firstAvailableImage(sources: Array<() => Promise<string | null>>): Promise<string | null> {
  for (const source of sources) {
    const url = await source()
    if (url) return url
  }
  return null
}

async function fallbackTravelImage(): Promise<string> {
  return (
    (await firstAvailableImage([
      () => fetchWikimediaImage('city skyline travel'),
      () => fetchWikipediaImage('Tourism'),
    ])) ?? 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Horseshoe_Bend_2019.jpg/1280px-Horseshoe_Bend_2019.jpg'
  )
}

export async function fetchLocationImage(
  destination: string,
  theme: BannerTheme = 'landmark',
  countryCode?: string,
): Promise<string> {
  const city = cityName(destination)

  if (theme === 'flag' && countryCode) {
    return `https://flagcdn.com/w1280/${countryCode.toLowerCase()}.png`
  }

  if (theme === 'national_flower') {
    const flower = countryCode ? (NATIONAL_FLOWERS[countryCode] ?? 'national flower') : 'national flower'
    return (
      (await firstAvailableImage([
        () => fetchWikimediaImage(`${flower} flower`),
        () => fetchWikipediaImage(flower),
        () => fetchUnsplashSearch(`${flower} flower macro`),
      ])) ?? `https://flagcdn.com/w1280/${(countryCode ?? 'us').toLowerCase()}.png`
    )
  }

  if (theme === 'local_food') {
    const food = countryCode
      ? (FAMOUS_FOODS[countryCode] ?? `${city} cuisine`)
      : `${city} cuisine`
    return (
      (await firstAvailableImage([
        () => fetchWikimediaImage(`${food} dish food`),
        () => fetchWikipediaImage(food),
        () => fetchUnsplashSearch(`${food} traditional food`),
      ])) ?? (await fetchWikipediaImage(city)) ??
      `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1280px-Good_Food_Display_-_NCI_Visuals_Online.jpg`
    )
  }

  if (theme === 'cityscape') {
    return (
      (await firstAvailableImage([
        () => fetchWikimediaImage(`${city} skyline`),
        () => fetchWikimediaImage(`${city} cityscape`),
        () => fetchWikipediaImage(city),
        () => fetchUnsplashSearch(`${city} skyline cityscape`),
      ])) ?? (await fallbackTravelImage())
    )
  }

  if (theme === 'landmark') {
    return (
      (await firstAvailableImage([
        () => fetchWikipediaImage(city),
        () => fetchWikimediaImage(`${city} landmark`),
        () => fetchWikimediaImage(`${city} tourist attraction`),
        () => fetchUnsplashSearch(`${city} famous landmark`),
      ])) ?? (await fallbackTravelImage())
    )
  }

  return (
    (await firstAvailableImage([
      () => fetchWikipediaImage(city),
      () => fetchWikimediaImage(`${destination} travel`),
      () => fetchUnsplashSearch(`${destination} travel`),
    ])) ?? (await fallbackTravelImage())
  )
}
