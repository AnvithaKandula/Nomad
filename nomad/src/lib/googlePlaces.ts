import type { ActivityCategory, ActivityOption } from '../types'
import { searchActivities } from './activities'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined

export function isGooglePlacesConfigured(): boolean {
  return Boolean(API_KEY?.trim())
}

function mapTypesToCategory(types: string[]): ActivityCategory {
  const t = types.map((x) => x.toLowerCase())

  if (t.some((x) => ['night_club', 'bar', 'wine_bar', 'pub'].includes(x))) return 'nightlife'
  if (t.some((x) => ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'food'].includes(x))) return 'dining'
  if (t.some((x) => ['campground', 'rv_park'].includes(x))) return 'camping'
  if (t.some((x) => ['beach'].includes(x))) return 'beach'
  if (t.some((x) => ['swimming_pool', 'aquarium'].includes(x))) return 'swimming'
  if (t.some((x) => ['ski_resort'].includes(x))) return 'skiing'
  if (t.some((x) => ['park', 'hiking_area', 'national_park'].includes(x))) return 'hiking'
  if (t.some((x) => ['spa', 'beauty_salon'].includes(x))) return 'formal'
  if (t.some((x) => ['convention_center', 'corporate_office'].includes(x))) return 'business'
  if (t.some((x) => ['museum', 'art_gallery', 'tourist_attraction', 'church', 'historical_landmark', 'amusement_park', 'zoo'].includes(x))) {
    return 'sightseeing'
  }

  return 'sightseeing'
}

function buildTextQuery(query: string, destination?: string): string {
  const trimmed = query.trim()
  if (destination) {
    return trimmed ? `${trimmed} in ${destination}` : `things to do in ${destination}`
  }
  return trimmed || 'popular tourist attractions'
}

interface GooglePlace {
  id?: string
  displayName?: { text?: string }
  formattedAddress?: string
  googleMapsUri?: string
  types?: string[]
  editorialSummary?: { text?: string }
  rating?: number
}

export async function searchGooglePlaces(query: string, destination?: string): Promise<ActivityOption[]> {
  if (!isGooglePlacesConfigured()) {
    return searchActivities(query, destination)
  }

  const textQuery = buildTextQuery(query, destination)

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY!,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.types,places.editorialSummary,places.rating',
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: 15,
      languageCode: 'en',
    }),
  })

  if (!res.ok) {
    throw new Error(`Google Places request failed (${res.status})`)
  }

  const data = (await res.json()) as { places?: GooglePlace[] }
  const places = data.places ?? []

  if (places.length === 0) {
    return searchActivities(query, destination)
  }

  return places.map((place) => {
    const name = place.displayName?.text ?? 'Activity'
    const types = place.types ?? []
    const category = mapTypesToCategory(types)
    const address = place.formattedAddress ?? ''
    const summary = place.editorialSummary?.text
    const rating = place.rating ? ` · ${place.rating}★` : ''
    const description = summary ?? (address ? `${address}${rating}` : `Found on Google Maps${rating}`)

    const bookingUrl =
      place.googleMapsUri ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + (destination ? ` ${destination}` : ''))}`

    return {
      name,
      category,
      description,
      bookingUrl,
      placeId: place.id,
    }
  })
}
