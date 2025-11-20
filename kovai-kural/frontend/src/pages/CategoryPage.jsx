// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import './category.css'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!slug) return
    fetchCategory()
  }, [slug])

  async function fetchCategory() {
    setLoading(true); setErr('')
    try {
      const res = await api.get(`/categories/${slug}`)
      setCategory(res.data.category)
      setPosts(res.data.posts || [])
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load category')
    } finally { setLoading(false) }
  }

  if (loading) return <div className="container">Loading category…</div>
  if (err) return <div className="container error">{err}</div>
  if (!category) return <div className="container">Category not found</div>

  return (
    <div className="category-page container">
      <div className="category-header card">
        <div className="ch-top">
          <h1>{category.title}</h1>
          <div className="ch-meta">
            <div className="muted">{category.postCount} posts • {category.membersCount} members</div>
            <div style={{marginTop:8}}>
              <button className="btn btn-ghost">Join</button>
              <button className="btn" style={{marginLeft:8}}>Create Post</button>
            </div>
          </div>
        </div>

        <p className="ch-desc">{category.description}</p>

        <div className="ch-rules">
          <h4>Rules</h4>
          <div>{category.rules || 'No specific rules.'}</div>
        </div>

        <div className="ch-moderators">
          <h4>Moderators</h4>
          <div className="mods-list">
            {category.moderators && category.moderators.length > 0 ? (
              category.moderators.map(m => (
                <Link to={`/profile/${m.handle}`} key={m._id} className="mod-item">
                  <img src={m.avatarUrl ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${m.avatarUrl}` : '/default-avatar.png'} alt={m.name} />
                  <div>
                    <div className="muted small">Moderator</div>
                    <div>{m.name} <span className="muted small">@{m.handle}</span></div>
                  </div>
                </Link>
              ))
            ) : <div className="muted">No moderators yet</div>}
          </div>
        </div>
      </div>

      <div className="category-posts">
        <h3>Posts in {category.title}</h3>

        {posts.length === 0 && <div className="muted">No posts yet — be the first to report an issue in this category.</div>}

        <div className="posts-list">
          {posts.map(p => (
            <article key={p._id} className="post-card small">
              <div className="post-left">
                <img src={p.author?.avatarUrl ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${p.author.avatarUrl}` : '/default-avatar.png'} alt={p.author?.name}/>
              </div>
              <div className="post-body">
                <Link to={`/post/${p._id}`} className="post-title">{p.title}</Link>
                <p className="muted small">{p.author?.name} • {new Date(p.createdAt).toLocaleString()}</p>
                <p className="post-excerpt">{(p.body || '').slice(0, 200)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
