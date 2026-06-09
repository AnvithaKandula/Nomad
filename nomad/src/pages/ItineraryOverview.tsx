import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useTrips } from '../contexts/TripContext'
import { PageHeader } from '../components/ui/PageHeader'

const activityEmojis: Record<string, string> = {
  sightseeing: '🏰',
  formal: '🎩',
  dining: '🍽️',
  hiking: '🥾',
  beach: '🏖️',
  swimming: '🏊',
  default: '📌',
}

export function ItineraryOverview() {
  const { trips, itinerary, setActiveTripId } = useTrips()
  const navigate = useNavigate()

  const openTrip = (id: string) => {
    setActiveTripId(id)
    navigate(`/trips/${id}`)
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-8">
      <PageHeader title="Itinerary" subtitle="Upcoming activities across all trips" />

      {trips.length === 0 ? (
        <p className="py-12 text-center text-gray-500">Create a trip to plan your itinerary</p>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => {
            const activities = itinerary.filter((i) => i.trip_id === trip.id)
            const preview = activities.slice(0, 5)
            const more = activities.length - preview.length

            return (
              <button
                key={trip.id}
                onClick={() => openTrip(trip.id)}
                className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-black">{trip.destination_name}</p>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {preview.map((a) => (
                    <span
                      key={a.id}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                    >
                      {activityEmojis[a.category] ?? activityEmojis.default} {a.activity_name}
                    </span>
                  ))}
                  {more > 0 && (
                    <span className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-400">
                      +{more} more
                    </span>
                  )}
                  {activities.length === 0 && (
                    <span className="text-xs text-gray-400">No activities yet</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
