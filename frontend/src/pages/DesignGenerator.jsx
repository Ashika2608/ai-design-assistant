import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Wand2, Download, Loader2 } from 'lucide-react'
import api from '../services/api'

const DESIGN_TYPES = [
  { value: 'poster', label: 'Poster' },
  { value: 'instagram_post', label: 'Instagram Post' },
  { value: 'business_card', label: 'Business Card' },
  { value: 'thumbnail', label: 'YouTube Thumbnail' },
]

export default function DesignGenerator() {
  const location = useLocation()
  const prefill = location.state || {}

  const [prompt, setPrompt] = useState(prefill.prompt || '')
  const [designType, setDesignType] = useState(prefill.design_type || 'poster')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // Whenever we navigate here again with new state (e.g. clicking a
  // different template), sync the form fields. useState's initial value
  // only applies on first mount, so without this the form gets "stuck"
  // on whatever prompt was used the first time this page was opened.
  useEffect(() => {
    if (location.state) {
      setPrompt(location.state.prompt || '')
      setDesignType(location.state.design_type || 'poster')
    }
  }, [location.state])

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return toast.error('Enter a prompt first')
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/design/generate', { prompt, design_type: designType })
      setResult(res.data)
      toast.success('Design generated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Wand2 size={22} className="text-brand-600" /> AI Design Generator</h1>
        <p className="text-gray-500 text-sm">Describe what you want. AI enhances your prompt, plans the design, and renders it.</p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <div>
          <label className="text-sm font-medium">Design Type</label>
          <select
            value={designType}
            onChange={(e) => setDesignType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
          >
            {DESIGN_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Your Prompt</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Create a modern technology poster with blue gradient"
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
          {loading ? 'Generating...' : 'Generate Design'}
        </button>
      </form>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <img
            src={`http://localhost:8000${result.image_path}`}
            alt="Generated design"
            className="rounded-lg max-w-full mx-auto shadow-md"
          />
          <p className="text-sm text-gray-500 mt-3"><strong>Enhanced prompt:</strong> {result.enhanced_prompt}</p>
          <a
            href={`http://localhost:8000${result.image_path}`}
            download
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline"
          >
            <Download size={16} /> Download PNG
          </a>
        </div>
      )}
    </div>
  )
}

