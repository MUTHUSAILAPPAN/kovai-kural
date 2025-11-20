import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Feed from './pages/Feed'
import Categories from './pages/Categories'
import ProfilePage from './pages/ProfilePage'
import CategoryPage from './pages/CategoryPage'
import { connectSocket } from './services/socket'

export default function App() {
  const auth = useAuth()

  // ✅ socket connection INSIDE the component
  useEffect(() => {
    if (auth.user && auth.user && auth.user.id) {
      const s = connectSocket(localStorage.getItem('kk_token'))
      s.on('notification', (n) => {
        console.log("🔔 New Notification:", n)
      })
    }
  }, [auth.user])

  return (
    <div className="app-root">
      <Navbar />
      <main className="container">
        <Routes>

          <Route path="/" element={<Feed />} />
          <Route path="/login" element={auth.user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={auth.user ? <Navigate to="/" /> : <Register />} />

          <Route path="/profile/:handle" element={<ProfilePage />} />
          <Route
            path="/profile/:handle"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryPage />} />

          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  )
}
