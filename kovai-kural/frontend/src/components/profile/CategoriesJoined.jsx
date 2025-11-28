// src/components/profile/CategoriesJoined.jsx
import React, { useState } from 'react'
import CreatePostModal from '../CreatePostModal'

/**
 * CategoriesJoined
 * Props:
 *  - categories: array of category objects { _id, title, postCount, ... }
 *  - onPostCreated?: function(post) -> parent can refresh if needed
 */
export default function CategoriesJoined({ categories = [], onPostCreated }) {
  const [postModalOpen, setPostModalOpen] = useState(false)

  return (
    <div className="categories-panel card">
      <h3>Categories joined</h3>

      <div className="cat-list">
        {categories.length === 0 && (
          <div className="muted">No categories yet</div>
        )}

        {categories.map(c => (
          <div className="cat-item" key={c._id || c.slug}>
            <div className="cat-avatar">
              {(c.title && c.title[0]) || 'C'}
            </div>
            <div className="cat-body">
              <div className="cat-title">{c.title}</div>
              <div className="muted small">
                {c.postCount || 0} posts
              </div>
            </div>
          </div>
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

      {/* Post creation modal */}
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
