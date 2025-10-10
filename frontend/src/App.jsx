import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ReportIssue from './pages/ReportIssue'
import CommunityFeed from './pages/CommunityFeed'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1 className='text-3xl font-bold underline'>Home Page</h1>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue/>} />
        <Route path="/about" element={<h1 className='text-3xl font-bold underline'>About Page</h1>} />
        <Route path="/community" element={<CommunityFeed />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
