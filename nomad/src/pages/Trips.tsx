import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MapPin, Calendar, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useTrips } from '../contexts/TripContext'
import { TripForm } from '../components/trips/TripForm'
import { Button } from '../components/ui/Button'
import { fetchLocationImage } from '../lib/geocoding'

export function Trips() {
  const { trips, bannerTheme, createTrip, updateTrip, deleteTrip, setActiveTripId } = useTrips()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingTrip = trips.find((t) => t.id === editingId)

  const openTrip = (id: string) => {
    setActiveTripId(id)
    navigate(`/trips/${id}`)
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Trips</h1>
          <p className="text-sm text-nomad-muted">Plan your next adventure</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null) }}>
          <Plus size={18} className="mr-1 inline" /> New
        </Button>
      </div>

      {(showForm || editingId) && (
        <div className="mb-6 rounded-2xl border border-slate-700 bg-nomad-surface p-4">
          <h2 className="mb-4 font-semibold">{editingId ? 'Edit Trip' : 'New Trip'}</h2>
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
        <div className="rounded-2xl border border-dashed border-slate-600 p-12 text-center">
          <MapPin className="mx-auto mb-3 text-nomad-muted" size={40} />
          <p className="text-nomad-muted">No trips yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="overflow-hidden rounded-2xl border border-slate-700 bg-nomad-surface"
            >
              <button onClick={() => openTrip(trip.id)} className="w-full text-left">
                <div className="relative h-36">
                  <img
                    src={trip.image_url ?? `https://source.unsplash.com/featured/800x400/?${trip.destination_name},travel`}
                    alt={trip.destination_name}
                    className="h-full w-full object-cover"
                    onError={async (e) => {
                      const img = await fetchLocationImage(trip.destination_name, bannerTheme, trip.country_code ?? undefined)
                      ;(e.target as HTMLImageElement).src = img
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-lg font-bold">{trip.destination_name}</h3>
                    <p className="flex items-center gap-1 text-xs text-slate-300">
                      <Calendar size={12} />
                      {format(new Date(trip.start_date), 'MMM d')} – {format(new Date(trip.end_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </button>
              <div className="flex gap-2 border-t border-slate-700 p-3">
                <button
                  onClick={() => { setEditingId(trip.id); setShowForm(false) }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-sm text-nomad-muted hover:bg-slate-700"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => { if (confirm('Delete this trip?')) deleteTrip(trip.id) }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
