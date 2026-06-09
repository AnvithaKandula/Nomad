import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { useTrips } from '../contexts/TripContext'
import { WeatherCard } from '../components/trips/WeatherCard'

export function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips, setActiveTripId, activeTrip } = useTrips()

  const trip = trips.find((t) => t.id === id) ?? activeTrip

  useEffect(() => {
    if (id) setActiveTripId(id)
  }, [id, setActiveTripId])

  if (!trip) {
    return (
      <div className="px-4 pt-6 text-center text-nomad-muted">
        Trip not found
      </div>
    )
  }

  return (
    <div className="px-4 pt-4">
      <button
        onClick={() => navigate('/trips')}
        className="mb-4 flex items-center gap-1 text-sm text-nomad-muted hover:text-white"
      >
        <ArrowLeft size={16} /> Back to trips
      </button>

      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <img
          src={trip.image_url ?? `https://source.unsplash.com/featured/800x400/?${trip.destination_name}`}
          alt={trip.destination_name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h1 className="text-2xl font-bold">{trip.destination_name}</h1>
          <p className="flex items-center gap-1 text-sm text-slate-300">
            <Calendar size={14} />
            {format(new Date(trip.start_date), 'MMM d')} – {format(new Date(trip.end_date), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <WeatherCard trip={trip} />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/packing')}
          className="rounded-2xl bg-nomad-surface p-4 text-left hover:bg-slate-700"
        >
          <p className="font-semibold">Packing List</p>
          <p className="text-xs text-nomad-muted">View & manage items</p>
        </button>
        <button
          onClick={() => navigate('/itinerary')}
          className="rounded-2xl bg-nomad-surface p-4 text-left hover:bg-slate-700"
        >
          <p className="font-semibold">Itinerary</p>
          <p className="text-xs text-nomad-muted">Plan activities</p>
        </button>
      </div>
    </div>
  )
}
