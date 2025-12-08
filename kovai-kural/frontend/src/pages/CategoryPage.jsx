// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import CategorySuggestions from '../components/CategorySuggestions'
import PeopleYouMayKnow from '../components/profile/PeopleYouMayKnow'
import RecentPosts from '../components/RecentPosts'
import '../components/CommonSidebar.css'
import './category.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function CategoryPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editDesc, setEditDesc] = useState('')
  const [editRules, setEditRules] = useState('')
  const [editImage, setEditImage] = useState(null)

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
      setEditDesc(res.data.category.description || '')
      setEditRules(res.data.category.rules || '')
      
      if (user) {
        setIsJoined(res.data.category.members?.some(m => m.toString() === user.id || m._id === user.id))
      }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load category')
    } finally { setLoading(false) }
  }

  async function handleJoinToggle() {
    if (!user) return
    try {
      if (isJoined) {
        await api.post(`/categories/${category._id}/leave`)
        setIsJoined(false)
      } else {
        await api.post(`/categories/${category._id}/join`)
        setIsJoined(true)
      }
      fetchCategory()
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update membership')
    }
  }

  async function handleSaveEdit() {
    try {
      const formData = new FormData()
      formData.append('description', editDesc)
      formData.append('rules', editRules)
      if (editImage) formData.append('image', editImage)

      await api.put(`/categories/${category._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setEditMode(false)
      fetchCategory()
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update category')
    }
  }

  if (loading) return <div className="container">Loading category…</div>
  if (err) return <div className="container error">{err}</div>
  if (!category) return <div className="container">Category not found</div>

  const isModerator = user && (category.moderators?.some(m => m._id === user.id || m.toString() === user.id) || user.role === 'ADMIN')

  return (
    <div className="container-grid" style={{ marginTop: '20px' }}>
      <aside className="left-col">
        <CategorySuggestions />
      </aside>

      <main className="center-col">
        <button 
          className="btn btn-ghost" 
          onClick={() => navigate(-1)}
          style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Back
        </button>

        <div className="category-header card">
        <div className="ch-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {category.imageUrl && (
              <img src={`${API_BASE}${category.imageUrl}`} alt={category.title} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
            )}
            <div>
              <h1>{category.title}</h1>
              <div className="muted">{category.postCount} posts • {category.members?.length || 0} members</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            {user && (
              <button className="btn btn-primary" onClick={handleJoinToggle}>
                {isJoined ? 'Leave' : 'Join'}
              </button>
            )}
            {isModerator && (
              <>
                <button className="btn btn-ghost" onClick={() => setEditMode(!editMode)}>
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
                <button className="btn btn-primary" onClick={() => navigate(`/moderator/${category._id}`)}>
                  Moderator Panel
                </button>
              </>
            )}
          </div>
        </div>

        {editMode ? (
          <div style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label>Description</label>
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows="3" />
            </div>
            <div className="form-group">
              <label>Rules</label>
              <textarea value={editRules} onChange={e => setEditRules(e.target.value)} rows="4" />
            </div>
            <div className="form-group">
              <label>Category Image</label>
              <input type="file" accept="image/*" onChange={e => setEditImage(e.target.files[0])} />
            </div>
            <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
          </div>
        ) : (
          <>
            <p className="ch-desc">{category.description}</p>
            <div className="ch-rules">
              <h4>Rules</h4>
              <div>{category.rules || 'No specific rules.'}</div>
            </div>
          </>
        )}

        <div className="ch-moderators">
          <h4>Moderators</h4>
          <div className="mods-list">
            {category.moderators && category.moderators.length > 0 ? (
              category.moderators.map(m => (
                <Link to={`/profile/${m.handle}`} key={m._id} className="mod-item">
                  <img src={m.avatarUrl ? `${API_BASE}${m.avatarUrl}` : '/default-avatar.png'} alt={m.name} />
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
                  <img src={p.author?.avatarUrl ? `${API_BASE}${p.author.avatarUrl}` : '/default-avatar.png'} alt={p.author?.name}/>
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
      </main>

      <aside className="right-col">
        <RecentPosts />
        {user && <div style={{ marginTop: '16px' }}><PeopleYouMayKnow /></div>}
      </aside>
    </div>
  )
}
