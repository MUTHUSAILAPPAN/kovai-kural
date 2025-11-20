import React from 'react'
export default function RecentPosts({ posts = [] }) {
  return (
    <div className="recent-panel">
      <h3>Recent Posts</h3>
      <div className="recent-list">
        {posts.map(p => (
          <div className="recent-item" key={p._id || p.id}>
            <div className="ri-left">
              <img src={p.author?.avatarUrl ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${p.author.avatarUrl}` : '/default-avatar.png'} alt="a" />
            </div>
            <div className="ri-body">
              <div className="ri-title">{p.title}</div>
              <div className="muted small">{p.category?.title || 'General'} • {new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
