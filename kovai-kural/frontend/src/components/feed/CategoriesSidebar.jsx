// src/components/feed/CategoriesSidebar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CategoriesSidebar({ categories = [] }) {
  const nav = useNavigate()

  return (
    <div className="categories-list">
      {categories.map(cat => (
        <button
          key={cat._id}
          type="button"
          className="category-row"
          onClick={() => nav(`/category/${cat.slug}`)}
        >
          <div className="category-avatar">
            <span>{(cat.title || '?').charAt(0).toUpperCase()}</span>
          </div>
          <div className="category-meta">
            <div className="category-name">{cat.title}</div>
            <div className="category-count muted xsmall">
              {cat.postCount || 0} posts
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
