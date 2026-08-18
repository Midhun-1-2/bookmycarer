import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

const Input = forwardRef(function Input(
  { label, error, className, id, ...props },
  ref
) {
  const inputId = id || props.name

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-11 w-full rounded-lg border border-brand-200 bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-shadow focus:border-brand-500 focus:ring-4 focus:ring-brand-100',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-100',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </div>
  )
})

export default Input
