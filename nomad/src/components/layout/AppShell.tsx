import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-[#f4f4f5] pb-24 safe-top">
      <Outlet />
      <BottomNav />
    </div>
  )
}
