// src/App.jsx
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home' // optional
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Feed from './pages/Feed'
import Categories from './pages/Categories'
import ProfilePage from './pages/ProfilePage'
import CategoryPage from './pages/CategoryPage'
import SearchResults from './pages/SearchResults'
import NotificationsPage from './pages/NotificationsPage'
import PostPage from './pages/PostPage'
import { connectSocket } from './services/socket'

export default function App() {
  const { user } = useAuth()

  // THEME STATE
  const [theme, setTheme] = useState(
    () => localStorage.getItem('kk_theme') || 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('kk_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // SOCKET NOTIFICATIONS
  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('kk_token')
    if (!token) return

    const s = connectSocket(token)
    s.on('notification', (n) => {
      console.log('🔔 notification', n)
      // later: push to a notifications context/store
    })

    return () => {
      s.off('notification')
    }
  }, [user])

  // SINGLE RETURN
  return (
    <div className="app-root">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Feed />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />

          {/* Public profile view */}
          <Route path="/profile/:handle" element={<ProfilePage />} />

          {/* If you still want the old Profile component under auth:
          <Route
            path="/profile/:handle/edit"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          */}

          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryPage />} />

          {/* New pages */}
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/post/:id" element={<PostPage />} />

          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  )
}
