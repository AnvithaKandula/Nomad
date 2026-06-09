interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

const iconSizes = { sm: 52, md: 80, lg: 108 }
const titleSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }
const taglineSizes = { sm: 'text-[8px]', md: 'text-[9px]', lg: 'text-[10px]' }

export function Logo({ size = 'lg', showTagline = true }: LogoProps) {
  const icon = iconSizes[size]

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src="/logo.svg"
        alt=""
        aria-hidden
        width={icon}
        height={Math.round(icon * 1.15)}
        className="object-contain"
        style={{ background: 'transparent' }}
      />
      <p className={`mt-5 font-sans font-bold tracking-[0.32em] text-black ${titleSizes[size]}`}>
        NOMAD
      </p>
      {showTagline && (
        <p className={`mt-1.5 font-sans font-normal tracking-[0.22em] text-gray-500 ${taglineSizes[size]}`}>
          DESTINATION READY
        </p>
      )}
    </div>
  )
}
