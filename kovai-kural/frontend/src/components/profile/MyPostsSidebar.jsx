// src/components/profile/MyPostsSidebar.jsx
import React from 'react'
import PostListItem from '../PostListItem'

export default function MyPostsSidebar({ posts = [] }) {
  return (
    <div className="my-posts card">
      <h3>My Posts</h3>
      <div className="mp-list">
        {posts.length === 0 && <div className="muted">No posts</div>}
        {posts.map(p => <PostListItem key={p._id} item={p} compact />)}
      </div>
    </div>
  )
}
