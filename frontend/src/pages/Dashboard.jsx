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
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header Skeleton */}
        <div className="mb-10">
          <div className="h-10 w-64 rounded-2xl bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 animate-pulse mb-4" />
          <div className="h-4 w-96 rounded-lg bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { glow: 'glow-blue', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
            { glow: 'glow-emerald', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
            { glow: 'glow-purple', bg: 'bg-purple-500/5', border: 'border-purple-500/10' },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.glow} relative overflow-hidden rounded-2xl ${card.bg} border ${card.border} p-6`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-10 w-24 rounded-xl bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 animate-pulse mb-3" />
                  <div className="h-3 w-32 rounded-lg bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 animate-pulse" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 animate-pulse" />
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-surface-600 to-surface-700 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Alert Section Skeleton */}
        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] overflow-hidden animate-pulse">
          <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500/20 to-red-500/10" />
            <div className="flex-1">
              <div className="h-4 w-40 rounded-lg bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 mb-2" />
              <div className="h-3 w-56 rounded-lg bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700" />
            </div>
          </div>
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-3 gap-6">
                <div className="h-4 rounded-lg bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700" />
                <div className="h-4 rounded-lg bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700" />
                <div className="h-4 rounded-lg bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Loading Message */}
        <div className="flex items-center justify-center gap-3 mt-8 pt-4 border-t border-white/5">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-gray-400 text-sm font-medium">Loading dashboard data from Render...</p>
        </div>
      </div>
    )
  }

  const cards = [
    { label: 'Total Products', value: data.total_products, icon: BoxIcon, glow: 'glow-blue', accent: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
    { label: 'Total Customers', value: data.total_customers, icon: UsersIcon, glow: 'glow-emerald', accent: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
    { label: 'Total Orders', value: data.total_orders, icon: ClipboardIcon, glow: 'glow-purple', accent: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/10' },
  ]

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-sm">Real-time overview of your inventory operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`${card.glow} relative overflow-hidden rounded-2xl ${card.bg} border ${card.border} p-6 group hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}>
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
        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
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
        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] p-10 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircleIcon />
          </div>
          <p className="text-emerald-400 text-lg font-medium">All clear</p>
          <p className="text-gray-500 text-sm mt-1">Every product is sufficiently stocked</p>
        </div>
      )}

      {data.total_products === 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center animate-in fade-in slide-in-from-bottom-4">
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