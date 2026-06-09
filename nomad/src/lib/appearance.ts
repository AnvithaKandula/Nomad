import type { ColorMode } from '../types'

export const COLOR_MODE_KEY = 'nomad-color-mode'

export function applyColorMode(mode: ColorMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
  localStorage.setItem(COLOR_MODE_KEY, mode)
}

export function getStoredColorMode(): ColorMode {
  const stored = localStorage.getItem(COLOR_MODE_KEY)
  return stored === 'dark' ? 'dark' : 'light'
}
