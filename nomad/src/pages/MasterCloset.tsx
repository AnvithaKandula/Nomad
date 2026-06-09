import { useState } from 'react'
import { Plus, Pencil, Trash2, Shirt } from 'lucide-react'
import { useTrips } from '../contexts/TripContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import type { ItemCategory } from '../types'

const CATEGORIES: ItemCategory[] = ['clothing', 'tech', 'toiletry', 'accessory', 'footwear', 'other']

export function MasterCloset() {
  const { closet, addClosetItem, updateClosetItem, deleteClosetItem } = useTrips()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ItemCategory>('clothing')
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!name.trim()) return
    if (editingId) {
      await updateClosetItem(editingId, name.trim(), category)
      setEditingId(null)
    } else {
      await addClosetItem(name.trim(), category)
    }
    setName('')
    setCategory('clothing')
  }

  const startEdit = (id: string, itemName: string, cat: string) => {
    setEditingId(id)
    setName(itemName)
    setCategory(cat as ItemCategory)
  }

  const grouped = CATEGORIES.reduce<Record<string, typeof closet>>((acc, cat) => {
    const items = closet.filter((i) => i.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Master Closet</h1>
        <p className="text-sm text-nomad-muted">Your permanent packing inventory</p>
      </div>

      <div className="mb-6 space-y-3 rounded-2xl border border-slate-700 bg-nomad-surface p-4">
        <Input
          placeholder="Item name (e.g. Hiking boots)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ItemCategory)}
          className="w-full rounded-xl border border-slate-600 bg-nomad-dark px-4 py-3 text-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Button onClick={handleSubmit} className="w-full">
          <Plus size={16} className="mr-1 inline" />
          {editingId ? 'Update Item' : 'Add Item'}
        </Button>
        {editingId && (
          <Button variant="ghost" onClick={() => { setEditingId(null); setName('') }} className="w-full">
            Cancel edit
          </Button>
        )}
      </div>

      {closet.length === 0 ? (
        <div className="py-12 text-center">
          <Shirt className="mx-auto mb-3 text-nomad-muted" size={40} />
          <p className="text-nomad-muted">Add items you always travel with</p>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-6">
            <h3 className="mb-2 text-sm font-semibold capitalize text-nomad-teal-light">{cat}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-700 bg-nomad-surface px-4 py-3"
                >
                  <span className="text-sm">{item.item_name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item.id, item.item_name, item.category)} className="text-nomad-muted hover:text-white">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteClosetItem(item.id)} className="text-nomad-muted hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
