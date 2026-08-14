import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HeartHandshake, Menu, X, LogOut, Bell } from 'lucide-react'
import { useSession } from '../../lib/session'
import Footer from '../../components/layout/Footer'
import ChatbotWidget from '../../features/chatbot/ChatbotWidget'
import PanicButton from '../../features/panic/PanicButton'

const NAV = [
  { to: '/user/dashboard', label: 'Browse Services' },
  { to: '/user/bookings', label: 'My Bookings' },
  { to: '/user/profile', label: 'Profile' },
]

export default function UserShellLayout() {
  const { session, logout } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-svh flex-col bg-brand-50">
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/user/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <HeartHandshake size={18} />
            </div>
            <span className="text-base font-semibold text-slate-900">Book My Carers</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:text-brand-700'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button className="rounded-full p-2 text-slate-500 hover:bg-brand-50" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">{session?.name}</p>
              <p className="text-xs text-slate-400">{session?.phone}</p>
            </div>
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-lg p-2 text-rose-600 hover:bg-rose-50"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>

          <button className="rounded-lg p-2 text-slate-600 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-brand-950/40" onClick={() => setMobileOpen(false)} />
              <motion.div
                className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white p-5 shadow-xl"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">Menu</span>
                  <button onClick={() => setMobileOpen(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-brand-50">
                    <X size={18} />
                  </button>
                </div>
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-brand-50'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={17} />
                  Log out
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
      <PanicButton />
    </div>
  )
}
