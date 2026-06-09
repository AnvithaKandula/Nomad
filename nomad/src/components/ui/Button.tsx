import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  children: ReactNode
}

const variants = {
  primary: 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
  secondary:
    'bg-white text-black border border-gray-200 hover:bg-gray-50 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-800',
  outline:
    'bg-transparent text-black border border-gray-300 hover:bg-gray-50 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-900',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white',
  danger:
    'bg-white text-red-600 border border-red-200 hover:bg-red-50 dark:bg-neutral-900 dark:border-red-900 dark:hover:bg-red-950',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
