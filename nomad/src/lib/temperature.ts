export type TempUnit = 'C' | 'F'

const STORAGE_KEY = 'nomad-temp-unit'

export function getStoredTempUnit(): TempUnit {
  return localStorage.getItem(STORAGE_KEY) === 'F' ? 'F' : 'C'
}

export function storeTempUnit(unit: TempUnit) {
  localStorage.setItem(STORAGE_KEY, unit)
}

export function toDisplayTemp(celsius: number, unit: TempUnit): number {
  return unit === 'F' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius)
}

export function formatPrecipitation(mm: number, unit: TempUnit): string {
  if (mm <= 0) return ''
  return unit === 'F' ? `${(mm / 25.4).toFixed(1)} in` : `${Math.round(mm)} mm`
}
