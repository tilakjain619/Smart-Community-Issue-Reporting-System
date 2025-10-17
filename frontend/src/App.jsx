import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ReportIssue from './pages/ReportIssue'
import CommunityFeed from './pages/CommunityFeed'
import Landing from './pages/Landing'
import AdminPanel from './pages/AdminPanel'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportIssue/>} />
          <Route path="/about" element={<h1 className='text-3xl font-bold underline'>About Page</h1>} />
          <Route path="/community" element={<CommunityFeed />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
