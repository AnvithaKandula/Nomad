import { useEffect, useState } from 'react'
import { Search, ExternalLink, Plus, Loader2 } from 'lucide-react'
import { searchActivities } from '../../lib/activities'
import { searchGooglePlaces, isGooglePlacesConfigured } from '../../lib/googlePlaces'
import type { ActivityOption } from '../../types'
import { Button } from '../ui/Button'

interface ActivitySearchProps {
  destination?: string
  onSelect: (activity: ActivityOption) => void
}

export function ActivitySearch({ destination, onSelect }: ActivitySearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ActivityOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchGooglePlaces(query, destination)
        if (!cancelled) setResults(data)
      } catch {
        if (!cancelled) {
          setError('Could not reach Google Places. Showing local suggestions.')
          setResults(searchActivities(query, destination))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, destination])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder={
            destination
              ? `Search activities in ${destination}...`
              : 'Search activities (e.g. hiking, museums, dining)...'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 outline-none focus:border-black"
        />
      </div>

      {isGooglePlacesConfigured() && (
        <p className="text-xs text-gray-400">Powered by Google Places</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching...
        </div>
      ) : (
        <>
          {error && <p className="text-center text-xs text-amber-600">{error}</p>}

          <div className="space-y-3">
            {results.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">No activities found. Try a different search.</p>
            ) : (
              results.map((activity) => (
                <div
                  key={activity.placeId ?? activity.name}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-black">{activity.name}</p>
                      <p className="mt-1 text-xs font-medium capitalize text-gray-500">{activity.category}</p>
                      <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <Button
                        variant="primary"
                        className="!px-3 !py-1.5 text-xs"
                        onClick={() => onSelect(activity)}
                      >
                        <Plus size={14} className="mr-1 inline" /> Add
                      </Button>
                      <a
                        href={activity.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-gray-300 hover:text-black"
                      >
                        View <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
