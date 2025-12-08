import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './admin.css'

export default function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/')
      return
    }
    loadData()
  }, [user, navigate])

  async function loadData() {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        api.get('/users/analytics'),
        api.get('/users/all')
      ])
      setAnalytics(analyticsRes.data)
      setUsers(usersRes.data.users || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function handlePromote(userId, userName) {
    if (!window.confirm(`Promote ${userName} to moderator?`)) return
    try {
      await api.post(`/users/${userId}/promote`)
      loadData()
      alert('User promoted successfully!')
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to promote user')
    }
  }

  if (loading) return <div className="loading-state">Loading admin panel...</div>
  if (error) return <div className="error-state">{error}</div>

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Overview and management of Kovai Kural</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{analytics.totalUsers}</div>
          <div className="stat-label">Registered members</div>
        </div>
        <div className="stat-card">
          <h3>Total Posts</h3>
          <div className="stat-value">{analytics.totalPosts}</div>
          <div className="stat-label">Community posts</div>
        </div>
        <div className="stat-card">
          <h3>Total Comments</h3>
          <div className="stat-value">{analytics.totalComments}</div>
          <div className="stat-label">User interactions</div>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <div className="stat-value">{analytics.totalCategories}</div>
          <div className="stat-label">Active categories</div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-card">
          <h2>Recent Users</h2>
          {analytics.recentUsers.map(u => (
            <div key={u._id} className="list-item">
              <div className="list-item-info">
                <h4>{u.name}</h4>
                <p>@{u.handle}</p>
              </div>
              <div className="list-item-meta">
                {new Date(u.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h2>Recent Posts</h2>
          {analytics.recentPosts.map(p => (
            <div key={p._id} className="list-item">
              <div className="list-item-info">
                <h4>{p.title}</h4>
                <p>by @{p.author?.handle}</p>
              </div>
              <div className="list-item-meta">
                {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h2>Top Contributors</h2>
          {analytics.topUsers.map((u, idx) => (
            <div key={u._id} className="list-item">
              <div className="list-item-info">
                <h4>#{idx + 1} {u.name}</h4>
                <p>@{u.handle}</p>
              </div>
              <div className="list-item-meta">
                {u.points} points
              </div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h2>Posts by Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <span>Open</span>
              <span>{analytics.postsByStatus.OPEN || 0}</span>
            </div>
            <div className="status-item">
              <span>Resolved</span>
              <span>{analytics.postsByStatus.RESOLVED || 0}</span>
            </div>
            <div className="status-item">
              <span>Flagged</span>
              <span>{analytics.postsByStatus.FLAGGED || 0}</span>
            </div>
            <div className="status-item">
              <span>Invalid</span>
              <span>{analytics.postsByStatus.INVALID || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="users-table-section">
        <h2>All Users ({users.length})</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Handle</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>@{u.handle}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role.toLowerCase()}`}>
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role === 'PUBLIC' && (
                    <button
                      className="btn-promote"
                      onClick={() => handlePromote(u._id, u.name)}
                    >
                      Make Moderator
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
