import { useState, useEffect } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api'

const emptyForm = { name: '', sku: '', price: '', quantity: '' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    }
  }

  function openAdd() {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(product) {
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity: String(product.quantity),
    })
    setEditing(product.id)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      }
      if (editing) {
        await updateProduct(editing, payload)
      } else {
        await createProduct(payload)
      }
      setShowForm(false)
      setEditing(null)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Products</h2>
          <p className="text-gray-400 mt-1">Manage your product catalog</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
          <span>+</span>
          <span>Add Product</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-850 border border-dark-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">{editing ? 'Edit Product' : 'New Product'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input name="name" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
            <input name="sku" placeholder="SKU Code" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
            <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
            <div className="flex gap-2 items-end">
              <button type="submit" className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium">
                {editing ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full bg-dark-700 text-gray-300 px-4 py-2.5 rounded-lg hover:bg-dark-600 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-dark-850 border border-dark-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-dark-800/50">
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Name</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">SKU</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Price</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Quantity</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-dark-700 hover:bg-dark-800/30 transition-colors">
                  <td className="py-4 px-6 text-white font-medium">{p.name}</td>
                  <td className="py-4 px-6 text-gray-400 font-mono text-sm">{p.sku}</td>
                  <td className="py-4 px-6 text-emerald-400 font-medium">${p.price.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.quantity < 10 ? 'bg-red-500/10 text-red-400' : 'bg-dark-700 text-gray-300'
                    }`}>
                      {p.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <p className="text-4xl mb-3">📦</p>
                    <p>No products yet. Click "Add Product" to get started.</p>
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
