// src/pages/NotificationsPage.jsx
import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function NotificationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/notifications?limit=50')
      setItems(res.data.notifications || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function markAllRead() {
    try {
      await api.post('/notifications/mark-read', {})
      setItems(prev => prev.map(n => ({ ...n, read: true })))
    } catch (e) {
      console.error(e)
    }
  }

  function open(n) {
    if (n.entityType === 'post') nav(`/post/${n.entityId}`)
    else if (n.actor?.handle) nav(`/profile/${n.actor.handle}`)
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notifications</h1>
        <button className="btn btn-ghost" onClick={markAllRead}>Mark all read</button>
      </div>

      {loading && <div className="muted">Loading…</div>}
      {!loading && items.length === 0 && <div className="muted">No notifications.</div>}

      <div className="notif-list">
        {items.map(n => (
          <div
            key={n._id}
            className={`card notif-row ${n.read ? 'read' : 'unread'}`}
            onClick={() => open(n)}
            style={{ marginBottom: 10, cursor: 'pointer' }}
          >
            <div className="muted small">
              {n.actor?.name && <strong>{n.actor.name}</strong>} {n.message}
            </div>
            <div className="muted xsmall">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
