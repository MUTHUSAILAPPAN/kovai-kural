// src/components/PostListItem.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function PostListItem({ item, compact = false }) {
  // if item is comment-like it might have .post. Try to normalize
  const post = item.post || item
  return (
    <div className={`post-list-item ${compact ? 'compact' : ''}`}>
      <div className="pli-left">
        <img src={post.author?.avatarUrl ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${post.author.avatarUrl}` : '/default-avatar.png'} alt="" />
      </div>
      <div className="pli-body">
        <Link to={`/post/${post._id}`} className="pli-title">{post.title || item.body?.slice(0,60)}</Link>
        <div className="muted small">{post.category?.title || ''}</div>
      </div>
    </div>
  )
}
