import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'


export default function App() {
const { user } = useAuth()


return (
<div className="app-root">
<Navbar />
<main className="container">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
<Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />


<Route
path="/profile/:handle"
element={
<ProtectedRoute>
<Profile />
</ProtectedRoute>
}
/>


<Route path="*" element={<div>Not found</div>} />
</Routes>
</main>
</div>
)
}