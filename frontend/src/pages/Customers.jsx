import { useState, useEffect } from 'react'
import { fetchCustomers, createCustomer, deleteCustomer } from '../api'

const emptyForm = { full_name: '', email: '', phone: '' }

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => { loadCustomers() }, [])

  async function loadCustomers() {
    try {
      const data = await fetchCustomers()
      setCustomers(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await createCustomer(form)
      setShowForm(false)
      setForm(emptyForm)
      await loadCustomers()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this customer?')) return
    try {
      await deleteCustomer(id)
      await loadCustomers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Customers</h2>
          <p className="text-gray-400 mt-1">Manage your customer base</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setShowForm(true) }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <span>+</span>
          <span>Add Customer</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-850 border border-dark-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">New Customer</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="bg-dark-800 border border-dark-600 text-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
            <div className="flex gap-2 items-end">
              <button type="submit" className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full bg-dark-700 text-gray-300 px-4 py-2.5 rounded-lg hover:bg-dark-600 transition-colors">Cancel</button>
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
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Email</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Phone</th>
                <th className="py-3.5 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-dark-700 hover:bg-dark-800/30 transition-colors">
                  <td className="py-4 px-6 text-white font-medium">{c.full_name}</td>
                  <td className="py-4 px-6 text-gray-400">{c.email}</td>
                  <td className="py-4 px-6 text-gray-400 font-mono text-sm">{c.phone}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    <p className="text-4xl mb-3">👥</p>
                    <p>No customers yet. Click "Add Customer" to get started.</p>
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
