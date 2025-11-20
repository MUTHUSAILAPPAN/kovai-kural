// frontend/src/components/profile/ProfileTabs.jsx
import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import PostListItem from '../PostListItem'

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
      if (!profile || !profile.id && !profile._id) {
        setItems([])
        return
      }
      const userId = profile.id || profile._id

      if (active === 'Saved Posts') {
        // GET /api/users/:id/saved
        const res = await api.get(`/users/${userId}/saved`)
        setItems(res.data.saved || [])
      } else if (active === 'Comments') {
        // GET /api/users/:id/comments
        const res = await api.get(`/users/${userId}/comments`)
        // returns { comments: [...] } with comment.postId populated (title)
        setItems(res.data.comments || [])
      } else if (active === 'Tagged Posts') {
        // GET /api/users/:id/tagged
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

  return (
    <section className="profile-tabs card">
      <div className="tabs-row">
        {tabs.map(t => (
          <button key={t} className={`tab ${t === active ? 'active' : ''}`} onClick={() => setActive(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="tabs-body">
        {loading && <div className="muted">Loading…</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && items.length === 0 && <div className="muted">No items</div>}

        <div className="tab-list">
          {active === 'Comments' ? (
            items.map(c => (
              <div key={c._id} className="comment-row card" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <a href={`/post/${c.postId?._id || ''}`} style={{ fontWeight: 700, textDecoration: 'none' }}>
                    {c.postId?.title || 'Unknown post'}
                  </a>
                  <div className="muted small">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ marginTop: 6 }}>{c.body}</div>
              </div>
            ))
          ) : (
            items.map(it => <PostListItem key={it._id || it.id} item={it} />)
          )}
        </div>
      </div>
    </section>
  )
}
