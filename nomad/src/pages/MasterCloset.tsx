import { useState } from 'react'
import { Plus, Trash2, Search } from 'lucide-react'
import { useTrips } from '../contexts/TripContext'
import { PageHeader } from '../components/ui/PageHeader'
import { PageContainer } from '../components/layout/PageContainer'
import { ClosetCategoryIcon } from '../lib/categoryIcons'
import type { ItemCategory } from '../types'

const CATEGORIES: ItemCategory[] = ['clothing', 'tech', 'toiletry', 'accessory', 'footwear', 'other']

export function MasterCloset() {
  const { closet, addClosetItem, deleteClosetItem } = useTrips()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ItemCategory>('clothing')

  const filtered = closet.filter((i) =>
    i.item_name.toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = CATEGORIES.reduce<Record<string, typeof filtered>>((acc, cat) => {
    const items = filtered.filter((i) => i.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const handleAdd = async () => {
    if (!name.trim()) return
    await addClosetItem(name.trim(), category)
    setName('')
    setShowAdd(false)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Closet"
        subtitle={`${closet.length} items in your inventory`}
        action={
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg"
          >
            <Plus size={22} />
          </button>
        }
      />

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-black"
        />
      </div>

      {showAdd && (
        <div className="mb-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <input
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button onClick={handleAdd} className="w-full rounded-full bg-black py-2.5 text-sm font-medium text-white">
            Add Item
          </button>
        </div>
      )}

      {closet.length === 0 ? (
        <p className="py-12 text-center text-gray-500">Add items you always travel with</p>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-6">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <ClosetCategoryIcon category={cat} size={14} />
              {cat} ({items.length})
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm"
                >
                  <span className="text-sm font-medium text-black">{item.item_name}</span>
                  <button onClick={() => deleteClosetItem(item.id)} className="text-gray-400 hover:text-black">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </PageContainer>
  )
}
