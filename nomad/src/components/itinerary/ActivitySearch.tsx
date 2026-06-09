import { useState } from 'react'
import { Search, ExternalLink, Plus } from 'lucide-react'
import { searchActivities } from '../../lib/activities'
import type { ActivityOption } from '../../types'
import { Button } from '../ui/Button'

interface ActivitySearchProps {
  destination?: string
  onAdd: (activity: ActivityOption) => void
}

export function ActivitySearch({ destination, onAdd }: ActivitySearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ActivityOption[]>([])

  const handleSearch = (q: string) => {
    setQuery(q)
    setResults(searchActivities(q, destination))
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nomad-muted" />
        <input
          type="search"
          placeholder="Search activities (e.g. hiking, beach, dining)..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-nomad-surface py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:border-nomad-teal-light"
        />
      </div>

      <div className="space-y-2">
        {(query ? results : searchActivities('', destination)).map((activity) => (
          <div
            key={activity.name}
            className="rounded-xl border border-slate-700 bg-nomad-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{activity.name}</p>
                <p className="mt-1 text-xs capitalize text-nomad-teal-light">{activity.category}</p>
                <p className="mt-1 text-sm text-nomad-muted">{activity.description}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <Button
                  variant="primary"
                  className="!px-3 !py-1.5 text-xs"
                  onClick={() => onAdd(activity)}
                >
                  <Plus size={14} className="mr-1 inline" /> Add
                </Button>
                <a
                  href={activity.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 rounded-xl border border-slate-600 px-3 py-1.5 text-xs text-nomad-muted hover:text-white"
                >
                  Book <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
