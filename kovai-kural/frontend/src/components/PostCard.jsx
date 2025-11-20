// src/components/PostCard.jsx
import React, { useState } from 'react'
import api from '../services/api'
import CommentsThread from './CommentsThread'
import { useAuth } from '../contexts/AuthContext'

export default function PostCard({ post }) {
  const [votes, setVotes] = useState(post.votes || 0)
  const [showComments, setShowComments] = useState(false)

  const { user } = useAuth()
const [saved, setSaved] = useState(post.isSavedByCurrentUser || false) // we can set this when posts are fetched and include this boolean
const toggleSave = async () => {
  if (!user) { alert('Login to save posts'); return }
  try {
    if (saved) {
      await api.post(`/users/me/unsave/${post._id}`)
      setSaved(false)
    } else {
      await api.post(`/users/me/save/${post._id}`)
      setSaved(true)
    }
  } catch (err) { console.error(err); }
}

  const imgUrl = post.images && post.images[0] ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${post.images[0]}` : null

  async function vote(type) {
    try {
      const res = await api.post(`/posts/${post._id}/vote`, { type })
      setVotes(res.data.votes)
    } catch (err) {
      console.error('Vote error', err)
    }
  }

  return (
    <article className="post-card">
      <header className="post-head">
        <div className="post-author">
          <img src={post.author?.avatarUrl ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${post.author.avatarUrl}` : '/default-avatar.png'} alt={post.author?.name} />
          <div>
            <strong>{post.author?.name}</strong>
            <div className="muted small">@{post.author?.handle}</div>
          </div>
        </div>
        <div className="post-meta">
          <span className="tag">{post.category?.title || 'General'}</span>
          <span className="time muted">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </header>

      <div className="post-body">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-text">{post.body}</p>
        {imgUrl && <img src={imgUrl} className="post-image" alt="attachment" />}
      </div>

      <footer className="post-footer">
        <div className="post-actions">
          <button className="icon-btn" title="Upvote" onClick={() => vote('up')}>⬆</button>
          <button className="icon-btn" title="Downvote" onClick={() => vote('down')}>⬇</button>
          <button className="icon-btn" title="Comment" onClick={() => setShowComments(s => !s)}>💬</button>
          <div className="muted small" style={{ marginLeft: 8 }}>{votes}</div>
        </div>

        <div className="post-footer-right">
            <button className="btn-link" onClick={toggleSave}>{saved ? 'Saved' : 'Save'}</button>
          <button className="btn-link">Share</button>
        </div>
      </footer>

      {/* Inline comments area */}
      {showComments && (
        <div style={{ marginTop: 12 }}>
          <CommentsThread postId={post._id} collapsed={false} />
        </div>
      )}
    </article>
  )
}
