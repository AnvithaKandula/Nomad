import { NavLink } from 'react-router-dom'
import { MapPin, Backpack, CalendarDays, Shirt, Settings } from 'lucide-react'
import { LogoMark } from '../ui/LogoMark'

const tabs = [
  { to: '/trips', icon: MapPin, label: 'Trips' },
  { to: '/packing', icon: Backpack, label: 'Packing' },
  { to: '/itinerary', icon: CalendarDays, label: 'Itinerary' },
  { to: '/closet', icon: Shirt, label: 'Closet' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function NavItem({ to, icon: Icon, label, layout }: { to: string; icon: typeof MapPin; label: string; layout: 'bar' | 'rail' }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        layout === 'rail'
          ? `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
              isActive ? 'bg-black font-medium text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`
          : `relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-colors ${
              isActive ? 'font-medium text-black' : 'text-gray-400 hover:text-gray-600'
            }`
      }
    >
      {({ isActive }) => (
        <>
          {layout === 'bar' && isActive && (
            <span className="absolute -top-2 h-0.5 w-6 rounded-full bg-black" />
          )}
          <Icon size={layout === 'rail' ? 20 : 22} strokeWidth={isActive ? 2.25 : 1.75} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-lg safe-bottom lg:hidden">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2 md:max-w-3xl md:px-4">
        {tabs.map((tab) => (
          <NavItem key={tab.to} {...tab} layout="bar" />
        ))}
      </div>
    </nav>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-8 safe-top lg:flex xl:w-72">
      <div className="mb-10 flex items-center gap-3 px-2">
        <LogoMark size={40} className="text-black" />
        <div>
          <p className="font-sans text-sm font-bold tracking-[0.2em] text-black">NOMAD</p>
          <p className="text-[10px] tracking-wider text-gray-400">Travel companion</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {tabs.map((tab) => (
          <NavItem key={tab.to} {...tab} layout="rail" />
        ))}
      </nav>
    </aside>
  )
}
