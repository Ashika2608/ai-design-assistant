import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Sidebar from './components/Sidebar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DesignGenerator from './pages/DesignGenerator.jsx'
import Templates from './pages/Templates.jsx'
import MyDesigns from './pages/MyDesigns.jsx'
import Chat from './pages/Chat.jsx'
import Settings from './pages/Settings.jsx'

function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/generate" element={<ProtectedRoute><AppLayout><DesignGenerator /></AppLayout></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><AppLayout><Templates /></AppLayout></ProtectedRoute>} />
        <Route path="/my-designs" element={<ProtectedRoute><AppLayout><MyDesigns /></AppLayout></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AppLayout><Chat /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  )
}
