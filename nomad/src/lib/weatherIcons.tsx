type WeatherVariant = 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog'

export function getWeatherVariant(code: number): WeatherVariant {
  if ([0, 1].includes(code)) return 'clear'
  if (code === 2) return 'partly-cloudy'
  if (code === 3) return 'cloudy'
  if ([45, 48].includes(code)) return 'fog'
  if ([71, 73, 75].includes(code)) return 'snow'
  if (code === 95) return 'thunder'
  if ([61, 63, 65, 80, 81, 82, 51, 53, 55].includes(code)) return 'rain'
  return 'partly-cloudy'
}

function SunRays() {
  return (
    <g fill="#FBBF24">
      <circle cx="18" cy="14" r="5" />
      <rect x="17" y="4" width="2" height="3" rx="1" />
      <rect x="17" y="21" width="2" height="3" rx="1" />
      <rect x="8" y="13" width="3" height="2" rx="1" />
      <rect x="25" y="13" width="3" height="2" rx="1" />
      <rect x="10.5" y="7" width="2" height="3" rx="1" transform="rotate(-45 11.5 8.5)" />
      <rect x="23.5" y="7" width="2" height="3" rx="1" transform="rotate(45 24.5 8.5)" />
      <rect x="10.5" y="18" width="2" height="3" rx="1" transform="rotate(45 11.5 19.5)" />
      <rect x="23.5" y="18" width="2" height="3" rx="1" transform="rotate(-45 24.5 19.5)" />
    </g>
  )
}

function CloudShape({ x = 8 }: { x?: number }) {
  return (
    <g fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5">
      <ellipse cx={x + 10} cy="24" rx="10" ry="6" />
      <ellipse cx={x + 18} cy="22" rx="8" ry="5.5" />
      <ellipse cx={x + 4} cy="23" rx="6" ry="4.5" />
    </g>
  )
}

function RainDrops() {
  return (
    <g fill="#38BDF8">
      <ellipse cx="12" cy="31" rx="1.5" ry="2.5" />
      <ellipse cx="18" cy="33" rx="1.5" ry="2.5" />
      <ellipse cx="24" cy="31" rx="1.5" ry="2.5" />
    </g>
  )
}

function SnowFlakes() {
  return (
    <g fill="#7DD3FC" stroke="#38BDF8" strokeWidth="0.4">
      <circle cx="12" cy="31" r="1.2" />
      <circle cx="18" cy="33" r="1.2" />
      <circle cx="24" cy="31" r="1.2" />
    </g>
  )
}

export function WeatherIllustration({ code, size = 40 }: { code: number; size?: number }) {
  const variant = getWeatherVariant(code)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      {variant === 'clear' && <SunRays />}

      {variant === 'partly-cloudy' && (
        <>
          <SunRays />
          <CloudShape x={10} />
        </>
      )}

      {variant === 'cloudy' && <CloudShape x={6} />}

      {variant === 'fog' && (
        <>
          <CloudShape x={6} />
          <g stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
            <line x1="6" y1="30" x2="30" y2="30" />
            <line x1="8" y1="33" x2="28" y2="33" />
          </g>
        </>
      )}

      {variant === 'rain' && (
        <>
          <CloudShape x={6} />
          <RainDrops />
        </>
      )}

      {variant === 'snow' && (
        <>
          <CloudShape x={6} />
          <SnowFlakes />
        </>
      )}

      {variant === 'thunder' && (
        <>
          <CloudShape x={6} />
          <path d="M17 28 L15 33 L18 33 L16 36" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.3" />
        </>
      )}
    </svg>
  )
}
