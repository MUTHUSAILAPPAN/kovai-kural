// src/pages/auth/Login.jsx
import React, { useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await api.post('/auth/login', { email, password })
      login({ token: res.data.token, user: res.data.user })
      navigate('/')
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Sign in</h2>
        <p className="auth-subtitle">
          Welcome back. Continue where you left off in Kovai Kural.
        </p>

        {err && <div className="auth-error">{err}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-label">
            Password
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </label>

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary auth-submit">
              Login
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <span>New to Kovai Kural?</span>{' '}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
