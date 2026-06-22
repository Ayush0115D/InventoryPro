import { useState, useEffect } from 'react'
import { fetchCustomers, createCustomer, deleteCustomer } from '../api'
import { UsersIcon, PlusIcon, TrashIcon, CloseIcon } from '../components/Icons'

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

  const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Customers</h1>
          <p className="text-gray-500 text-sm mt-2">{customers.length} customer{customers.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowForm(true) }} className="btn-primary flex items-center gap-2">
          <PlusIcon /><span>Add Customer</span>
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
            <h3 className="text-lg font-semibold text-white">New Customer</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Full Name</label>
                <input name="full_name" placeholder="John Doe" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Email</label>
                <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wide">Phone</label>
                <input name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="input-field w-full" />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="btn-success flex-1">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-none">
                  <CloseIcon />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {customers.length > 0 ? (
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Customer</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Email</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest">Phone</th>
                  <th className="py-4 px-6 text-gray-500 font-medium text-xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id} className={`border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold">
                          {initials(c.full_name)}
                        </div>
                        <span className="text-gray-200 font-medium">{c.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{c.email}</td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">{c.phone}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                        <TrashIcon />
                      </button>
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
            <div className="text-gray-500"><UsersIcon /></div>
          </div>
          <h3 className="text-xl text-gray-400 font-medium mb-2">No customers yet</h3>
          <p className="text-gray-600 text-sm mb-6">Your customer directory is empty. Add your first customer.</p>
          <button onClick={() => { setForm(emptyForm); setShowForm(true) }} className="btn-primary inline-flex items-center gap-2">
            <PlusIcon /><span>Add Customer</span>
          </button>
        </div>
      )}
    </div>
  )
}
