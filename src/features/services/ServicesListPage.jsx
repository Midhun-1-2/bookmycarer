import { categoriesApi } from '../../lib/mockApi'
import CategoryCard from '../../components/CategoryCard'

export default function ServicesListPage() {
  const categories = categoriesApi.listSync()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">All Care Services</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
        Explore every category of at-home care available on Book My Carers.
      </p>

      <div className="mt-8 flex flex-wrap gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="w-full sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(33.333%_-_0.834rem)]">
            <CategoryCard category={cat} showServices />
          </div>
        ))}
      </div>
    </div>
  )
}
