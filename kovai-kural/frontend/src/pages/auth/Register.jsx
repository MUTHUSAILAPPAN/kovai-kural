// src/pages/auth/Register.jsx
import React, { useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './auth.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [handle, setHandle] = useState('')
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        handle,
      })
      login({ token: res.data.token, user: res.data.user })
      navigate('/')
    } catch (error) {
      setErr(error?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">
          Join Kovai Kural to report issues and follow civic updates in Coimbatore.
        </p>

        {err && <div className="auth-error">{err}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Name
            <input
              className="auth-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
            />
          </label>

          <label className="auth-label">
            Handle (unique)
            <input
              className="auth-input"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              placeholder="@freeguy"
            />
          </label>

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
              placeholder="At least 8 characters"
            />
          </label>

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary auth-submit">
              Sign up
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
