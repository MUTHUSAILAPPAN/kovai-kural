// src/components/CategorySidebar.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function CategorySidebar({ categories = [], onCreate }) {
  return (
    <div className="category-panel">
      <h3>Categories</h3>
      <div className="cat-list">
        {categories.map(cat => (
          <Link to={`/category/${cat.slug}`} className="cat-item" key={cat._id || cat.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="cat-avatar">{(cat.title || '?')[0]}</div>
            <div className="cat-info">
              <div className="cat-title">{cat.title}</div>
              <div className="cat-sub">{cat.postCount || 0} posts</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="cat-footer">
        <button className="btn btn-ghost" onClick={onCreate}>
          + Create Post
        </button>
      </div>
    </div>
  )
}
