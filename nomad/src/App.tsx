import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TripProvider } from './contexts/TripContext'
import { AppShell } from './components/layout/AppShell'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Trips } from './pages/Trips'
import { TripDetail } from './pages/TripDetail'
import { PackingOverview } from './pages/PackingOverview'
import { ItineraryOverview } from './pages/ItineraryOverview'
import { MasterCloset } from './pages/MasterCloset'
import { Settings } from './pages/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f4f4f5]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TripProvider>
              <AppShell />
            </TripProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/trips" replace />} />
        <Route path="trips" element={<Trips />} />
        <Route path="trips/:id" element={<TripDetail />} />
        <Route path="packing" element={<PackingOverview />} />
        <Route path="itinerary" element={<ItineraryOverview />} />
        <Route path="closet" element={<MasterCloset />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/trips" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
