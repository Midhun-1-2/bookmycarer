import { Bell, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Topbar({ title, right, onLogout }) {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-brand-100 bg-white/80 px-4 backdrop-blur sm:px-6" aria-label={title}>
      <img src="/brand/wordmark.png" alt="Book My Carer" className="h-9 w-auto sm:h-10 lg:hidden" />
      <div className="flex items-center gap-1.5">
        {right}
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-brand-50"
          aria-label={t('topbar.notifications')}
        >
          <Bell size={19} />
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="cursor-pointer rounded-lg p-2 text-rose-600 hover:bg-rose-50 lg:hidden"
            aria-label={t('sidebar.logout')}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  )
}
