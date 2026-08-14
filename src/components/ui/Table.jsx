import { cn } from '../../lib/cn'

export function Table({ className, children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-100">
      <table className={cn('w-full min-w-max text-left text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children }) {
  return (
    <thead className="bg-brand-50 text-xs font-semibold uppercase tracking-wide text-brand-700">
      <tr>{children}</tr>
    </thead>
  )
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-brand-50">{children}</tbody>
}

export function Th({ children, className }) {
  return <th className={cn('px-4 py-3', className)}>{children}</th>
}

export function Td({ children, className }) {
  return <td className={cn('px-4 py-3 text-slate-700', className)}>{children}</td>
}

export function Tr({ children, className, ...props }) {
  return (
    <tr className={cn('transition-colors hover:bg-brand-50/60', className)} {...props}>
      {children}
    </tr>
  )
}
