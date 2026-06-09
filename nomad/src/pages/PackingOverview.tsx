import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useTrips } from '../contexts/TripContext'
import { PageHeader } from '../components/ui/PageHeader'
import { PageContainer } from '../components/layout/PageContainer'

export function PackingOverview() {
  const { trips, tripItems, setActiveTripId } = useTrips()
  const navigate = useNavigate()

  const openTrip = (id: string) => {
    setActiveTripId(id)
    navigate(`/trips/${id}`)
  }

  return (
    <PageContainer>
      <PageHeader title="Packing" subtitle="Your packing lists at a glance" />

      {trips.length === 0 ? (
        <p className="py-12 text-center text-gray-500">Create a trip to start packing</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5">
          {trips.map((trip) => {
            const items = tripItems.filter((i) => i.trip_id === trip.id)
            const packed = items.filter((i) => i.is_packed).length
            const progress = items.length ? Math.round((packed / items.length) * 100) : 0

            return (
              <button
                key={trip.id}
                onClick={() => openTrip(trip.id)}
                className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-black">{trip.destination_name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {packed}/{items.length} packed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-black">{progress}%</span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-black" style={{ width: `${progress}%` }} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
