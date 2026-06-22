const API_BASE = '/api'

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`)
  if (!res.ok) throw new Error('Failed to fetch dashboard data')
  return res.json()
}
