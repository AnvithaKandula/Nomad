interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-black dark:text-white md:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 md:mt-2 md:text-base">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}
