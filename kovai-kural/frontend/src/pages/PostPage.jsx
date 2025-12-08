// src/pages/PostPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import CommentsThread from '../components/CommentsThread'
import CategorySuggestions from '../components/CategorySuggestions'
import PeopleYouMayKnow from '../components/profile/PeopleYouMayKnow'
import RecentPosts from '../components/RecentPosts'
import '../components/CommonSidebar.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function PostPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [id])

  async function loadPost() {
    setLoading(true)
    try {
      const res = await api.get(`/posts/${id}`)
      setPost(res.data.post || res.data)
    } catch (e) {
      console.error('Post load error', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleVote(type) {
    if (!user) return
    try {
      await api.post(`/posts/${id}/vote`, { type })
      loadPost()
    } catch (e) {
      console.error('Vote error', e)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await api.delete(`/posts/${id}`)
      navigate('/')
    } catch (e) {
      console.error('Delete error', e)
      alert(e?.response?.data?.message || 'Failed to delete post')
    }
  }

  const canDelete = user && (user.id === post?.author?._id || user.role === 'ADMIN');

  if (loading) return <div className="container">Loading post…</div>
  if (!post) return <div className="container">Post not found</div>

  return (
    <div className="container-grid" style={{ marginTop: '20px' }}>
      <aside className="left-col">
        <CategorySuggestions />
      </aside>

      <main className="center-col">
        {/* Back button */}
        <button 
          className="btn btn-ghost" 
          onClick={() => navigate(-1)}
          style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Back
        </button>

        {/* Post card */}
        <article className="card" style={{ marginBottom: 16 }}>
        <div className="muted xsmall">
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/profile/${post.author?.handle}`)}
          >
            {post.author?.name} @{post.author?.handle}
          </span>
          {' • '}
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => post.category && navigate(`/category/${post.category.slug}`)}
          >
            {post.category?.title || 'General'}
          </span>
          {' • '}
          {new Date(post.createdAt).toLocaleString()}
        </div>

        <h1 style={{ marginTop: 6, marginBottom: 4 }}>{post.title}</h1>

        {post.body && (
          <p style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{post.body}</p>
        )}

        {post.images && post.images.length > 0 && (
          <div className="post-images" style={{ marginTop: 10, display: 'grid', gridTemplateColumns: post.images.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: '8px' }}>
            {post.images.map((src, idx) => (
              <img key={idx} src={`${API_BASE}${src}`} alt="" style={{ width: '100%', borderRadius: '8px' }} />
            ))}
          </div>
        )}

        {/* Vote buttons */}
        <div className="post-actions-row" style={{ marginTop: 12, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="post-votes">
            <button
              type="button"
              className="vote-btn"
              onClick={() => handleVote('up')}
              disabled={!user}
            >
              ▲
            </button>
            <span className="vote-count">{post.votes ?? 0}</span>
            <button
              type="button"
              className="vote-btn"
              onClick={() => handleVote('down')}
              disabled={!user}
            >
              ▼
            </button>
            </div>
          </div>
          
          {canDelete && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleDelete}
              style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              Delete Post
            </button>
          )}
        </div>
      </article>

        {/* 🔽 Fully threaded comments UI */}
        <CommentsThread postId={id} collapsed={false} />
      </main>

      <aside className="right-col">
        <RecentPosts />
        {user && <div style={{ marginTop: '16px' }}><PeopleYouMayKnow /></div>}
      </aside>
    </div>
  )
}
