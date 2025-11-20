import React, { useEffect, useState } from 'react'
import api from '../services/api'
import CategorySidebar from '../components/CategorySidebar'
import RecentPosts from '../components/RecentPosts'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'
import './feed.css'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [p, c, r] = await Promise.all([
        api.get('/posts?limit=20').then(r => r.data.posts || []),
        api.get('/categories').then(r => r.data.categories || []),
        api.get('/posts?sort=recent&limit=5').then(r => r.data.posts || [])
      ])
      setPosts(p)
      setCategories(c)
      setRecent(r)
    } catch (err) {
      console.error('feed load error', err)
    } finally {
      setLoading(false)
    }
  }

  // optimistic add
  const handleCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
    setRecent(prev => [newPost, ...prev].slice(0,5))
  }

  return (
    <div className="feed-page container-grid">
      <aside className="left-col">
        <CategorySidebar categories={categories} onCreate={() => setOpenCreate(true)} />
      </aside>

      <section className="center-col">
        <div className="feed-header">
          <h2>Feeds</h2>
          <div className="search-bar">
            <input placeholder="Search posts, profiles, categories..." />
          </div>
        </div>

        <div className="create-area">
          <button className="btn btn-primary" onClick={() => setOpenCreate(true)}>+ Create Post</button>
        </div>

        <div className="posts-list">
          {loading && <div className="muted">Loading posts...</div>}
          {!loading && posts.length === 0 && <div className="muted">No posts yet — be the first to report an issue.</div>}
          {posts.map(p => <PostCard key={p._id || p.id} post={p} />)}
        </div>
      </section>

      <aside className="right-col">
        <RecentPosts posts={recent} />
      </aside>

      <CreatePostModal open={openCreate} onClose={() => setOpenCreate(false)} onCreated={handleCreated} categories={categories} />
    </div>
  )
}
