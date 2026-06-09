interface LogoMarkProps {
  size?: number
  className?: string
}

/** Monochromatic logo mark — color via Tailwind text-* or CSS color */
export function LogoMark({ size = 80, className = 'text-black' }: LogoMarkProps) {
  return (
    <div
      role="img"
      aria-label="Nomad"
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        WebkitMaskImage: 'url(/logo-mark.png)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: 'url(/logo-mark.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  )
}
