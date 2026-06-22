import { useState, useEffect } from 'react'
import { fetchDashboard } from '../api'
import { AlertIcon, BoxIcon, UsersIcon, ClipboardIcon, CheckCircleIcon } from '../components/Icons'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertIcon />
        </div>
        <p className="text-red-400 text-lg font-medium">{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-4 w-72 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-2xl mt-8" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Products', value: data.total_products, icon: BoxIcon, glow: 'glow-blue', accent: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
    { label: 'Total Customers', value: data.total_customers, icon: UsersIcon, glow: 'glow-emerald', accent: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
    { label: 'Total Orders', value: data.total_orders, icon: ClipboardIcon, glow: 'glow-purple', accent: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/10' },
  ]

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-sm">Real-time overview of your inventory operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`${card.glow} relative overflow-hidden rounded-2xl ${card.bg} border ${card.border} p-6 group hover:scale-[1.02] transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-4xl font-bold text-white tracking-tight mb-1">{card.value}</p>
                  <p className="text-gray-500 text-sm">{card.label}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center ${card.accent}`}>
                  <Icon />
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full w-full rounded-full bg-gradient-to-r from-transparent ${card.accent.replace('text-', 'to-')} transition-all duration-700`} style={{ width: `${Math.min((data.total_products > 0 ? card.value / data.total_products : 1) * 100, 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertIcon />
            </div>
            <div>
              <h3 className="text-base font-semibold text-red-400">Low Stock Alert</h3>
              <p className="text-xs text-gray-500">{data.low_stock_products.length} product{data.low_stock_products.length > 1 ? 's' : ''} below minimum threshold</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-3.5 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Product</th>
                  <th className="py-3.5 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">SKU</th>
                  <th className="py-3.5 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">In Stock</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_products.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 text-gray-300 font-medium">{p.name}</td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">{p.sku}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        {p.quantity} remaining
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.total_products > 0 && data.low_stock_products.length === 0 && (
        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircleIcon />
          </div>
          <p className="text-emerald-400 text-lg font-medium">All clear</p>
          <p className="text-gray-500 text-sm mt-1">Every product is sufficiently stocked</p>
        </div>
      )}

      {data.total_products === 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 mx-auto mb-4">
            <BoxIcon />
          </div>
          <p className="text-gray-400 text-lg font-medium">No products yet</p>
          <p className="text-gray-600 text-sm mt-1">Add your first product to start tracking inventory</p>
        </div>
      )}
    </div>
  )
}
