import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm text-gray-500">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-black placeholder-gray-400 outline-none focus:border-black ${className}`}
        {...props}
      />
    </label>
  )
}
