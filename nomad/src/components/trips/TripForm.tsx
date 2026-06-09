import { useState, useEffect } from 'react'
import { MapPin, Loader2, ImageIcon } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { searchLocations, fetchLocationImage } from '../../lib/geocoding'
import type { Trip, LocationSuggestion, BannerTheme } from '../../types'

interface TripFormProps {
  initial?: Trip | null
  bannerTheme: BannerTheme
  onSubmit: (data: {
    destination_name: string
    start_date: string
    end_date: string
    lat_long: { lat: number; lng: number; display_name: string }
    image_url: string
    country_code: string
  }) => Promise<void>
  onCancel: () => void
}

export function TripForm({ initial, bannerTheme, onSubmit, onCancel }: TripFormProps) {
  const [destination, setDestination] = useState(initial?.destination_name ?? '')
  const [startDate, setStartDate] = useState(initial?.start_date ?? '')
  const [endDate, setEndDate] = useState(initial?.end_date ?? '')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [selected, setSelected] = useState<LocationSuggestion | null>(
    initial?.lat_long?.lat
      ? {
          display_name: initial.destination_name,
          lat: initial.lat_long.lat!,
          lng: initial.lat_long.lng!,
          country_code: initial.country_code ?? '',
        }
      : null,
  )
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '')
  const [loadingImage, setLoadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!destination || destination.length < 3) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      const results = await searchLocations(destination)
      setSuggestions(results)
      setSearching(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [destination])

  const selectLocation = async (loc: LocationSuggestion) => {
    setSelected(loc)
    setDestination(loc.display_name.split(',')[0])
    setSuggestions([])
    setLoadingImage(true)
    const img = await fetchLocationImage(loc.display_name, bannerTheme, loc.country_code)
    setImageUrl(img)
    setLoadingImage(false)
  }

  const refreshImage = async () => {
    if (!selected) return
    setLoadingImage(true)
    const img = await fetchLocationImage(selected.display_name, bannerTheme, selected.country_code)
    setImageUrl(img)
    setLoadingImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !startDate || !endDate) return
    setSubmitting(true)
    await onSubmit({
      destination_name: selected.display_name.split(',')[0],
      start_date: startDate,
      end_date: endDate,
      lat_long: {
        lat: selected.lat,
        lng: selected.lng,
        display_name: selected.display_name,
      },
      image_url: imageUrl,
      country_code: selected.country_code,
    })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          label="Destination"
          placeholder="Search city or country..."
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value)
            setSelected(null)
          }}
        />
        {searching && (
          <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin text-nomad-muted" />
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-600 bg-nomad-surface shadow-xl">
            {suggestions.map((s) => (
              <li key={s.display_name}>
                <button
                  type="button"
                  onClick={() => selectLocation(s)}
                  className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm hover:bg-slate-700"
                >
                  <MapPin size={16} className="mt-0.5 shrink-0 text-nomad-teal-light" />
                  <span>{s.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </div>

      {(imageUrl || loadingImage) && (
        <div className="relative overflow-hidden rounded-xl">
          {loadingImage ? (
            <div className="flex h-40 items-center justify-center bg-nomad-surface">
              <Loader2 className="h-8 w-8 animate-spin text-nomad-teal-light" />
            </div>
          ) : (
            <>
              <img src={imageUrl} alt="Destination" className="h-40 w-full object-cover" />
              <button
                type="button"
                onClick={refreshImage}
                className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs text-white"
              >
                <ImageIcon size={14} /> Refresh image
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={!selected || submitting} className="flex-1">
          {submitting ? 'Saving...' : initial ? 'Update Trip' : 'Create Trip'}
        </Button>
      </div>
    </form>
  )
}
