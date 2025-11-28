// src/components/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from './SearchBar'
import NotificationBell from './NotificationBell'

export default function Navbar({ theme, onToggleTheme }) {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <div>
        <div className="nav-left">
          <Link to="/" className="logo">Kovai Kural</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
        </div>

        <div className="nav-center">
          <SearchBar />
        </div>

        <div className="nav-right">
          {user && <NotificationBell />}
          {user ? (
            <>
              <Link to={`/profile/${user.handle}`} className="nav-link">
                {user.name}
              </Link>
              <button className="btn btn-ghost" onClick={logout}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
          <button
  type="button"
  className="btn-ghost small-btn"
  onClick={onToggleTheme}
>
  {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
</button>

        </div>
      </div>
    </header>
  )
}
