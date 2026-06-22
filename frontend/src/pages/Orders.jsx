import { useState, useEffect } from 'react'
import { fetchOrders, fetchCustomers, fetchProducts, createOrder, deleteOrder, fetchOrder } from '../api'
import { useToast } from '../components/Toast'
import { ClipboardIcon, PlusIcon, EyeIcon, TrashIcon, CloseIcon, SearchIcon } from '../components/Icons'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [detail, setDetail] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ customer_id: '', product_id: '', quantity: '' })
  const [search, setSearch] = useState('')
  const toast = useToast()

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

  const filtered = orders.filter(o => {
    if (!search) return true
    const customerName = customers.find(c => c.id === o.customer_id)?.full_name || ''
    const productName = products.find(p => p.id === o.product_id)?.name || ''
    return customerName.toLowerCase().includes(search.toLowerCase()) ||
           productName.toLowerCase().includes(search.toLowerCase()) ||
           `#${o.id}`.includes(search)
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await createOrder({
        customer_id: parseInt(form.customer_id),
        product_id: parseInt(form.product_id),
        quantity: parseInt(form.quantity),
      })
      toast('Order created successfully')
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
    try {
      await deleteOrder(id)
      toast('Order cancelled', 'error')
      setDetail(null)
      await loadOrders()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-2">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <PlusIcon /><span>Create Order</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 text-red-400 px-5 py-3.5 rounded-xl mb-6 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">New Order</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300 transition-colors"><CloseIcon /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Customer</label>
                <select name="customer_id" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required className="input-field w-full">
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Product</label>
                <select name="product_id" value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required className="input-field w-full">
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — ${p.price} ({p.quantity} avail.)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Quantity</label>
                <input name="quantity" type="number" min="1" placeholder="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="input-field w-full" />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="btn-success flex-1">Create</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-none"><CloseIcon /></button>
              </div>
            </div>
          </form>
        </div>
      )}

      {detail && (
        <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400"><ClipboardIcon /></div>
              <h3 className="text-lg font-semibold text-white">Order <span className="text-amber-400">#{detail.id}</span></h3>
            </div>
            <button onClick={() => setDetail(null)} className="btn-secondary text-sm !px-3 !py-1.5 flex items-center gap-1"><CloseIcon /> <span className="text-xs">Close</span></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Customer', value: detail.customer_name },
              { label: 'Product', value: detail.product_name },
              { label: 'Quantity', value: detail.quantity },
              { label: 'Total', value: `$${detail.total_amount.toFixed(2)}`, highlight: true },
              { label: 'Status', value: <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{detail.status}</span> },
              { label: 'Date', value: new Date(detail.created_at).toLocaleString() },
            ].map((item) => (
              <div key={item.label} className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">{item.label}</p>
                <p className={`text-white font-medium ${item.highlight ? 'text-2xl text-amber-400' : ''}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-4 flex items-center text-gray-500"><SearchIcon /></div>
          <input placeholder="Search orders by customer, product, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field w-full pl-11" />
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Order</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Customer</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Product</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Qty</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Total</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <tr key={o.id} className={`border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-4 px-6"><span className="font-mono text-sm text-amber-400 font-medium">#{o.id}</span></td>
                    <td className="py-4 px-6 text-gray-300">{customers.find(c => c.id === o.customer_id)?.full_name || `ID: ${o.customer_id}`}</td>
                    <td className="py-4 px-6 text-gray-300">{products.find(p => p.id === o.product_id)?.name || `ID: ${o.product_id}`}</td>
                    <td className="py-4 px-6 text-gray-400">{o.quantity}</td>
                    <td className="py-4 px-6 text-amber-400 font-medium">${o.total_amount.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleView(o.id)} className="p-2 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="View details"><EyeIcon /></button>
                        <button onClick={() => handleDelete(o.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Cancel order"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
          <p className="text-gray-500">No orders match "{search}"</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5"><div className="text-gray-500"><ClipboardIcon /></div></div>
          <h3 className="text-xl text-gray-400 font-medium mb-2">No orders yet</h3>
          <p className="text-gray-600 text-sm mb-6">No orders have been placed yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2"><PlusIcon /><span>Create Order</span></button>
        </div>
      )}
    </div>
  )
}
