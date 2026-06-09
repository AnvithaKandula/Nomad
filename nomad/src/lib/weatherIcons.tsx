import { Cloud, Sun, CloudRain, Snowflake, CloudSun, CloudLightning, CloudFog } from 'lucide-react'

export interface WeatherIconStyle {
  Icon: typeof Sun
  className: string
  bgClassName: string
}

export function getWeatherIconStyle(code: number): WeatherIconStyle {
  if ([0, 1].includes(code)) {
    return { Icon: Sun, className: 'text-amber-400', bgClassName: 'bg-amber-50' }
  }
  if (code === 2) {
    return { Icon: CloudSun, className: 'text-amber-400', bgClassName: 'bg-amber-50' }
  }
  if (code === 3) {
    return { Icon: Cloud, className: 'text-slate-500', bgClassName: 'bg-slate-100' }
  }
  if ([45, 48].includes(code)) {
    return { Icon: CloudFog, className: 'text-slate-400', bgClassName: 'bg-slate-100' }
  }
  if ([71, 73, 75].includes(code)) {
    return { Icon: Snowflake, className: 'text-sky-400', bgClassName: 'bg-sky-50' }
  }
  if (code === 95) {
    return { Icon: CloudLightning, className: 'text-violet-500', bgClassName: 'bg-violet-50' }
  }
  if ([61, 63, 65, 80, 81, 82, 51, 53, 55].includes(code)) {
    return { Icon: CloudRain, className: 'text-blue-500', bgClassName: 'bg-blue-50' }
  }
  return { Icon: CloudSun, className: 'text-sky-500', bgClassName: 'bg-sky-50' }
}

export function WeatherIcon({ code, size = 22 }: { code: number; size?: number }) {
  const { Icon, className } = getWeatherIconStyle(code)
  return <Icon size={size} className={className} strokeWidth={2} />
}
