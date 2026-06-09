import { useState } from 'react'
import { Check, Plus, Trash2, Sparkles, Package } from 'lucide-react'
import { useTrips } from '../contexts/TripContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function PackingOverview() {
  const {
    trips,
    activeTrip,
    tripItems,
    closet,
    setActiveTripId,
    togglePacked,
    addTripItem,
    deleteTripItem,
    importClosetToTrip,
  } = useTrips()
  const [showSuggestedOnly, setShowSuggestedOnly] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [selectedCloset, setSelectedCloset] = useState<string[]>([])

  const displayed = showSuggestedOnly
    ? tripItems.filter((i) => i.is_suggested)
    : tripItems

  const packedCount = tripItems.filter((i) => i.is_packed).length

  if (!activeTrip && trips.length > 0) {
    return (
      <div className="px-4 pt-6">
        <h1 className="mb-4 text-2xl font-bold">Packing List</h1>
        <p className="mb-4 text-sm text-nomad-muted">Select a trip first:</p>
        <div className="space-y-2">
          {trips.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTripId(t.id)}
              className="w-full rounded-xl border border-slate-700 bg-nomad-surface p-4 text-left hover:border-nomad-teal-light"
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
      <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
        <Package className="mb-4 text-nomad-muted" size={48} />
        <p className="text-nomad-muted">Create a trip to start packing</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Packing List</h1>
        <p className="text-sm text-nomad-muted">
          {activeTrip.destination_name} · {packedCount}/{tripItems.length} packed
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl bg-nomad-surface p-3">
        <span className="text-sm">Show suggested only</span>
        <button
          onClick={() => setShowSuggestedOnly(!showSuggestedOnly)}
          className={`relative h-7 w-12 rounded-full transition-colors ${showSuggestedOnly ? 'bg-nomad-teal' : 'bg-slate-600'}`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${showSuggestedOnly ? 'left-5' : 'left-0.5'}`}
          />
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Add item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={async () => {
            if (newItem.trim()) {
              await addTripItem(activeTrip.id, newItem.trim())
              setNewItem('')
            }
          }}
        >
          <Plus size={18} />
        </Button>
      </div>

      <Button variant="secondary" className="mb-4 w-full" onClick={() => setShowImport(!showImport)}>
        Import from Master Closet
      </Button>

      {showImport && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-700 p-3">
          {closet.length === 0 ? (
            <p className="text-sm text-nomad-muted">No closet items yet</p>
          ) : (
            closet.map((item) => (
              <label key={item.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCloset.includes(item.id)}
                  onChange={(e) =>
                    setSelectedCloset(
                      e.target.checked
                        ? [...selectedCloset, item.id]
                        : selectedCloset.filter((id) => id !== item.id),
                    )
                  }
                />
                {item.item_name}
                <span className="text-xs text-nomad-muted">({item.category})</span>
              </label>
            ))
          )}
          {selectedCloset.length > 0 && (
            <Button
              className="w-full"
              onClick={async () => {
                await importClosetToTrip(activeTrip.id, selectedCloset)
                setSelectedCloset([])
                setShowImport(false)
              }}
            >
              Import {selectedCloset.length} items
            </Button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {displayed.length === 0 ? (
          <p className="py-8 text-center text-sm text-nomad-muted">
            No items yet. Add activities to your itinerary for smart suggestions!
          </p>
        ) : (
          displayed.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                item.is_packed ? 'border-nomad-teal/30 bg-nomad-teal/10' : 'border-slate-700 bg-nomad-surface'
              }`}
            >
              <button
                onClick={() => togglePacked(item.id, !item.is_packed)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  item.is_packed ? 'border-nomad-teal-light bg-nomad-teal-light text-white' : 'border-slate-500'
                }`}
              >
                {item.is_packed && <Check size={14} />}
              </button>
              <div className="flex-1">
                <p className={`text-sm ${item.is_packed ? 'line-through text-nomad-muted' : ''}`}>
                  {item.item_name}
                </p>
                {item.is_suggested && (
                  <span className="flex items-center gap-1 text-xs text-nomad-teal-light">
                    <Sparkles size={10} /> Suggested
                  </span>
                )}
              </div>
              <button onClick={() => deleteTripItem(item.id)} className="text-nomad-muted hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
