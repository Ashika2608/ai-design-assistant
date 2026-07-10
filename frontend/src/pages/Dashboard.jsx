import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Images, Download, LayoutTemplate } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [designs, setDesigns] = useState([])

  useEffect(() => {
    api.get('/design/list').then((res) => setDesigns(res.data)).catch(() => {})
  }, [])

  const stats = [
    { label: 'Total Designs', value: designs.length, icon: Images },
    { label: 'This Month', value: designs.filter(d => new Date(d.created_at).getMonth() === new Date().getMonth()).length, icon: Sparkles },
    { label: 'Design Types Used', value: new Set(designs.map(d => d.design_type)).size, icon: LayoutTemplate },
  ]

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Hi {user?.full_name || 'there'} 👋</h1>
        <p className="text-gray-500 text-sm">Here's what's happening with your designs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
              </div>
              <Icon className="text-brand-500" size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/generate" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + New Design
        </Link>
        <Link to="/templates" className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
          Browse Templates
        </Link>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Recent Designs</h2>
        {designs.length === 0 ? (
          <p className="text-sm text-gray-500">No designs yet — generate your first one!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {designs.slice(0, 8).map((d) => (
              <div key={d.id} className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <img src={`http://localhost:8000${d.image_path}`} alt={d.design_type} className="w-full h-32 object-cover" />
                <div className="p-2 text-xs text-gray-500 capitalize">{d.design_type.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
