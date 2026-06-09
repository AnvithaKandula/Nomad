import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm text-nomad-muted">{label}</span>}
      <input
        className={`w-full rounded-xl border border-slate-600 bg-nomad-surface px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-nomad-teal-light ${className}`}
        {...props}
      />
    </label>
  )
}
