import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/templates').then((res) => setTemplates(res.data)).catch(() => {})
  }, [])

  const useTemplate = (tpl) => {
    navigate('/generate', { state: { prompt: tpl.prompt, design_type: tpl.design_type } })
  }

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Templates</h1>
        <p className="text-gray-500 text-sm">Pick a starting point, then customize the prompt.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <span className="text-xs uppercase tracking-wide text-brand-600 font-semibold">{tpl.design_type.replace('_', ' ')}</span>
            <h3 className="font-semibold mt-1">{tpl.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tpl.prompt}</p>
            <button
              onClick={() => useTemplate(tpl)}
              className="mt-4 text-sm font-medium text-brand-600 hover:underline"
            >
              Use this template →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
