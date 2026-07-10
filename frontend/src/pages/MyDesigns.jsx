import { useEffect, useState } from 'react'
import { Trash2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function MyDesigns() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/design/list').then((res) => setDesigns(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/design/${id}`)
      setDesigns((d) => d.filter((x) => x.id !== id))
      toast.success('Design deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) return <div className="p-10 text-sm text-gray-500">Loading...</div>

  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="text-2xl font-bold">My Designs</h1>

      {designs.length === 0 ? (
        <p className="text-sm text-gray-500">No designs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {designs.map((d) => (
            <div key={d.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
              <img src={`http://localhost:8000${d.image_path}`} alt={d.design_type} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-xs text-gray-500 capitalize">{d.design_type.replace('_', ' ')}</p>
                <p className="text-sm font-medium truncate">{d.prompt}</p>
                <div className="flex items-center justify-between mt-3">
                  <a href={`http://localhost:8000${d.image_path}`} download className="text-brand-600 text-sm flex items-center gap-1">
                    <Download size={14} /> Download
                  </a>
                  <button onClick={() => handleDelete(d.id)} className="text-red-500 text-sm flex items-center gap-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
