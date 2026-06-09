import { useEffect, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { ActivityCategory, ItineraryEntry } from '../../types'

const CATEGORIES: ActivityCategory[] = [
  'sightseeing',
  'dining',
  'hiking',
  'beach',
  'nightlife',
  'formal',
  'business',
  'swimming',
  'skiing',
  'camping',
]

interface EditItineraryModalProps {
  open: boolean
  entry: ItineraryEntry | null
  startDate: string
  endDate: string
  onClose: () => void
  onSave: (updates: {
    activity_name: string
    category: string
    date: string
    time: string
    booking_url: string | null
    notes: string | null
  }) => void | Promise<void>
}

export function EditItineraryModal({ open, entry, startDate, endDate, onClose, onSave }: EditItineraryModalProps) {
  const tripDates = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) }).map((d) =>
    format(d, 'yyyy-MM-dd'),
  )

  const [activityName, setActivityName] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [bookingUrl, setBookingUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (entry) {
      setActivityName(entry.activity_name)
      setCategory(entry.category)
      setDate(entry.date)
      setTime(entry.time?.slice(0, 5) ?? '10:00')
      setBookingUrl(entry.booking_url ?? '')
      setNotes(entry.notes ?? '')
    }
  }, [entry])

  if (!open || !entry) return null

  const handleSave = async () => {
    setSaving(true)
    await onSave({
      activity_name: activityName.trim(),
      category,
      date,
      time,
      booking_url: bookingUrl.trim() || null,
      notes: notes.trim() || null,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-3xl border border-gray-200 bg-white shadow-xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="font-serif text-lg font-bold text-black">Edit Activity</h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <Input label="Activity name" value={activityName} onChange={(e) => setActivityName(e.target.value)} />

          <label className="block">
            <span className="mb-1.5 block text-sm text-gray-500">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black capitalize outline-none focus:border-black"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-gray-500">Date</span>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black"
            >
              {tripDates.map((d) => (
                <option key={d} value={d}>
                  {format(parseISO(d), 'EEEE, MMM d')}
                </option>
              ))}
            </select>
          </label>

          <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />

          <Input
            label="Booking link"
            type="url"
            placeholder="https://..."
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
          />
          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black"
            >
              Preview link <ExternalLink size={12} />
            </a>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm text-gray-500">Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Confirmation number, meeting spot, what to bring..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 outline-none focus:border-black"
            />
          </label>
        </div>

        <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !activityName.trim()} className="flex-1">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
