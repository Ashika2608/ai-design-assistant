import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wand2, LayoutTemplate, Images, MessageSquare, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/generate', label: 'AI Designer', icon: Wand2 },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/my-designs', label: 'My Designs', icon: Images },
  { to: '/chat', label: 'AI Chat', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
      <div className="px-6 py-5 text-lg font-bold text-brand-600">AI Design Assistant</div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-6 py-4 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  )
}
