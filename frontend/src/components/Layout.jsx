import { Link, Outlet, useLocation } from 'react-router-dom'
import { GridIcon, BoxIcon, UsersIcon, ClipboardIcon } from './Icons'

const navItems = [
  { path: '/', label: 'Dashboard', icon: GridIcon },
  { path: '/products', label: 'Products', icon: BoxIcon },
  { path: '/customers', label: 'Customers', icon: UsersIcon },
  { path: '/orders', label: 'Orders', icon: ClipboardIcon },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <aside className="w-64 bg-[#0d1225] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">StockFlow</span>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">Inventory & Order Management System</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 text-amber-400 border border-amber-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                }`}
              >
                <span className={active ? 'text-amber-400' : 'text-gray-500'}>
                  <Icon />
                </span>
                <span>{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </Link>
            )
          })}
        </nav>

      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
