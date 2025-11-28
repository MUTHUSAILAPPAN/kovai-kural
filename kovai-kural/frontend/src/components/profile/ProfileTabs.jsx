// src/components/profile/ProfileTabs.jsx
import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import PostListItem from '../PostListItem'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function ProfileTabs({ profile, isOwner }) {
  const tabs = ['Saved Posts', 'Comments', 'Tagged Posts']
  const [active, setActive] = useState('Comments')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, profile])

  async function load() {
    setLoading(true)
    setError('')
    setItems([])
    try {
      if (!profile || (!profile.id && !profile._id)) {
        setItems([])
        return
      }
      const userId = profile.id || profile._id

      if (active === 'Saved Posts') {
        const res = await api.get(`/users/${userId}/saved`)
        setItems(res.data.saved || res.data.posts || [])
      } else if (active === 'Comments') {
        const res = await api.get(`/users/${userId}/comments`)
        setItems(res.data.comments || [])
      } else if (active === 'Tagged Posts') {
        const res = await api.get(`/users/${userId}/tagged`)
        setItems(res.data.posts || [])
      }
    } catch (err) {
      console.error('Load tab', err)
      setError(err?.response?.data?.message || 'Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const avatarSrc = profile.avatarUrl
    ? `${API_BASE}${profile.avatarUrl}`
    : '/default-avatar.png'

  return (
    <section className="profile-tabs card">
      {/* Tabs row */}
      <div className="tabs-row pill-tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={`tab ${t === active ? 'active' : ''}`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="tabs-body">
        {loading && <div className="muted">Loading…</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="muted">No items</div>
        )}

        <div className="tab-list">
          {active === 'Comments' ? (
            items.map(c => (
              <div key={c._id} className="activity-row card">
                <div className="activity-avatar-wrap">
                  <img
                    src={avatarSrc}
                    alt={profile.name}
                    className="activity-avatar"
                  />
                </div>

                <div className="activity-content">
                  <div className="activity-title-row">
                    <button
                      type="button"
                      className="activity-post-link"
                      onClick={() => {
                        if (!c.postId?._id) return
                        window.location.href = `/post/${c.postId._id}`
                      }}
                    >
                      {c.postId?.title || 'Unknown post'}
                    </button>
                    <div className="muted xsmall">
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="activity-snippet">
                    {c.body}
                  </div>

                  <div className="activity-actions">
                    {/* non-functional arrows for now, purely visual */}
                    <button
                      type="button"
                      className="activity-icon-btn"
                      title="Upvote"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="activity-icon-btn"
                      title="Downvote"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Saved / Tagged = reuse compact PostListItem rows
            items.map(it => (
              <div key={it._id || it.id} className="activity-row card">
                <div className="activity-avatar-wrap placeholder-circle" />
                <div className="activity-content">
                  <PostListItem item={it} compact />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
