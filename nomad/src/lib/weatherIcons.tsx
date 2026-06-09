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

function Sun() {
  return (
    <g>
      <circle cx="20" cy="20" r="8" fill="#FBBF24" />
      <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="6" x2="20" y2="10" />
        <line x1="20" y1="30" x2="20" y2="34" />
        <line x1="6" y1="20" x2="10" y2="20" />
        <line x1="30" y1="20" x2="34" y2="20" />
        <line x1="10.1" y1="10.1" x2="12.9" y2="12.9" />
        <line x1="27.1" y1="27.1" x2="29.9" y2="29.9" />
        <line x1="10.1" y1="29.9" x2="12.9" y2="27.1" />
        <line x1="27.1" y1="12.9" x2="29.9" y2="10.1" />
      </g>
    </g>
  )
}

function Cloud({ x = 14, y = 22 }: { x?: number; y?: number }) {
  return (
    <g fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1">
      <ellipse cx={x + 10} cy={y} rx="11" ry="7" />
      <ellipse cx={x + 20} cy={y - 2} rx="9" ry="6" />
      <ellipse cx={x + 3} cy={y - 1} rx="7" ry="5" />
    </g>
  )
}

function Rain() {
  return (
    <g fill="#0EA5E9">
      <ellipse cx="18" cy="36" rx="2" ry="3" />
      <ellipse cx="26" cy="38" rx="2" ry="3" />
      <ellipse cx="34" cy="36" rx="2" ry="3" />
    </g>
  )
}

function Snow() {
  return (
    <g fill="#38BDF8" stroke="#0EA5E9" strokeWidth="0.5">
      <circle cx="18" cy="36" r="2" />
      <circle cx="26" cy="38" r="2" />
      <circle cx="34" cy="36" r="2" />
    </g>
  )
}

function Lightning() {
  return (
    <path
      d="M26 32 L22 40 L26 40 L24 46"
      fill="#FBBF24"
      stroke="#F59E0B"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  )
}

function FogLines() {
  return (
    <g stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" opacity="0.8">
      <line x1="10" y1="38" x2="38" y2="38" />
      <line x1="14" y1="42" x2="34" y2="42" />
    </g>
  )
}

export function WeatherIllustration({ code, size = 40 }: { code: number; size?: number }) {
  const variant = getWeatherVariant(code)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      role="img"
      className="shrink-0"
    >
      <rect width="48" height="48" fill="transparent" />

      {variant === 'clear' && <Sun />}

      {variant === 'partly-cloudy' && (
        <>
          <Sun />
          <Cloud x={16} y={24} />
        </>
      )}

      {variant === 'cloudy' && <Cloud x={10} y={20} />}

      {variant === 'fog' && (
        <>
          <Cloud x={10} y={18} />
          <FogLines />
        </>
      )}

      {variant === 'rain' && (
        <>
          <Cloud x={10} y={18} />
          <Rain />
        </>
      )}

      {variant === 'snow' && (
        <>
          <Cloud x={10} y={18} />
          <Snow />
        </>
      )}

      {variant === 'thunder' && (
        <>
          <Cloud x={10} y={18} />
          <Rain />
          <Lightning />
        </>
      )}
    </svg>
  )
}
