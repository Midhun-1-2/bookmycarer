import { Menu, Bell } from 'lucide-react'

export default function Topbar({ title, onOpenMenu, right }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-brand-100 bg-white/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {right}
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-brand-50"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>
      </div>
    </header>
  )
}
