import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'

function Tab({ to, label, icon: Icon }) {
  const { t } = useTranslation()
  return (
    <NavLink
      to={to}
      className="flex min-w-[68px] shrink-0 snap-start flex-col items-center justify-center gap-1 py-1"
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200',
              isActive
                ? 'scale-105 bg-brand-600 text-white shadow-md shadow-brand-600/40'
                : 'text-slate-400'
            )}
          >
            <Icon size={18} />
          </span>
          <span
            className={cn(
              'line-clamp-2 max-w-[64px] text-center text-[9px] font-medium leading-tight transition-colors',
              isActive ? 'text-brand-700' : 'text-slate-400'
            )}
          >
            {t(label)}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function BottomNav({ items }) {
  const { t } = useTranslation()

  return (
    <nav
      className="fixed inset-x-3 bottom-[max(0.75rem,calc(env(safe-area-inset-bottom)+0.4rem))] z-30 rounded-2xl border border-brand-100/80 bg-white/95 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.2)] backdrop-blur-md lg:hidden"
      aria-label={t('sidebar.menu')}
    >
      <div className="flex snap-x snap-mandatory items-stretch justify-around gap-0.5 overflow-x-auto px-1.5 pb-1.5 pt-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) =>
          item.render ? (
            <div key={item.key ?? i} className="contents">
              {item.render}
            </div>
          ) : (
            <Tab key={item.to} {...item} />
          )
        )}
      </div>
    </nav>
  )
}
