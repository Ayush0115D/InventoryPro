const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`)
  if (!res.ok) throw new Error('Failed to fetch dashboard data')
  return res.json()
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function createProduct(product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to create product')
  }
  return res.json()
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to update product')
  }
  return res.json()
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to delete product')
  }
}

export async function fetchCustomers() {
  const res = await fetch(`${API_BASE}/customers`)
  if (!res.ok) throw new Error('Failed to fetch customers')
  return res.json()
}

export async function createCustomer(customer) {
  const res = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to create customer')
  }
  return res.json()
}

export async function deleteCustomer(id) {
  const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to delete customer')
  }
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`)
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

export async function fetchOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`)
  if (!res.ok) throw new Error('Failed to fetch order')
  return res.json()
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to create order')
  }
  return res.json()
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to delete order')
  }
}
