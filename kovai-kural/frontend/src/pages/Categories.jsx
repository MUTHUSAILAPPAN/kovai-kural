// src/pages/Categories.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import CreateCategoryModal from '../components/CreateCategoryModal'
import './categories.css'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  

  const nav = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const res = await api.get('/categories')
      console.log('categories loaded:', res.data.categories)
      setCategories(res.data.categories || [])
    } catch (e) {
      console.error(e)
    }
  }

  const openCreateModal = () => setOpen(true)

  const onCreated = (cat) => {
    setCategories(prev => [cat, ...prev])
    setOpen(false)
  }

  const filtered = categories.filter(c => {
    const t = c.title?.toLowerCase() || ''
    const d = c.description?.toLowerCase() || ''
    const qLower = q.toLowerCase()
    return t.includes(qLower) || d.includes(qLower)
  })

  // Sort by post count for active categories
  const sortedByActivity = [...filtered].sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
  const mostActive = sortedByActivity.slice(0, 6)
  const remaining = sortedByActivity.slice(6)

  return (
    <div className="categories-page">
      <div className="categories-header-row">
        <h1>Categories</h1>

        <div className="categories-header-actions">
          <input
            className="categories-search"
            placeholder="Search categories..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            Create Category
          </button>
        </div>
      </div>

      {/* Most Active Categories */}
      {!q && mostActive.length > 0 && (
        <section className="category-section">
          <h2 className="section-title">🔥 Most Active Categories</h2>
          <div className="categories-grid">
            {mostActive.map(cat => (
              <article
                key={cat._id}
                className="category-card active-card"
                onClick={() => nav(`/category/${cat.slug}`)}
              >
                <div className="category-card-title">{cat.title}</div>
                <div className="category-card-meta">
                  {cat.postCount || 0} posts • Created{' '}
                  {cat.createdAt
                    ? new Date(cat.createdAt).toLocaleDateString()
                    : '—'}
                </div>
                {cat.description && (
                  <div className="category-card-description">
                    {cat.description}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* All Categories */}
      <section className="category-section">
        <h2 className="section-title">{q ? 'Search Results' : '📂 All Categories'}</h2>
        <div className="categories-grid">
          {(q ? filtered : remaining).map(cat => (
            <article
              key={cat._id}
              className="category-card"
              onClick={() => nav(`/category/${cat.slug}`)}
            >
              <div className="category-card-title">{cat.title}</div>
              <div className="category-card-meta">
                {cat.postCount || 0} posts • Created{' '}
                {cat.createdAt
                  ? new Date(cat.createdAt).toLocaleDateString()
                  : '—'}
              </div>
              {cat.description && (
                <div className="category-card-description">
                  {cat.description}
                </div>
              )}
              {cat.rules && (
                <div className="category-card-rules">
                  <strong>Rules:</strong> {cat.rules}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <CreateCategoryModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={onCreated}
      />
    </div>
  )
}
