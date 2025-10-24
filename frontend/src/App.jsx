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
import ManageIssues from './pages/ManageIssues'
import ManageOfficers from './pages/ManageOfficers'
import Logs from './pages/Logs'
import NotFound from './pages/NotFound'
// import { useAuth } from './contexts/AuthContext'
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InnerApp />
      </BrowserRouter>
    </AuthProvider>
  )
}

const InnerApp = () => {
  // const { isAdmin } = useAuth();
  // const admin = isAdmin();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue/>} />
        <Route path="/about" element={<h1 className='text-3xl font-bold underline'>About Page</h1>} />
        <Route path="/community" element={<CommunityFeed />} />
        <Route path="/admin/dashboard" element={<AdminPanel />} />
        <Route path="/admin/issues" element={<ManageIssues />} />
        <Route path="/admin/officers" element={<ManageOfficers />} />
        <Route path="/admin/logs" element={<Logs />} />
        <Route path="/*" element={<NotFound />} /> 
      </Routes>
    </>
  );
}

export default App
