import { useState, useEffect } from 'react'
import { fetchOrders, fetchCustomers, fetchProducts, createOrder, deleteOrder, fetchOrder } from '../api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [detail, setDetail] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ customer_id: '', product_id: '', quantity: '' })

  useEffect(() => {
    loadOrders()
    fetchCustomers().then(setCustomers).catch(() => {})
    fetchProducts().then(setProducts).catch(() => {})
  }, [])

  async function loadOrders() {
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await createOrder({
        customer_id: parseInt(form.customer_id),
        product_id: parseInt(form.product_id),
        quantity: parseInt(form.quantity),
      })
      setShowForm(false)
      setForm({ customer_id: '', product_id: '', quantity: '' })
      await loadOrders()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleView(id) {
    try {
      const data = await fetchOrder(id)
      setDetail(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Cancel this order?')) return
    try {
      await deleteOrder(id)
      setDetail(null)
      await loadOrders()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Orders</h2>
          <p className="text-gray-400 mt-1">Track and manage orders</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <span>+</span>
          <span>Create Order</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-850 border border-dark-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">New Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select name="customer_id" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
              <option value="">Select Customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
            <select name="product_id" value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.price} ({p.quantity} in stock)
                </option>
              ))}
            </select>
            <input name="quantity" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
            <div className="flex gap-2 items-end">
              <button type="submit" className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full bg-dark-700 text-gray-300 px-4 py-2.5 rounded-lg hover:bg-dark-600 transition-colors">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {detail && (
        <div className="bg-dark-850 border border-blue-500/20 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Order #{detail.id}</h3>
            <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-white transition-colors text-sm">Close</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-dark-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Customer</p>
              <p className="text-white font-medium">{detail.customer_name}</p>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Product</p>
              <p className="text-white font-medium">{detail.product_name}</p>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Quantity</p>
              <p className="text-white font-medium">{detail.quantity}</p>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total</p>
              <p className="text-emerald-400 font-bold text-lg">${detail.total_amount.toFixed(2)}</p>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                {detail.status}
              </span>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Date</p>
              <p className="text-gray-300 text-sm">{new Date(detail.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-dark-850 border border-dark-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-dark-800/50">
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Order #</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Customer</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Product</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Qty</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Total</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-dark-700 hover:bg-dark-800/30 transition-colors">
                  <td className="py-4 px-6 text-white font-mono text-sm">#{o.id}</td>
                  <td className="py-4 px-6 text-gray-300">{o.customer_id}</td>
                  <td className="py-4 px-6 text-gray-300">{o.product_id}</td>
                  <td className="py-4 px-6 text-gray-300">{o.quantity}</td>
                  <td className="py-4 px-6 text-emerald-400 font-medium">${o.total_amount.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <button onClick={() => handleView(o.id)} className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">View</button>
                      <button onClick={() => handleDelete(o.id)} className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <p className="text-4xl mb-3">📋</p>
                    <p>No orders yet. Click "Create Order" to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
