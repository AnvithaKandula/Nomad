import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm text-gray-500 dark:text-gray-400">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-black placeholder-gray-400 outline-none focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-white ${className}`}
        {...props}
      />
    </label>
  )
}
