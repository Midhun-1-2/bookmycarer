import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut } from 'lucide-react'
import { cn } from '../../lib/cn'
import { ROLE_LABEL } from '../../app/roleConfig'

function SidebarContent({ items, session, onLogout }) {
  const { t } = useTranslation()
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <img src="/brand/icon.png" alt="Book My Carer" className="h-9 w-9 shrink-0 object-contain" />
        <div>
          <p className="text-sm font-semibold text-slate-900">Book My Carer</p>
          <p className="text-xs text-brand-600">{t(ROLE_LABEL[session?.role])}</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                  : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'
              )
            }
            end
          >
            <Icon size={18} />
            {t(label)}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-brand-100 p-3">
        <div className="mb-2 px-2">
          <p className="truncate text-sm font-medium text-slate-800">{session?.name}</p>
          <p className="truncate text-xs text-slate-400">{session?.phone}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
        >
          <LogOut size={17} />
          {t('sidebar.logout')}
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ items, session, onLogout }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-brand-100 bg-white lg:block">
      <SidebarContent items={items} session={session} onLogout={onLogout} />
    </aside>
  )
}
