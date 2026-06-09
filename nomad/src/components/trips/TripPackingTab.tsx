import { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { useTrips } from '../../contexts/TripContext'
import { Button } from '../ui/Button'

interface TripPackingTabProps {
  tripId: string
}

export function TripPackingTab({ tripId }: TripPackingTabProps) {
  const { tripItems, closet, togglePacked, addTripItem, deleteTripItem, importClosetToTrip } = useTrips()
  const [showSuggestedOnly, setShowSuggestedOnly] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [selectedCloset, setSelectedCloset] = useState<string[]>([])

  const items = tripItems.filter((i) => i.trip_id === tripId)
  const displayed = showSuggestedOnly ? items.filter((i) => i.is_suggested) : items
  const packedCount = items.filter((i) => i.is_packed).length
  const progress = items.length ? Math.round((packedCount / items.length) * 100) : 0

  const grouped = displayed.reduce<Record<string, typeof displayed>>((acc, item) => {
    const cat = item.category ?? 'other'
    ;(acc[cat] ??= []).push(item)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-600">Packing progress</span>
          <span className="font-semibold text-black">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-black transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => setShowSuggestedOnly(!showSuggestedOnly)}
            className={`relative h-6 w-11 rounded-full transition-colors ${showSuggestedOnly ? 'bg-black' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${showSuggestedOnly ? 'left-5' : 'left-0.5'}`} />
          </button>
          Suggested only
        </label>
        <div className="flex gap-2">
          <Button variant="secondary" className="!px-4 !py-2 text-xs" onClick={() => setShowImport(!showImport)}>
            Import
          </Button>
          <Button
            className="!px-4 !py-2 text-xs"
            onClick={async () => {
              if (newItem.trim()) {
                await addTripItem(tripId, newItem.trim())
                setNewItem('')
              }
            }}
          >
            <Plus size={14} className="mr-1 inline" /> Add
          </Button>
        </div>
      </div>

      {showImport && (
        <div className="mb-4 space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
          {closet.map((item) => (
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
            </label>
          ))}
          {selectedCloset.length > 0 && (
            <Button
              className="w-full"
              onClick={async () => {
                await importClosetToTrip(tripId, selectedCloset)
                setSelectedCloset([])
                setShowImport(false)
              }}
            >
              Import {selectedCloset.length} items
            </Button>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Add item..."
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        className="mb-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
      />

      {Object.keys(grouped).length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No items yet</p>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} className="mb-5">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {cat} ({catItems.length})
            </h4>
            <div className="space-y-2">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                >
                  <button
                    onClick={() => togglePacked(item.id, !item.is_packed)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      item.is_packed ? 'border-black bg-black text-white' : 'border-gray-300'
                    }`}
                  >
                    {item.is_packed && <Check size={12} />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.is_packed ? 'text-gray-400 line-through' : 'text-black'}`}>
                      {item.item_name}
                    </p>
                    {item.is_suggested && item.category && (
                      <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                        {item.category === 'formal' ? 'See a Show at Place des Arts' : item.category === 'clothing' ? 'Weather' : item.category}
                      </span>
                    )}
                  </div>
                  <button onClick={() => deleteTripItem(item.id)} className="text-gray-400 hover:text-black">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
