import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, Bell, LayoutDashboard, CalendarClock, UserCog } from 'lucide-react'
import { useSession } from '../../lib/session'
import Footer from '../../components/layout/Footer'
import ChatbotWidget from '../../features/chatbot/ChatbotWidget'
import PanicButton from '../../features/panic/PanicButton'
import BottomNav from '../../components/layout/BottomNav'

const NAV = [
  { to: '/user/dashboard', label: 'dashboardLayout.title', icon: LayoutDashboard },
  { to: '/user/bookings', label: 'userShell.myBookings', icon: CalendarClock },
  { to: '/user/profile', label: 'userShell.profile', icon: UserCog },
]

export default function UserShellLayout() {
  const { t } = useTranslation()
  const { session, logout } = useSession()
  const navigate = useNavigate()

  function handleLogout() {
    navigate('/')
    logout()
  }

  return (
    <div className="flex min-h-svh flex-col bg-brand-50 pb-24 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/user/dashboard" className="flex shrink-0 items-center">
            <img src="/brand/wordmark.png" alt="Book My Carer" className="h-11 w-auto sm:h-12" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:text-brand-700'}`
                }
              >
                <item.icon size={16} />
                {t(item.label)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button className="rounded-full p-2 text-slate-500 hover:bg-brand-50" aria-label={t('topbar.notifications')}>
              <Bell size={19} />
            </button>
            <div className="hidden text-right lg:block">
              <p className="text-sm font-medium text-slate-800">{session?.name}</p>
              <p className="text-xs text-slate-400">{session?.phone}</p>
            </div>
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-lg p-2 text-rose-600 hover:bg-rose-50"
              aria-label={t('sidebar.logout')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget raised />
      <div className="hidden lg:block">
        <PanicButton />
      </div>
      <BottomNav
        items={[
          NAV[0],
          NAV[1],
          { key: 'panic', render: <PanicButton variant="tab" /> },
          NAV[2],
        ]}
      />
    </div>
  )
}
