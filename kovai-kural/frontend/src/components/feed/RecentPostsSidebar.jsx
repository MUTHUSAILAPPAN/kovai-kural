// src/components/feed/RecentPostsSidebar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function RecentPostsSidebar({ posts = [] }) {
  const nav = useNavigate()

  return (
    <div className="recent-posts-list">
      {posts.map(p => (
        <button
          key={p._id}
          type="button"
          className="recent-post-item"
          onClick={() => nav(`/post/${p._id}`)}
        >
          {p.images && p.images.length > 0 && (
            <div className="recent-thumb">
              <img src={p.images[0]} alt="" />
            </div>
          )}
          <div className="recent-meta">
            <div className="recent-title">{p.title}</div>
            <div className="recent-sub muted xsmall">
              {p.category?.title || 'General'} •{' '}
              {new Date(p.createdAt).toLocaleDateString()}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
