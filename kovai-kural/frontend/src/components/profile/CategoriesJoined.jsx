// src/components/profile/CategoriesJoined.jsx
import React from 'react'
export default function CategoriesJoined({ categories = [], onCreate }) {
  return (
    <div className="categories-panel card">
      <h3>Categories joined</h3>
      <div className="cat-list">
        {categories.length === 0 && <div className="muted">No categories yet</div>}
        {categories.map(c => (
          <div className="cat-item" key={c._id || c.slug}>
            <div className="cat-avatar">{c.title?.[0]}</div>
            <div className="cat-body">
              <div className="cat-title">{c.title}</div>
              <div className="muted small">{c.postCount || 0} posts</div>
            </div>
          </div>
        ))}
      </div>

      <div className="cat-create">
        <button className="btn btn-ghost" onClick={onCreate}>+ Create Post</button>
      </div>
    </div>
  )
}
