import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LogOut, X, HeartHandshake } from 'lucide-react'
import { cn } from '../../lib/cn'
import { ROLE_LABEL } from '../../app/roleConfig'

function SidebarContent({ items, session, onLogout, onNavigate }) {
  const { t } = useTranslation()
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <HeartHandshake size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Book My Carers</p>
          <p className="text-xs text-brand-600">{t(ROLE_LABEL[session?.role])}</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
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

export default function Sidebar({ items, session, onLogout, mobileOpen, onCloseMobile }) {
  const { t } = useTranslation()
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-brand-100 bg-white lg:block">
        <SidebarContent items={items} session={session} onLogout={onLogout} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-brand-950/40" onClick={onCloseMobile} />
            <motion.div
              className="relative z-10 h-full w-72 max-w-[80vw] bg-white shadow-xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <button
                onClick={onCloseMobile}
                className="absolute right-3 top-4 rounded-full p-1.5 text-slate-400 hover:bg-brand-50"
                aria-label={t('sidebar.closeMenu')}
              >
                <X size={18} />
              </button>
              <SidebarContent
                items={items}
                session={session}
                onLogout={onLogout}
                onNavigate={onCloseMobile}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
