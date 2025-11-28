// src/components/NotificationBell.jsx
import React, { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import getSocket from '../services/socket'

export default function NotificationBell() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const nav = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  useEffect(() => {
    if (!user) return
    const s = getSocket()
    if (!s) return
    const handler = (n) => {
      setItems(prev => [n, ...prev])
      setUnread(u => u + 1)
    }
    s.on('notification', handler)
    return () => s.off('notification', handler)
  }, [user])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function load() {
    try {
      const res = await api.get('/notifications?limit=10')
      const list = res.data.notifications || []
      setItems(list)
      setUnread(list.filter(n => !n.read).length)
    } catch (e) {
      console.error('load notifications', e)
    }
  }

  async function handleClickItem(n) {
    try {
      await api.post('/notifications/mark-read', { id: n._id })
      setItems(prev => prev.map(x => (x._id === n._id ? { ...x, read: true } : x)))
      setUnread(u => Math.max(0, u - (n.read ? 0 : 1)))

      if (n.entityType === 'post') {
        nav(`/post/${n.entityId}`)
      } else if (n.actor?.handle) {
        nav(`/profile/${n.actor.handle}`)
      } else {
        nav('/notifications')
      }
      setOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  if (!user) return null

  return (
    <div className="notif-root" ref={ref}>
      <button className="notif-btn" onClick={() => setOpen(o => !o)}>
        🔔
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown card">
          {items.length === 0 && <div className="muted small">No notifications yet.</div>}
          {items.map(n => (
            <button
              key={n._id}
              className={`notif-item ${n.read ? 'read' : 'unread'}`}
              onClick={() => handleClickItem(n)}
            >
              <div className="muted xsmall">
                {n.actor?.name && <strong>{n.actor.name}</strong>}{' '}
                {n.message}
              </div>
              <div className="muted xsmall">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </button>
          ))}
          <button className="notif-view-all" onClick={() => { nav('/notifications'); setOpen(false); }}>
            View all →
          </button>
        </div>
      )}
    </div>
  )
}
