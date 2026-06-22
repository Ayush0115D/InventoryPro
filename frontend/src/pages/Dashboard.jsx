import { useState, useEffect } from 'react'
import { fetchDashboard } from '../api'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-400 text-lg">Error: {error}</p>
    </div>
  )
  if (!data) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  const cards = [
    { label: 'Total Products', value: data.total_products, icon: '📦', color: 'from-blue-500 to-blue-700', border: 'border-blue-500/20' },
    { label: 'Total Customers', value: data.total_customers, icon: '👥', color: 'from-emerald-500 to-emerald-700', border: 'border-emerald-500/20' },
    { label: 'Total Orders', value: data.total_orders, icon: '📋', color: 'from-purple-500 to-purple-700', border: 'border-purple-500/20' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 mt-1">Overview of your inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`bg-dark-850 rounded-xl border ${card.border} p-6 hover:border-opacity-50 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${card.color}`}></div>
            </div>
            <p className="text-4xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-gray-400 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="bg-dark-850 rounded-xl border border-red-500/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-700 flex items-center gap-2">
            <span className="text-red-400 text-lg">⚠️</span>
            <h3 className="text-lg font-semibold text-red-400">Low Stock Products (&lt; 10)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-dark-800/50">
                  <th className="py-3 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Name</th>
                  <th className="py-3 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">SKU</th>
                  <th className="py-3 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_products.map((p, i) => (
                  <tr key={p.id} className="border-t border-dark-700 hover:bg-dark-800/30 transition-colors">
                    <td className="py-3 px-6 text-gray-300">{p.name}</td>
                    <td className="py-3 px-6 text-gray-400 font-mono text-sm">{p.sku}</td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        {p.quantity} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.low_stock_products.length === 0 && (
        <div className="bg-dark-850 rounded-xl border border-emerald-500/20 p-8 text-center">
          <span className="text-4xl">✅</span>
          <p className="text-emerald-400 mt-3 font-medium">All products are well stocked</p>
        </div>
      )}
    </div>
  )
}
