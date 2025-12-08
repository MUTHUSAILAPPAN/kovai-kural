// src/components/profile/CategoriesJoined.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CreatePostModal from '../CreatePostModal'

export default function CategoriesJoined({ categories = [], onPostCreated }) {
  const [postModalOpen, setPostModalOpen] = useState(false)

  return (
    <div className="categories-panel card">
      <h3>Categories Joined</h3>

      <div className="cat-list">
        {categories.length === 0 && (
          <div className="muted">No categories joined yet</div>
        )}

        {categories.map(c => (
          <Link to={`/category/${c.slug}`} className="cat-item" key={c._id || c.slug}>
            <div className="cat-avatar">
              {(c.title && c.title[0]) || 'C'}
            </div>
            <div className="cat-body">
              <div className="cat-title">{c.title}</div>
              <div className="muted small">
                {c.postCount || 0} posts
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="cat-create">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setPostModalOpen(true)}
        >
          + Create Post
        </button>
      </div>

      <CreatePostModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        categories={categories}
        onCreated={post => {
          setPostModalOpen(false)
          if (onPostCreated) onPostCreated(post)
        }}
      />
    </div>
  )
}
