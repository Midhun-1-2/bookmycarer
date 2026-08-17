import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import { useSession } from '../../lib/session'
import PanicButton from '../../features/panic/PanicButton'

export default function DashboardLayout({ navItems, showPanicButton = false }) {
  const { t } = useTranslation()
  const { session, logout } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const activeItem = [...navItems]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => location.pathname.startsWith(item.to))
  const title = activeItem ? t(activeItem.label) : t('dashboardLayout.title')

  return (
    <div className="flex min-h-svh bg-brand-50">
      <Sidebar
        items={navItems}
        session={session}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar title={title} onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      {showPanicButton && <PanicButton />}
    </div>
  )
}
