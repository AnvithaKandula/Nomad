export type ItemCategory =
  | 'clothing'
  | 'tech'
  | 'toiletry'
  | 'accessory'
  | 'footwear'
  | 'other'

export type ActivityCategory =
  | 'hiking'
  | 'formal'
  | 'swimming'
  | 'beach'
  | 'skiing'
  | 'business'
  | 'dining'
  | 'sightseeing'
  | 'nightlife'
  | 'camping'

export type BannerTheme = 'flag' | 'landmark' | 'national_flower'

export interface Trip {
  id: string
  user_id: string
  destination_name: string
  start_date: string
  end_date: string
  lat_long: { lat?: number; lng?: number; display_name?: string }
  image_url: string | null
  country_code: string | null
  created_at: string
  updated_at: string
}

export interface MasterClosetItem {
  id: string
  user_id: string
  item_name: string
  category: ItemCategory
  created_at: string
}

export interface TripItem {
  id: string
  trip_id: string
  item_name: string
  is_packed: boolean
  is_suggested: boolean
  category: string | null
  created_at: string
}

export interface ItineraryEntry {
  id: string
  trip_id: string
  activity_name: string
  category: string
  date: string
  time: string | null
  booking_url: string | null
  notes: string | null
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  banner_theme: BannerTheme
}

export interface LocationSuggestion {
  display_name: string
  lat: number
  lng: number
  country_code: string
}

export interface WeatherDay {
  date: string
  tempMax: number
  tempMin: number
  precipitation: number
  weatherCode: number
  description: string
}

export interface ActivityOption {
  name: string
  category: ActivityCategory
  description: string
  bookingUrl: string
  popular?: boolean
  placeId?: string
}
