// src/components/SearchBar.jsx
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const nav = useNavigate()

  // simple debounce
  useEffect(() => {
    if (!q.trim()) {
      setResults(null)
      setOpen(false)
      return
    }
    setLoading(true)
    const id = setTimeout(async () => {
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(q)}&limit=5`)
        setResults(res.data)
        setOpen(true)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(id)
  }, [q])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!q.trim()) return
    nav(`/search?q=${encodeURIComponent(q)}`)
    setOpen(false)
  }

  return (
    <div className="kk-search" ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <input
          className="search-input"
          placeholder="Search posts, people, categories..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={() => results && setOpen(true)}
        />
      </form>

      {open && results && (
        <div className="search-dropdown card">
          {loading && <div className="muted small">Searching…</div>}

          {!loading && (
            <>
              {results.posts?.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Posts</div>
                  {results.posts.slice(0, 3).map(p => (
                    <button
                      key={p._id}
                      className="search-item"
                      type="button"
                      onClick={() => nav(`/post/${p._id}`)}
                    >
                      <div className="title">{p.title}</div>
                      <div className="muted xsmall">
                        {p.author?.name} • {p.category?.title}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.users?.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">People</div>
                  {results.users.slice(0, 3).map(u => (
                    <button
                      key={u._id}
                      className="search-item"
                      type="button"
                      onClick={() => nav(`/profile/${u.handle}`)}
                    >
                      <div className="title">{u.name}</div>
                      <div className="muted xsmall">@{u.handle}</div>
                    </button>
                  ))}
                </div>
              )}

              {results.categories?.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Categories</div>
                  {results.categories.slice(0, 3).map(c => (
                    <button
                      key={c._id}
                      className="search-item"
                      type="button"
                      onClick={() => nav(`/category/${c.slug}`)}
                    >
                      <div className="title">{c.title}</div>
                      <div className="muted xsmall">{c.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {results.total === 0 && <div className="muted small">No results</div>}

              <button
                type="button"
                className="search-view-all"
                onClick={() => {
                  nav(`/search?q=${encodeURIComponent(q)}`)
                  setOpen(false)
                }}
              >
                View all results →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
