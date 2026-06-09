import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { ActivityOption } from '../../types'

interface AddActivityModalProps {
  open: boolean
  activity: ActivityOption | null
  startDate: string
  endDate: string
  onClose: () => void
  onConfirm: (details: { date: string; time: string; booking_url: string | null }) => void | Promise<void>
}

export function AddActivityModal({ open, activity, startDate, endDate, onClose, onConfirm }: AddActivityModalProps) {
  const tripDates = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) }).map((d) =>
    format(d, 'yyyy-MM-dd'),
  )

  const [date, setDate] = useState(startDate)
  const [time, setTime] = useState('10:00')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && activity) {
      setDate(startDate)
      setTime('10:00')
      setSaving(false)
    }
  }, [open, activity, startDate])

  if (!open || !activity) return null

  const handleConfirm = async () => {
    setSaving(true)
    await onConfirm({ date, time, booking_url: activity.bookingUrl ?? null })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl border border-gray-200 bg-white shadow-xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="font-serif text-lg font-bold text-black">Add to Itinerary</h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <p className="font-semibold text-black">{activity.name}</p>
            <p className="mt-1 text-xs capitalize text-gray-500">{activity.category}</p>
          </div>

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
        </div>

        <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={saving} className="flex-1">
            {saving ? 'Adding...' : 'Add Activity'}
          </Button>
        </div>
      </div>
    </div>
  )
}
