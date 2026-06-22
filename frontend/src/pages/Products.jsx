import { useState, useEffect } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api'
import { BoxIcon, PlusIcon, EditIcon, TrashIcon, CloseIcon, SearchIcon } from '../components/Icons'

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
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-2">{products.length} product{products.length !== 1 ? 's' : ''} in catalog</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <PlusIcon /><span>Add Product</span>
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
            <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Product Name</label>
                <input name="name" placeholder="e.g. Wireless Mouse" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field w-full" />
              </div>
              <div className="lg:col-span-1">
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">SKU Code</label>
                <input name="sku" placeholder="e.g. WM-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required className="input-field w-full" />
              </div>
              <div className="lg:col-span-1">
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Price ($)</label>
                <input name="price" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input-field w-full" />
              </div>
              <div className="lg:col-span-1">
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Quantity</label>
                <input name="quantity" type="number" placeholder="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="input-field w-full" />
              </div>
              <div className="lg:col-span-1 flex items-end gap-2">
                <button type="submit" className="btn-success flex-1">
                  {editing ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-none">
                  <CloseIcon />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {products.length > 0 ? (
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Product</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">SKU</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Price</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Stock</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={`border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400/50">
                          <BoxIcon />
                        </div>
                        <span className="text-gray-200 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">{p.sku}</span>
                    </td>
                    <td className="py-4 px-6 text-amber-400 font-medium">${p.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                        p.quantity < 10
                          ? 'bg-red-500/10 text-red-400 border border-red-500/10'
                          : p.quantity < 50
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.quantity < 10 ? 'bg-red-400' : p.quantity < 50 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        {p.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Edit">
                          <EditIcon />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5">
            <div className="text-gray-500"><BoxIcon /></div>
          </div>
          <h3 className="text-xl text-gray-400 font-medium mb-2">No products yet</h3>
          <p className="text-gray-600 text-sm mb-6">Your product catalog is empty. Start by adding your first product.</p>
          <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
            <PlusIcon /><span>Add Product</span>
          </button>
        </div>
      )}
    </div>
  )
}
