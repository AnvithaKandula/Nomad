import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Trip, TripItem, ItineraryEntry, MasterClosetItem, BannerTheme } from '../types'
import { useAuth } from './AuthContext'
import { requireSupabase, isSupabaseConfigured } from '../lib/supabase'

interface TripContextValue {
  trips: Trip[]
  activeTrip: Trip | null
  tripItems: TripItem[]
  itinerary: ItineraryEntry[]
  closet: MasterClosetItem[]
  bannerTheme: BannerTheme
  loading: boolean
  setActiveTripId: (id: string | null) => void
  refreshTrips: () => Promise<void>
  createTrip: (data: Partial<Trip>) => Promise<Trip | null>
  updateTrip: (id: string, data: Partial<Trip>) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
  addClosetItem: (name: string, category: string) => Promise<void>
  updateClosetItem: (id: string, name: string, category: string) => Promise<void>
  deleteClosetItem: (id: string) => Promise<void>
  importClosetToTrip: (tripId: string, itemIds: string[]) => Promise<void>
  togglePacked: (itemId: string, packed: boolean) => Promise<void>
  addTripItem: (tripId: string, name: string, suggested?: boolean) => Promise<void>
  deleteTripItem: (itemId: string) => Promise<void>
  addItineraryEntry: (entry: Omit<ItineraryEntry, 'id' | 'created_at'>) => Promise<void>
  deleteItineraryEntry: (id: string) => Promise<void>
  setBannerTheme: (theme: BannerTheme) => Promise<void>
}

const TripContext = createContext<TripContextValue | null>(null)

const DEMO_STORAGE_KEY = 'nomad-demo-data'

function loadDemoData() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveDemoData(data: Record<string, unknown>) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))
}

