interface PageContainerProps {
  children: React.ReactNode
  className?: string
  wide?: boolean
}

export function PageContainer({ children, className = '', wide = false }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 pt-6 pb-6 sm:px-6 sm:pt-8 md:px-8 lg:px-10 xl:px-12 ${
        wide
          ? 'max-w-full lg:max-w-6xl xl:max-w-7xl'
          : 'max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl'
      } ${className}`}
    >
      {children}
    </div>
  )
}
