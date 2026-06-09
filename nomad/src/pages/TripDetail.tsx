import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Package, CalendarDays } from 'lucide-react'
import { differenceInDays, format, parseISO } from 'date-fns'
import { useTrips } from '../contexts/TripContext'
import { WeatherCard } from '../components/trips/WeatherCard'
import { TripPackingTab } from '../components/trips/TripPackingTab'
import { TripItineraryTab } from '../components/trips/TripItineraryTab'
import { TripForm } from '../components/trips/TripForm'

export function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips, setActiveTripId, activeTrip, bannerTheme, updateTrip } = useTrips()
  const [tab, setTab] = useState<'packing' | 'itinerary'>('packing')
  const [editing, setEditing] = useState(false)

  const trip = trips.find((t) => t.id === id) ?? activeTrip

  useEffect(() => {
    if (id) setActiveTripId(id)
  }, [id, setActiveTripId])

  if (!trip) {
    return <div className="px-4 pt-8 text-center text-gray-500">Trip not found</div>
  }

  const days = differenceInDays(parseISO(trip.end_date), parseISO(trip.start_date)) + 1

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/trips')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => setEditing(!editing)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
        >
          <Pencil size={16} />
        </button>
      </div>

      <h1 className="font-serif text-3xl font-bold text-black">{trip.destination_name}</h1>
      <p className="mb-5 text-sm text-gray-500">
        {format(parseISO(trip.start_date), 'MMM d')} – {format(parseISO(trip.end_date), 'MMM d, yyyy')} · {days} days
      </p>

      {editing && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <TripForm
            initial={trip}
            bannerTheme={bannerTheme}
            onSubmit={async (data) => {
              await updateTrip(trip.id, data)
              setEditing(false)
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}

      <WeatherCard trip={trip} />

      <div className="mt-6 flex rounded-2xl bg-gray-100 p-1">
        <button
          onClick={() => setTab('packing')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors ${
            tab === 'packing' ? 'bg-white text-black shadow-sm' : 'text-gray-500'
          }`}
        >
          <Package size={16} /> Packing
        </button>
        <button
          onClick={() => setTab('itinerary')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors ${
            tab === 'itinerary' ? 'bg-white text-black shadow-sm' : 'text-gray-500'
          }`}
        >
          <CalendarDays size={16} /> Itinerary
        </button>
      </div>

      <div className="mt-4">
        {tab === 'packing' ? <TripPackingTab tripId={trip.id} /> : <TripItineraryTab tripId={trip.id} />}
      </div>
    </div>
  )
}