export function TripProvider({ children }: { children: ReactNode }) {
  const { user, isGuest } = useAuth()
  const useLocal = isGuest || !isSupabaseConfigured
  const [trips, setTrips] = useState<Trip[]>([])
  const [activeTripId, setActiveTripId] = useState<string | null>(null)
  const [tripItems, setTripItems] = useState<TripItem[]>([])
  const [itinerary, setItinerary] = useState<ItineraryEntry[]>([])
  const [closet, setCloset] = useState<MasterClosetItem[]>([])
  const [bannerTheme, setBannerThemeState] = useState<BannerTheme>('landmark')
  const [loading, setLoading] = useState(true)

  const activeTrip = trips.find((t) => t.id === activeTripId) ?? null

  const refreshTrips = useCallback(async () => {
    if (!user) return

    if (useLocal) {
      const data = loadDemoData()
      setTrips(data.trips ?? [])
      setCloset(data.closet ?? [])
      setBannerThemeState(data.bannerTheme ?? 'landmark')
      if (activeTripId) {
        setTripItems((data.tripItems ?? []).filter((i: TripItem) => i.trip_id === activeTripId))
        setItinerary((data.itinerary ?? []).filter((i: ItineraryEntry) => i.trip_id === activeTripId))
      }
      return
    }

    const db = requireSupabase()
    const [tripsRes, closetRes, settingsRes] = await Promise.all([
      db.from('trips').select('*').order('start_date', { ascending: true }),
      db.from('master_closet').select('*').order('item_name'),
      db.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
    ])

    setTrips(tripsRes.data ?? [])
    setCloset(closetRes.data ?? [])
    if (settingsRes.data) setBannerThemeState(settingsRes.data.banner_theme)

    if (activeTripId) {
      const [itemsRes, itinRes] = await Promise.all([
        db.from('trip_items').select('*').eq('trip_id', activeTripId),
        db.from('itinerary').select('*').eq('trip_id', activeTripId).order('date'),
      ])
      setTripItems(itemsRes.data ?? [])
      setItinerary(itinRes.data ?? [])
    }
  }, [user, activeTripId, useLocal])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    refreshTrips().finally(() => setLoading(false))
  }, [user, refreshTrips])

  useEffect(() => {
    if (activeTripId && user) refreshTrips()
  }, [activeTripId])

  const createTrip = async (data: Partial<Trip>): Promise<Trip | null> => {
    if (!user) return null

    const trip: Trip = {
      id: crypto.randomUUID(),
      user_id: user.id,
      destination_name: data.destination_name!,
      start_date: data.start_date!,
      end_date: data.end_date!,
      lat_long: data.lat_long ?? {},
      image_url: data.image_url ?? null,
      country_code: data.country_code ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (useLocal) {
      const demo = loadDemoData()
      demo.trips = [...(demo.trips ?? []), trip]
      saveDemoData(demo)
      setTrips(demo.trips)
      return trip
    }

    const db = requireSupabase()
    const { data: created, error } = await db.from('trips').insert(trip).select().single()
    if (error) throw error
    await refreshTrips()
    return created
  }

  const updateTrip = async (id: string, data: Partial<Trip>) => {
    if (useLocal) {
      const demo = loadDemoData()
      demo.trips = (demo.trips ?? []).map((t: Trip) =>
        t.id === id ? { ...t, ...data, updated_at: new Date().toISOString() } : t,
      )
      saveDemoData(demo)
      setTrips(demo.trips)
      return
    }
    const db = requireSupabase()
    await db.from('trips').update(data).eq('id', id)
    await refreshTrips()
  }

  const deleteTrip = async (id: string) => {
    if (useLocal) {
      const demo = loadDemoData()
      demo.trips = (demo.trips ?? []).filter((t: Trip) => t.id !== id)
      saveDemoData(demo)
      setTrips(demo.trips)
      if (activeTripId === id) setActiveTripId(null)
      return
    }
    const db = requireSupabase()
    await db.from('trips').delete().eq('id', id)
    if (activeTripId === id) setActiveTripId(null)
    await refreshTrips()
  }

  const addClosetItem = async (name: string, category: string) => {
    if (!user) return
    const item: MasterClosetItem = {
      id: crypto.randomUUID(),
      user_id: user.id,
      item_name: name,
      category: category as MasterClosetItem['category'],
      created_at: new Date().toISOString(),
    }

    if (useLocal) {
      const demo = loadDemoData()
      demo.closet = [...(demo.closet ?? []), item]
      saveDemoData(demo)
      setCloset(demo.closet)
      return
    }
    await requireSupabase().from('master_closet').insert(item)
    await refreshTrips()
  }

  const updateClosetItem = async (id: string, name: string, category: string) => {
    if (useLocal) {
      const demo = loadDemoData()
      demo.closet = (demo.closet ?? []).map((i: MasterClosetItem) =>
        i.id === id ? { ...i, item_name: name, category } : i,
      )
      saveDemoData(demo)
      setCloset(demo.closet)
      return
    }
    await requireSupabase().from('master_closet').update({ item_name: name, category }).eq('id', id)
    await refreshTrips()
  }

  const deleteClosetItem = async (id: string) => {
    if (useLocal) {
      const demo = loadDemoData()
      demo.closet = (demo.closet ?? []).filter((i: MasterClosetItem) => i.id !== id)
      saveDemoData(demo)
      setCloset(demo.closet)
      return
    }
    await requireSupabase().from('master_closet').delete().eq('id', id)
    await refreshTrips()
  }

  const importClosetToTrip = async (tripId: string, itemIds: string[]) => {
    const items = closet.filter((c) => itemIds.includes(c.id))
    const newItems = items.map((c) => ({
      id: crypto.randomUUID(),
      trip_id: tripId,
      item_name: c.item_name,
      is_packed: false,
      is_suggested: false,
      category: c.category,
      created_at: new Date().toISOString(),
    }))

    if (useLocal) {
      const demo = loadDemoData()
      demo.tripItems = [...(demo.tripItems ?? []), ...newItems]
      saveDemoData(demo)
      if (activeTripId === tripId) setTripItems(demo.tripItems.filter((i: TripItem) => i.trip_id === tripId))
      return
    }
    await requireSupabase().from('trip_items').insert(newItems)
    await refreshTrips()
  }

  const togglePacked = async (itemId: string, packed: boolean) => {
    if (useLocal) {
      const demo = loadDemoData()
      demo.tripItems = (demo.tripItems ?? []).map((i: TripItem) =>
        i.id === itemId ? { ...i, is_packed: packed } : i,
      )
      saveDemoData(demo)
      setTripItems(demo.tripItems.filter((i: TripItem) => i.trip_id === activeTripId))
      return
    }
    await requireSupabase().from('trip_items').update({ is_packed: packed }).eq('id', itemId)
    setTripItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, is_packed: packed } : i)))
  }

  const addTripItem = async (tripId: string, name: string, suggested = false) => {
    const item: TripItem = {
      id: crypto.randomUUID(),
      trip_id: tripId,
      item_name: name,
      is_packed: false,
      is_suggested: suggested,
      category: null,
      created_at: new Date().toISOString(),
    }

    if (useLocal) {
      const demo = loadDemoData()
      demo.tripItems = [...(demo.tripItems ?? []), item]
      saveDemoData(demo)
      if (activeTripId === tripId) setTripItems(demo.tripItems.filter((i: TripItem) => i.trip_id === tripId))
      return
    }
    await requireSupabase().from('trip_items').insert(item)
    await refreshTrips()
  }

  const deleteTripItem = async (itemId: string) => {
    if (useLocal) {
      const demo = loadDemoData()
      demo.tripItems = (demo.tripItems ?? []).filter((i: TripItem) => i.id !== itemId)
      saveDemoData(demo)
      setTripItems(demo.tripItems.filter((i: TripItem) => i.trip_id === activeTripId))
      return
    }
    await requireSupabase().from('trip_items').delete().eq('id', itemId)
    setTripItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  const addItineraryEntry = async (entry: Omit<ItineraryEntry, 'id' | 'created_at'>) => {
    const full: ItineraryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }

    if (useLocal) {
      const demo = loadDemoData()
      demo.itinerary = [...(demo.itinerary ?? []), full]
      const cat = entry.category
      const suggestions = getLocalSuggestions(cat)
      for (const name of suggestions) {
        const exists = (demo.tripItems ?? []).some(
          (i: TripItem) => i.trip_id === entry.trip_id && i.item_name.toLowerCase() === name.toLowerCase(),
        )
        if (!exists) {
          demo.tripItems = [
            ...(demo.tripItems ?? []),
            {
              id: crypto.randomUUID(),
              trip_id: entry.trip_id,
              item_name: name,
              is_packed: false,
              is_suggested: true,
              category: cat,
              created_at: new Date().toISOString(),
            },
          ]
        }
      }
      saveDemoData(demo)
      if (activeTripId === entry.trip_id) {
        setItinerary(demo.itinerary.filter((i: ItineraryEntry) => i.trip_id === entry.trip_id))
        setTripItems(demo.tripItems.filter((i: TripItem) => i.trip_id === entry.trip_id))
      }
      return
    }
    await requireSupabase().from('itinerary').insert(full)
    await refreshTrips()
  }

  const deleteItineraryEntry = async (id: string) => {
    if (useLocal) {
      const demo = loadDemoData()
      demo.itinerary = (demo.itinerary ?? []).filter((i: ItineraryEntry) => i.id !== id)
      saveDemoData(demo)
      setItinerary(demo.itinerary.filter((i: ItineraryEntry) => i.trip_id === activeTripId))
      return
    }
    await requireSupabase().from('itinerary').delete().eq('id', id)
    setItinerary((prev) => prev.filter((i) => i.id !== id))
  }

  const setBannerTheme = async (theme: BannerTheme) => {
    setBannerThemeState(theme)
    if (!user) return

    if (useLocal) {
      const demo = loadDemoData()
      demo.bannerTheme = theme
      saveDemoData(demo)
      return
    }

    const db = requireSupabase()
    await db.from('user_settings').upsert(
      { user_id: user.id, banner_theme: theme },
      { onConflict: 'user_id' },
    )
  }

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        tripItems,
        itinerary,
        closet,
        bannerTheme,
        loading,
        setActiveTripId,
        refreshTrips,
        createTrip,
        updateTrip,
        deleteTrip,
        addClosetItem,
        updateClosetItem,
        deleteClosetItem,
        importClosetToTrip,
        togglePacked,
        addTripItem,
        deleteTripItem,
        addItineraryEntry,
        deleteItineraryEntry,
        setBannerTheme,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

function getLocalSuggestions(category: string): string[] {
  const map: Record<string, string[]> = {
    hiking: ['Hiking boots', 'Water bottle', 'Sunscreen', 'Trail snacks', 'Rain jacket'],
    formal: ['Dress shoes', 'Formal outfit', 'Belt', 'Watch'],
    swimming: ['Swimsuit', 'Towel', 'Flip flops', 'Goggles', 'Sunscreen'],
    beach: ['Swimsuit', 'Beach towel', 'Sandals', 'Sun hat', 'Sunglasses'],
    skiing: ['Ski jacket', 'Thermal layers', 'Gloves', 'Goggles', 'Hand warmers'],
    business: ['Laptop', 'Charger', 'Business cards', 'Formal outfit', 'Notebook'],
    dining: ['Nice outfit', 'Reservation confirmation'],
    sightseeing: ['Comfortable shoes', 'Camera', 'Portable charger', 'Water bottle'],
    nightlife: ['Nice outfit', 'ID', 'Portable charger'],
    camping: ['Tent', 'Sleeping bag', 'Flashlight', 'Insect repellent', 'Camp stove'],
  }
  return map[category] ?? []
}

export function useTrips() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrips must be used within TripProvider')
  return ctx
}
