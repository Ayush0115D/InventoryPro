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
    setForm({ name: product.name, sku: product.sku, price: String(product.price), quantity: String(product.quantity) })
    setEditing(product.id)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = { name: form.name, sku: form.sku, price: parseFloat(form.price), quantity: parseInt(form.quantity) }
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
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <button onClick={openAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Product
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="border p-2 rounded" />
          <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required className="border p-2 rounded" />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required className="border p-2 rounded" />
          <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required className="border p-2 rounded" />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              {editing ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{p.name}</td>
                <td className="py-3 px-4">{p.sku}</td>
                <td className="py-3 px-4">${p.price.toFixed(2)}</td>
                <td className="py-3 px-4">{p.quantity}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="5" className="py-4 text-center text-gray-500">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
