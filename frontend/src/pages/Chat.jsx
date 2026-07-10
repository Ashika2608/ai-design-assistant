import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import api from '../services/api'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! Ask me about colors, fonts, layouts, captions, or branding ideas." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/chat', { message: userMsg.text })
      setMessages((m) => [...m, { role: 'assistant', text: res.data.reply }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Something went wrong, try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
      <h1 className="text-2xl font-bold mb-4">AI Chat Assistant</h1>

      <div className="flex-1 overflow-y-auto space-y-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400">AI is typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask something..."
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
        />
        <button onClick={send} className="bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
