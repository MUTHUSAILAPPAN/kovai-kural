import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function RecentPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await api.get('/posts?sort=recent&limit=6')
      setPosts(res.data.posts || [])
    } catch (err) {
      console.error('Failed to fetch recent posts', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  return (
    <div className="card sidebar-card">
      <h3 className="sidebar-title">Recent Posts</h3>
      <div className="recent-posts-list">
        {posts.map(p => (
          <div
            key={p._id}
            className="recent-post-item"
            onClick={() => nav(`/post/${p._id}`)}
          >
            {p.images && p.images.length > 0 && (
              <div className="recent-thumb">
                <img src={`${API_BASE}${p.images[0]}`} alt="" />
              </div>
            )}
            <div className="recent-meta">
              <div className="recent-title">{p.title}</div>
              <div className="recent-sub muted small">
                {p.category?.title || 'General'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
