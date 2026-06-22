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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
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
    if (!confirm('Are you sure you want to cancel this order?')) return
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Order
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <select name="customer_id" value={form.customer_id} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Select Customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
          <select name="product_id" value={form.product_id} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Select Product</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} (${p.price} - {p.quantity} in stock)</option>)}
          </select>
          <input name="quantity" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={handleChange} required className="border p-2 rounded" />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      )}

      {detail && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order #{detail.id}</h3>
            <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-700">Close</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Customer:</strong> {detail.customer_name}</p>
            <p><strong>Product:</strong> {detail.product_name}</p>
            <p><strong>Quantity:</strong> {detail.quantity}</p>
            <p><strong>Total:</strong> ${detail.total_amount.toFixed(2)}</p>
            <p><strong>Status:</strong> {detail.status}</p>
            <p><strong>Date:</strong> {new Date(detail.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Product ID</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">#{o.id}</td>
                <td className="py-3 px-4">{o.customer_id}</td>
                <td className="py-3 px-4">{o.product_id}</td>
                <td className="py-3 px-4">{o.quantity}</td>
                <td className="py-3 px-4">${o.total_amount.toFixed(2)}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={() => handleView(o.id)} className="text-blue-600 hover:text-blue-800">View</button>
                  <button onClick={() => handleDelete(o.id)} className="text-red-600 hover:text-red-800">Cancel</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" className="py-4 text-center text-gray-500">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
