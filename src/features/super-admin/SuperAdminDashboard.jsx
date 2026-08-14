import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, FolderKanban, ClipboardList, IndianRupee, ShieldCheck, ArrowRight } from 'lucide-react'
import { staffApi, categoriesApi, bookingsApi, adminsApi, usersApi } from '../../lib/mockApi'
import { revenueByDay, bookingsByCategory, bookingsByStatus } from '../../lib/chartData'
import Card from '../../components/ui/Card'
import RevenueTrendChart from '../../components/charts/RevenueTrendChart'
import CategoryDonutChart from '../../components/charts/CategoryDonutChart'
import StatusBarChart from '../../components/charts/StatusBarChart'
import StaffBarChart from '../../components/charts/StaffBarChart'

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [charts, setCharts] = useState(null)

  useEffect(() => {
    async function load() {
      const [staff, categories, bookings, admins, users] = await Promise.all([
        staffApi.list(),
        categoriesApi.list(),
        bookingsApi.list(),
        adminsApi.list(),
        usersApi.list(),
      ])
      const revenue = bookings
        .filter((b) => b.payment.status === 'paid')
        .reduce((sum, b) => sum + b.payment.amount, 0)
      setStats({
        staffCount: staff.length,
        categoryCount: categories.length,
        adminCount: admins.filter((a) => a.role === 'admin').length,
        totalBookings: bookings.length,
        revenue,
      })
      setCharts({
        revenue: revenueByDay(bookings, 30),
        byCategory: bookingsByCategory(bookings, categories),
        byStatus: bookingsByStatus(bookings),
        byRole: [
          { name: 'Users', value: users.length },
          { name: 'Staff', value: staff.length },
          { name: 'Admins', value: admins.filter((a) => a.role === 'admin').length },
          { name: 'Super Admins', value: admins.filter((a) => a.role === 'super-admin').length },
        ],
      })
    }
    load()
  }, [])

  if (!stats || !charts) return null

  const cards = [
    { label: 'Admin accounts', value: stats.adminCount, icon: ShieldCheck, to: '/super-admin/admins' },
    { label: 'Staff accounts', value: stats.staffCount, icon: Users, to: '/admin/staff' },
    { label: 'Service categories', value: stats.categoryCount, icon: FolderKanban, to: '/admin/categories' },
    { label: 'Total bookings', value: stats.totalBookings, icon: ClipboardList, to: '/admin/bookings' },
    { label: 'Revenue collected', value: `₹${stats.revenue}`, icon: IndianRupee, to: '/admin/bookings' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Super Admin overview</h1>
      <p className="mt-1 text-sm text-slate-500">Full platform visibility and control.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="transition-shadow hover:shadow-md hover:shadow-brand-900/10">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Icon size={19} />
                </div>
                <ArrowRight size={15} className="text-brand-300" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">Platform revenue — last 30 days</h3>
          <RevenueTrendChart data={charts.revenue} />
        </Card>
        <Card animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">Bookings by category</h3>
          <CategoryDonutChart data={charts.byCategory} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">Bookings by status</h3>
          <StatusBarChart data={charts.byStatus} />
        </Card>
        <Card animate={false}>
          <h3 className="text-sm font-semibold text-slate-900">Platform composition</h3>
          <StaffBarChart data={charts.byRole} />
        </Card>
      </div>
    </div>
  )
}
