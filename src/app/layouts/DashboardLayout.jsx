import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import BottomNav from '../../components/layout/BottomNav'
import { useSession } from '../../lib/session'

export default function DashboardLayout({ navItems }) {
  const { t } = useTranslation()
  const { session, logout } = useSession()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    const role = session?.role
    navigate(role ? `/login/${role}` : '/')
    logout()
  }

  const activeItem = [...navItems]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => location.pathname.startsWith(item.to))
  const title = activeItem ? t(activeItem.label) : t('dashboardLayout.title')

  return (
    <div className="flex min-h-svh bg-brand-50">
      <Sidebar items={navItems} session={session} onLogout={handleLogout} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar title={title} onLogout={handleLogout} />
        <main className="flex-1 p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <BottomNav items={navItems} />
    </div>
  )
}
