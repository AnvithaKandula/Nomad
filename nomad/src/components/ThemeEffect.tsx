import { useEffect } from 'react'
import { useTrips } from '../contexts/TripContext'
import { applyColorMode } from '../lib/appearance'

export function ThemeEffect() {
  const { colorMode } = useTrips()

  useEffect(() => {
    applyColorMode(colorMode)
  }, [colorMode])

  return null
}
