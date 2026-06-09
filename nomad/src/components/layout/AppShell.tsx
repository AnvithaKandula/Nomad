import { Outlet } from 'react-router-dom'
import { DesktopSidebar, MobileBottomNav } from './AppNavigation'

export function AppShell() {
  return (
    <div className="flex min-h-dvh bg-[#f4f4f5]">
      <DesktopSidebar />
      <main className="min-h-dvh flex-1 pb-24 lg:pb-8 safe-top">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  )
}
