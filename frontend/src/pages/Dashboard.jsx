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

  if (error) return <p className="text-red-500">Error: {error}</p>
  if (!data) return <p className="text-gray-500">Loading...</p>

  const cards = [
    { label: 'Total Products', value: data.total_products, color: 'bg-blue-500' },
    { label: 'Total Customers', value: data.total_customers, color: 'bg-green-500' },
    { label: 'Total Orders', value: data.total_orders, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-2 ${card.color}`}>
              {card.label}
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Low Stock Products (&lt; 10)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">SKU</th>
                  <th className="py-2 px-4">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{p.name}</td>
                    <td className="py-2 px-4">{p.sku}</td>
                    <td className="py-2 px-4 text-red-600 font-medium">{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
