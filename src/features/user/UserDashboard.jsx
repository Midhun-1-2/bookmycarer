import { categoriesApi } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import CategoryCard from '../../components/CategoryCard'

export default function UserDashboard() {
  const { session } = useSession()
  const categories = categoriesApi.listSync()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {session?.name?.split(' ')[0] ?? 'there'}</h1>
      <p className="mt-1 text-sm text-slate-500">What kind of care do you need today?</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}
