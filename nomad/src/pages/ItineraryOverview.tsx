import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Trash2, ExternalLink, Flame } from 'lucide-react'
import { useTrips } from '../contexts/TripContext'
import { ActivitySearch } from '../components/itinerary/ActivitySearch'
import { ItineraryQuiz } from '../components/itinerary/ItineraryQuiz'
import { getPopularActivities } from '../lib/activities'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import type { ActivityOption } from '../types'

export function ItineraryOverview() {
  const { trips, activeTrip, itinerary, setActiveTripId, addItineraryEntry, deleteItineraryEntry } = useTrips()
  const [tab, setTab] = useState<'list' | 'discover'>('list')
  const [manualName, setManualName] = useState('')
  const [manualCategory, setManualCategory] = useState('sightseeing')
  const [manualDate, setManualDate] = useState('')
  const [manualTime, setManualTime] = useState('10:00')

  const popular = getPopularActivities()

  if (!activeTrip && trips.length > 0) {
    return (
      <div className="px-4 pt-6">
        <h1 className="mb-4 text-2xl font-bold">Itinerary</h1>
        <p className="mb-4 text-sm text-nomad-muted">Select a trip:</p>
        <div className="space-y-2">
          {trips.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTripId(t.id)}
              className="w-full rounded-xl border border-slate-700 bg-nomad-surface p-4 text-left"
            >
              {t.destination_name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (!activeTrip) {
    return (
      <div className="px-4 pt-20 text-center text-nomad-muted">
        Create a trip to plan your itinerary
      </div>
    )
  }

  const addActivity = async (activity: ActivityOption) => {
    await addItineraryEntry({
      trip_id: activeTrip.id,
      activity_name: activity.name,
      category: activity.category,
      date: manualDate || activeTrip.start_date,
      time: manualTime,
      booking_url: activity.bookingUrl,
    })
  }

  const grouped = itinerary.reduce<Record<string, typeof itinerary>>((acc, entry) => {
    ;(acc[entry.date] ??= []).push(entry)
    return acc
  }, {})

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold">Itinerary</h1>
      <p className="mb-4 text-sm text-nomad-muted">{activeTrip.destination_name}</p>

      <div className="mb-4 flex rounded-xl bg-nomad-surface p-1">
        {(['list', 'discover'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize ${
              tab === t ? 'bg-nomad-teal text-white' : 'text-nomad-muted'
            }`}
          >
            {t === 'list' ? 'My Schedule' : 'Discover'}
          </button>
        ))}
      </div>

      {tab === 'list' ? (
        <div className="space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <p className="py-8 text-center text-sm text-nomad-muted">
              No activities planned. Use Discover to add some!
            </p>
          ) : (
            Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, entries]) => (
                <div key={date}>
                  <h3 className="mb-2 text-sm font-semibold text-nomad-teal-light">
                    {format(parseISO(date), 'EEEE, MMM d')}
                  </h3>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-700 bg-nomad-surface p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{entry.activity_name}</p>
                          <p className="text-xs capitalize text-nomad-muted">
                            {entry.category} {entry.time && `· ${entry.time.slice(0, 5)}`}
                          </p>
                        </div>
                        {entry.booking_url && (
                          <a
                            href={entry.booking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-nomad-teal-light"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => deleteItineraryEntry(entry.id)}
                          className="text-nomad-muted hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <ItineraryQuiz
            startDate={activeTrip.start_date}
            endDate={activeTrip.end_date}
            onComplete={async (entries) => {
              for (const e of entries) {
                await addItineraryEntry({
                  trip_id: activeTrip.id,
                  activity_name: e.activity_name,
                  category: e.category,
                  date: e.date,
                  time: e.time,
                  booking_url: null,
                })
              }
              setTab('list')
            }}
          />

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Flame size={18} className="text-orange-400" /> Popular Activities
            </h3>
            <div className="space-y-2">
              {popular.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center justify-between rounded-xl border border-slate-700 bg-nomad-surface p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-nomad-muted">{a.description}</p>
                  </div>
                  <Button variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => addActivity(a)}>
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Search Activities</h3>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <Input label="Date" type="date" value={manualDate} onChange={(e) => setManualDate(e.target.value)} min={activeTrip.start_date} max={activeTrip.end_date} />
              <Input label="Time" type="time" value={manualTime} onChange={(e) => setManualTime(e.target.value)} />
            </div>
            <ActivitySearch destination={activeTrip.destination_name} onAdd={addActivity} />
          </div>

          <div className="rounded-xl border border-slate-700 p-4">
            <h3 className="mb-3 text-sm font-semibold">Add Custom Activity</h3>
            <div className="space-y-2">
              <Input placeholder="Activity name" value={manualName} onChange={(e) => setManualName(e.target.value)} />
              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-nomad-surface px-4 py-3 text-white"
              >
                {['hiking', 'formal', 'swimming', 'beach', 'skiing', 'business', 'dining', 'sightseeing', 'nightlife', 'camping'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Button
                className="w-full"
                disabled={!manualName}
                onClick={async () => {
                  await addItineraryEntry({
                    trip_id: activeTrip.id,
                    activity_name: manualName,
                    category: manualCategory,
                    date: manualDate || activeTrip.start_date,
                    time: manualTime,
                    booking_url: null,
                  })
                  setManualName('')
                }}
              >
                Add to Itinerary
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
