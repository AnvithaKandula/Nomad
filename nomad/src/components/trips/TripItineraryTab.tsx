import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Trash2, Wand2, Search, Plus, Camera, Utensils, MapPin, Mountain, Pencil, ExternalLink, StickyNote } from 'lucide-react'
import { useTrips } from '../../contexts/TripContext'
import { ActivitySearch } from '../itinerary/ActivitySearch'
import { ItineraryQuiz } from '../itinerary/ItineraryQuiz'
import { AddActivityModal } from '../itinerary/AddActivityModal'
import { EditItineraryModal } from '../itinerary/EditItineraryModal'
import { Button } from '../ui/Button'
import type { ActivityOption, ItineraryEntry } from '../../types'

const categoryIcons: Record<string, typeof Camera> = {
  sightseeing: Camera,
  formal: Utensils,
  dining: Utensils,
  hiking: Mountain,
  default: MapPin,
}

interface TripItineraryTabProps {
  tripId: string
}

export function TripItineraryTab({ tripId }: TripItineraryTabProps) {
  const { trips, itinerary, addItineraryEntry, updateItineraryEntry, deleteItineraryEntry } = useTrips()
  const [discover, setDiscover] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [pendingActivity, setPendingActivity] = useState<ActivityOption | null>(null)
  const [editingEntry, setEditingEntry] = useState<ItineraryEntry | null>(null)
  const trip = trips.find((t) => t.id === tripId)
  const entries = itinerary.filter((i) => i.trip_id === tripId)

  const grouped = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
    ;(acc[entry.date] ??= []).push(entry)
    return acc
  }, {})

  const confirmAddActivity = async (details: { date: string; time: string; booking_url: string | null }) => {
    if (!trip || !pendingActivity) return
    await addItineraryEntry({
      trip_id: tripId,
      activity_name: pendingActivity.name,
      category: pendingActivity.category,
      date: details.date,
      time: details.time,
      booking_url: details.booking_url,
      notes: null,
    })
    setPendingActivity(null)
    setDiscover(false)
  }

  const handleQuizComplete = async (
    items: { activity_name: string; category: string; date: string; time: string }[],
  ) => {
    for (const entry of entries) {
      await deleteItineraryEntry(entry.id)
    }
    for (const item of items) {
      await addItineraryEntry({
        trip_id: tripId,
        activity_name: item.activity_name,
        category: item.category,
        date: item.date,
        time: item.time,
        booking_url: null,
        notes: null,
      })
    }
  }

  if (discover && trip) {
    return (
      <>
        <AddActivityModal
          open={!!pendingActivity}
          activity={pendingActivity}
          startDate={trip.start_date}
          endDate={trip.end_date}
          onClose={() => setPendingActivity(null)}
          onConfirm={confirmAddActivity}
        />
        <div className="space-y-4">
          <button onClick={() => setDiscover(false)} className="text-sm text-gray-500 hover:text-black">
            ← Back to schedule
          </button>
          <ActivitySearch destination={trip.destination_name} onSelect={(activity) => setPendingActivity(activity)} />
        </div>
      </>
    )
  }

  return (
    <div>
      {trip && (
        <>
          <ItineraryQuiz
            open={quizOpen}
            onClose={() => setQuizOpen(false)}
            startDate={trip.start_date}
            endDate={trip.end_date}
            destination={trip.destination_name}
            onComplete={handleQuizComplete}
          />
          <EditItineraryModal
            open={!!editingEntry}
            entry={editingEntry}
            startDate={trip.start_date}
            endDate={trip.end_date}
            onClose={() => setEditingEntry(null)}
            onSave={async (updates) => {
              if (editingEntry) await updateItineraryEntry(editingEntry.id, updates)
            }}
          />
        </>
      )}

      <div className="mb-4 flex justify-end gap-2">
        <Button variant="secondary" className="!px-3 !py-2 text-xs" onClick={() => setQuizOpen(true)}>
          <Wand2 size={14} className="mr-1 inline" /> Auto Plan
        </Button>
        <Button variant="secondary" className="!px-3 !py-2 text-xs" onClick={() => setDiscover(true)}>
          <Search size={14} className="mr-1 inline" /> Discover
        </Button>
        <Button className="!px-3 !py-2 text-xs" onClick={() => setDiscover(true)}>
          <Plus size={14} className="mr-1 inline" /> Add
        </Button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-gray-500">No activities yet.</p>
          <Button variant="secondary" className="mt-4" onClick={() => setQuizOpen(true)}>
            <Wand2 size={14} className="mr-1.5 inline" /> Auto Plan My Trip
          </Button>
        </div>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, dayEntries]) => (
            <div key={date} className="mb-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                {format(parseISO(date), 'EEEE, MMMM d')}
              </h3>
              <div className="space-y-0">
                {[...dayEntries]
                  .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))
                  .map((entry, idx, sorted) => {
                    const Icon = categoryIcons[entry.category] ?? categoryIcons.default
                    return (
                      <div key={entry.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white">
                            <Icon size={14} className="text-gray-600" />
                          </div>
                          {idx < sorted.length - 1 && <div className="w-px flex-1 bg-gray-200" />}
                        </div>
                        <div className="mb-4 flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-black">{entry.activity_name}</p>
                              <p className="mt-1 text-xs text-gray-500">
                                {entry.time?.slice(0, 5)} · <span className="capitalize">{entry.category.replace('_', ' ')}</span>
                              </p>
                              {entry.notes && (
                                <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-600">
                                  <StickyNote size={14} className="mt-0.5 shrink-0 text-gray-400" />
                                  <span className="whitespace-pre-wrap">{entry.notes}</span>
                                </p>
                              )}
                              {entry.booking_url && (
                                <a
                                  href={entry.booking_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-black hover:underline"
                                >
                                  Booking link <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <button
                                onClick={() => setEditingEntry(entry)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => deleteItineraryEntry(entry.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          ))
      )}
    </div>
  )
}
