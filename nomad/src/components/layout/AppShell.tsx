import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-nomad-dark pb-20 safe-top">
      <Outlet />
      <BottomNav />
    </div>
  )
}
