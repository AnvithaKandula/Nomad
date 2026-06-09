import { NavLink } from 'react-router-dom'
import { MapPin, Luggage, CalendarDays, Shirt, Settings } from 'lucide-react'

const tabs = [
  { to: '/trips', icon: MapPin, label: 'Trips' },
  { to: '/packing', icon: Luggage, label: 'Packing' },
  { to: '/itinerary', icon: CalendarDays, label: 'Itinerary' },
  { to: '/closet', icon: Shirt, label: 'Closet' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/50 bg-nomad-dark/95 backdrop-blur-lg safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? 'text-nomad-teal-light'
                  : 'text-nomad-muted hover:text-slate-300'
              }`
            }
          >
            <Icon size={22} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
