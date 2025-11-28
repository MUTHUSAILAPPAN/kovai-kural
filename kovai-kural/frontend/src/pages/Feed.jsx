// src/pages/Feed.jsx
import React, { useEffect, useState } from 'react'
// We’ll still use navigate (e.g. for clicking the title to open full post)
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

import CategoriesSidebar from '../components/feed/CategoriesSidebar'
import RecentPostsSidebar from '../components/feed/RecentPostsSidebar'
import CommentsThread from '../components/CommentsThread'
import CreatePostModal from '../components/CreatePostModal'


import './feed.css'

export default function Feed() {
  const [categories, setCategories] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [posts, setPosts] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null) // which post’s comments are open
  const [postModalOpen, setPostModalOpen] = useState(false)

  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    loadFeed()
    loadRecent()
    loadCategories()
    if (user) {
      loadSaved(user)
    } else {
      setSavedIds([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function loadFeed() {
    try {
      const res = await api.get('/posts?limit=20')
      setPosts(res.data.posts || [])
    } catch (e) {
      console.error('Feed load error', e)
    }
  }

  async function loadRecent() {
    try {
      const res = await api.get('/posts?sort=recent&limit=6')
      setRecentPosts(res.data.posts || [])
    } catch (e) {
      console.error('Recent load error', e)
    }
  }

  async function loadCategories() {
    try {
      const res = await api.get('/categories')
      setCategories(res.data.categories || [])
    } catch (e) {
      console.error('Category load error', e)
    }
  }

  async function loadSaved(currentUser) {
    try {
      // backend: GET /api/users/:id/saved
      const res = await api.get(`/users/${currentUser.id}/saved`)
      const arr = res.data.posts || res.data.saved || []
      setSavedIds(arr.map(p => p._id))
    } catch (e) {
      console.error('Saved posts load error', e)
    }
  }

  // --- voting actions ---
  async function handleVote(postId, type) {
    if (!user) return
    try {
      await api.post(`/posts/${postId}/vote`, { type })
      await loadFeed()
      await loadRecent()
    } catch (e) {
      console.error('Vote error', e)
    }
  }

  // --- save / unsave ---
  async function handleSaveToggle(postId) {
    if (!user) return
    const isSaved = savedIds.includes(postId)
    try {
      if (isSaved) {
        await api.post(`/users/me/unsave/${postId}`)
        setSavedIds(prev => prev.filter(id => id !== postId))
      } else {
        await api.post(`/users/me/save/${postId}`)
        setSavedIds(prev => [...prev, postId])
      }
    } catch (e) {
      console.error('Save error', e)
    }
  }

  // toggle inline comments for a post
  function toggleComments(postId) {
    setActiveCommentsPostId(prev => (prev === postId ? null : postId))
  }

  return (
    <div className="feed-layout container-grid">
      {/* LEFT SIDEBAR */}
      <aside className="left-col">
        <section className="card sidebar-card categories-sidebar">
          <h2 className="sidebar-title">Categories</h2>
          <CategoriesSidebar categories={categories} />
        </section>
      </aside>

      {/* CENTER FEED CONTENT */}
      <main className="center-col">
        <h1 className="page-title">Feeds</h1>

        {user && (
  <div className="center-composer-wrapper">
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => setPostModalOpen(true)}
    >
      + Create Post
    </button>
  </div>
)}

<CreatePostModal
  open={postModalOpen}
  onClose={() => setPostModalOpen(false)}
  categories={categories}
  onCreated={() => {
    // refresh feeds when a new post is created
    loadFeed()
    loadRecent()
  }}
/>

        <section className="feed-posts">
          {posts.length === 0 && (
            <div className="card muted small">No posts yet.</div>
          )}

          {posts.map(p => {
            const isSaved = savedIds.includes(p._id)
            const isCommentsOpen = activeCommentsPostId === p._id

            return (
              <article
                key={p._id}
                className="card post-card"
                style={{ marginBottom: 10 }}
              >
                <div className="post-body">
                  <div className="muted xsmall">
                    {p.author?.name} @{p.author?.handle} •{' '}
                    {p.category?.title || 'General'} •{' '}
                    {new Date(p.createdAt).toLocaleString()}
                  </div>

                  <div
                    className="post-title clickable"
                    style={{ marginTop: 4 }}
                    onClick={() => nav(`/post/${p._id}`)} // full post page if you want
                  >
                    {p.title}
                  </div>

                  {p.body && (
                    <p className="post-excerpt">
                      {p.body.length > 260 ? p.body.slice(0, 260) + '…' : p.body}
                    </p>
                  )}

                  {p.images && p.images.length > 0 && (
                    <div className="post-images" style={{ marginTop: 8 }}>
                      <img src={p.images[0]} alt="" />
                    </div>
                  )}

                  {/* ACTION BAR */}
                  <div className="post-actions-row">
                    <div className="post-votes">
                      <button
                        type="button"
                        className="vote-btn"
                        onClick={() => handleVote(p._id, 'up')}
                        disabled={!user}
                      >
                        ▲
                      </button>
                      <span className="vote-count">{p.votes ?? 0}</span>
                      <button
                        type="button"
                        className="vote-btn"
                        onClick={() => handleVote(p._id, 'down')}
                        disabled={!user}
                      >
                        ▼
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-ghost small-btn"
                      onClick={() => toggleComments(p._id)}
                    >
                      {isCommentsOpen ? 'Hide comments' : '💬 Comment'}
                    </button>

                    <button
                      type="button"
                      className={`btn-ghost small-btn ${
                        isSaved ? 'saved-btn' : ''
                      }`}
                      disabled={!user}
                      onClick={() => handleSaveToggle(p._id)}
                    >
                      {isSaved ? '✓ Saved' : '☆ Save'}
                    </button>

                    <button
                      type="button"
                      className="btn-ghost small-btn"
                      onClick={() => {
                        const url = `${window.location.origin}/post/${p._id}`
                        navigator.clipboard?.writeText(url)
                      }}
                    >
                      ⤴ Share
                    </button>
                  </div>

                  {/* INLINE THREADED COMMENTS */}
                  {isCommentsOpen && (
                    <div className="post-comments-inline">
                      <CommentsThread postId={p._id} collapsed={false} />
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="right-col">
        <section className="card sidebar-card recent-posts-sidebar">
          <h2 className="sidebar-title">Recent Posts</h2>
          <RecentPostsSidebar posts={recentPosts} />
        </section>
      </aside>
    </div>
  )
}
