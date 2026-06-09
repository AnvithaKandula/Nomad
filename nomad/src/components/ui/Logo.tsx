import { LogoMark } from './LogoMark'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  markClassName?: string
}

const markSizes = { sm: 80, md: 120, lg: 172 }
const titleSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }
const taglineSizes = { sm: 'text-[8px]', md: 'text-[9px]', lg: 'text-[10px]' }

export function Logo({ size = 'lg', showTagline = true, markClassName = 'text-black' }: LogoProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <LogoMark size={markSizes[size]} className={markClassName} />
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
