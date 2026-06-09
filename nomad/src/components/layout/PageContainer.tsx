interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`page-width pt-6 pb-6 sm:pt-8 ${className}`}>
      {children}
    </div>
  )
}
