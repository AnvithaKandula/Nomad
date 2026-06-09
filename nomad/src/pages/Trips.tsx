import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Calendar, MapPin, ChevronRight } from 'lucide-react'
import { differenceInDays, format, isPast, parseISO } from 'date-fns'
import { useTrips } from '../contexts/TripContext'
import { TripForm } from '../components/trips/TripForm'
import { PageHeader } from '../components/ui/PageHeader'
import { fetchLocationImage } from '../lib/geocoding'

function tripStatus(endDate: string) {
  return isPast(parseISO(endDate)) ? 'Completed' : 'Planning'
}

export function Trips() {
  const { trips, bannerTheme, createTrip, updateTrip, setActiveTripId } = useTrips()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingTrip = trips.find((t) => t.id === editingId)

  const openTrip = (id: string) => {
    setActiveTripId(id)
    navigate(`/trips/${id}`)
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-8">
      <PageHeader
        title="Nomad"
        subtitle="Your travel companion"
        action={
          <button
            onClick={() => { setShowForm(true); setEditingId(null) }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105"
          >
            <Plus size={22} />
          </button>
        }
      />

      {(showForm || editingId) && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-serif text-lg font-semibold">{editingId ? 'Edit Trip' : 'New Trip'}</h2>
          <TripForm
            initial={editingTrip}
            bannerTheme={bannerTheme}
            onSubmit={async (data) => {
              if (editingId) {
                await updateTrip(editingId, data)
                setEditingId(null)
              } else {
                const trip = await createTrip(data)
                if (trip) openTrip(trip.id)
              }
              setShowForm(false)
            }}
            onCancel={() => { setShowForm(false); setEditingId(null) }}
          />
        </div>
      )}

      {trips.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <MapPin className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-gray-500">No trips yet. Tap + to create one!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {trips.map((trip) => {
            const days = differenceInDays(parseISO(trip.end_date), parseISO(trip.start_date)) + 1
            const status = tripStatus(trip.end_date)
            return (
              <div
                key={trip.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
              >
                <button onClick={() => openTrip(trip.id)} className="w-full text-left">
                  <div className="relative h-44">
                    <img
                      src={trip.image_url ?? `https://source.unsplash.com/featured/800x400/?${trip.destination_name},travel`}
                      alt={trip.destination_name}
                      className="h-full w-full object-cover grayscale-[20%]"
                      onError={async (e) => {
                        const img = await fetchLocationImage(trip.destination_name, bannerTheme, trip.country_code ?? undefined)
                        ;(e.target as HTMLImageElement).src = img
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                        status === 'Planning'
                          ? 'bg-white/90 text-black'
                          : 'bg-black/70 text-white'
                      }`}
                    >
                      {status}
                    </span>
                    <h3 className="absolute bottom-4 left-4 font-serif text-2xl font-bold text-white">
                      {trip.destination_name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(parseISO(trip.start_date), 'MMM d')} – {format(parseISO(trip.end_date), 'MMM d')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {days} days
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
