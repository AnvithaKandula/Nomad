import { NavLink } from 'react-router-dom'
import { MapPin, Backpack, CalendarDays, Shirt, Settings } from 'lucide-react'

const tabs = [
  { to: '/trips', icon: MapPin, label: 'Trips' },
  { to: '/packing', icon: Backpack, label: 'Packing' },
  { to: '/itinerary', icon: CalendarDays, label: 'Itinerary' },
  { to: '/closet', icon: Shirt, label: 'Closet' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur-lg safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-colors ${
                isActive ? 'font-medium text-black' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-2 h-0.5 w-6 rounded-full bg-black" />
                )}
                <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
