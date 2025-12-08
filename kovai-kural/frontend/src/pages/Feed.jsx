// src/pages/Feed.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

import CategoriesSidebar from '../components/feed/CategoriesSidebar'
import RecentPostsSidebar from '../components/feed/RecentPostsSidebar'
import CommentsThread from '../components/CommentsThread'
import CreatePostModal from '../components/CreatePostModal'
import ImageLightbox from '../components/ImageLightbox'
import CategorySuggestions from '../components/CategorySuggestions'
import PeopleYouMayKnow from '../components/profile/PeopleYouMayKnow'
import ReportModal from '../components/ReportModal'

import './feed.css'
import '../styles/lightbox.css'
import '../components/CommonSidebar.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function Feed() {
  const [categories, setCategories] = useState([])
  const [joinedCategories, setJoinedCategories] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [posts, setPosts] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [reportModal, setReportModal] = useState({ open: false, targetId: null, type: null, category: null })

  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    loadFeed()
    loadRecent()
    loadCategories()
    if (user) {
      loadSaved(user)
      loadJoinedCategories()
    } else {
      setSavedIds([])
      setJoinedCategories([])
    }
  }, [user])

  async function loadFeed() {
    try {
      const res = await api.get('/posts?limit=20')
      const postsData = res.data.posts || []
      const postsWithCounts = await Promise.all(
        postsData.map(async (post) => {
          try {
            const commentsRes = await api.get(`/posts/${post._id}/comments`)
            return { ...post, commentCount: commentsRes.data.count || 0 }
          } catch (e) {
            return { ...post, commentCount: 0 }
          }
        })
      )
      setPosts(postsWithCounts)
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

  async function loadJoinedCategories() {
    if (!user) return
    try {
      const res = await api.get(`/users/handle/${user.handle}`)
      setJoinedCategories(res.data.user.categoriesPreview || [])
    } catch (e) {
      console.error('Joined categories load error', e)
    }
  }

  async function loadSaved(currentUser) {
    try {
      const res = await api.get(`/users/${currentUser.id}/saved`)
      const arr = res.data.posts || res.data.saved || []
      setSavedIds(arr.map(p => p._id))
    } catch (e) {
      console.error('Saved posts load error', e)
    }
  }

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

  function toggleComments(postId) {
    setActiveCommentsPostId(prev => (prev === postId ? null : postId))
  }

  function openLightbox(images, index) {
    setLightboxImages(images.map(img => `${API_BASE}${img}`))
    setLightboxIndex(index)
  }

  return (
    <div className="feed-layout container-grid">
      <aside className="left-col">
        <section className="card sidebar-card categories-sidebar">
          <h2 className="sidebar-title">Categories</h2>
          <CategoriesSidebar categories={categories} />
        </section>
        <div style={{ marginTop: '16px' }}>
          <CategorySuggestions title="Categories You May Like" />
        </div>
      </aside>

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
          categories={joinedCategories.length > 0 ? joinedCategories : categories}
          onCreated={() => {
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
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); nav(`/profile/${p.author?.handle}`); }}
                    >
                      {p.author?.name} @{p.author?.handle}
                    </span>
                    {' • '}
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); p.category && nav(`/category/${p.category.slug}`); }}
                    >
                      {p.category?.title || 'General'}
                    </span>
                    {' • '}
                    {new Date(p.createdAt).toLocaleString()}
                  </div>

                  <div
                    className="post-title clickable"
                    style={{ marginTop: 4 }}
                    onClick={() => nav(`/post/${p._id}`)}
                  >
                    {p.title}
                  </div>

                  {p.body && (
                    <p className="post-excerpt">
                      {p.body.length > 260 ? p.body.slice(0, 260) + '…' : p.body}
                    </p>
                  )}

                  {p.images && p.images.length > 0 && (
                    <div className="post-images" style={{ marginTop: 8, display: 'grid', gridTemplateColumns: p.images.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: '8px' }}>
                      {p.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${API_BASE}${img}`}
                          alt=""
                          onClick={() => openLightbox(p.images, idx)}
                        />
                      ))}
                    </div>
                  )}

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
                      {isCommentsOpen ? 'Hide comments' : `💬 ${p.commentCount || 0} Comments`}
                    </button>

                    <button
                      type="button"
                      className={`btn-ghost small-btn ${isSaved ? 'saved-btn' : ''}`}
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

                    {user && (
                      <button
                        type="button"
                        className="btn-ghost small-btn"
                        onClick={() => setReportModal({ open: true, targetId: p._id, type: 'POST', category: p.category?._id })}
                      >
                        🚩 Report
                      </button>
                    )}
                  </div>

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

      <aside className="right-col">
        <section className="card sidebar-card recent-posts-sidebar">
          <h2 className="sidebar-title">Recent Posts</h2>
          <RecentPostsSidebar posts={recentPosts} />
        </section>
        {user && (
          <div style={{ marginTop: '16px' }}>
            <PeopleYouMayKnow />
          </div>
        )}
      </aside>

      {lightboxImages && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxImages(null)}
        />
      )}

      <ReportModal
        open={reportModal.open}
        onClose={() => setReportModal({ open: false, targetId: null, type: null, category: null })}
        targetId={reportModal.targetId}
        reportType={reportModal.type}
        category={reportModal.category}
      />
    </div>
  )
}
