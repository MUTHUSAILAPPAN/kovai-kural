import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function CategorySuggestions({ title = "Categories You May Be Interested In" }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuggestions()
  }, [])

  async function fetchSuggestions() {
    try {
      const res = await api.get('/categories/suggestions')
      setCategories(res.data.categories || [])
    } catch (err) {
      console.error('Failed to fetch category suggestions', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null
  if (!categories.length) return null

  return (
    <div className="category-suggestions card">
      <h3>{title}</h3>
      <div className="cat-list">
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
    </div>
  )
}
