// src/pages/SearchResults.jsx
import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import api from '../services/api'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

export default function SearchResults() {
  const query = useQuery()
  const q = query.get('q') || ''
  const [type, setType] = useState('all')
  const [data, setData] = useState({ posts: [], users: [], categories: [], total: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q.trim()) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, type])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(q)}&type=${type}`)
      setData(res.data || { posts: [], users: [], categories: [], total: 0 })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!q.trim()) return <div className="container">Enter something to search.</div>

  return (
    <div className="container">
      <h1>Search results for “{q}”</h1>

      <div className="tabs-row" style={{ marginBottom: 12 }}>
        {['all', 'posts', 'users', 'categories'].map(t => (
          <button
            key={t}
            className={`tab ${t === type ? 'active' : ''}`}
            onClick={() => setType(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="muted">Searching…</div>}

      {!loading && (
        <div className="search-results-layout">
          {(type === 'all' || type === 'posts') && (
            <section>
              <h3>Posts</h3>
              {data.posts?.length === 0 && <div className="muted small">No posts.</div>}
              {data.posts?.map(p => (
                <article key={p._id} className="card" style={{ marginBottom: 8 }}>
                  <Link to={`/post/${p._id}`} className="post-title-link">
                    {p.title}
                  </Link>
                  <div className="muted xsmall">
                    {p.author?.name} • {p.category?.title} •{' '}
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                  <p>{(p.body || '').slice(0, 200)}</p>
                </article>
              ))}
            </section>
          )}

          {(type === 'all' || type === 'users') && (
            <section>
              <h3>People</h3>
              {data.users?.length === 0 && <div className="muted small">No users.</div>}
              {data.users?.map(u => (
                <Link
                  to={`/profile/${u.handle}`}
                  key={u._id}
                  className="card"
                  style={{ display: 'block', marginBottom: 8 }}
                >
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div className="muted xsmall">@{u.handle}</div>
                  <div className="muted small">{u.bio}</div>
                </Link>
              ))}
            </section>
          )}

          {(type === 'all' || type === 'categories') && (
            <section>
              <h3>Categories</h3>
              {data.categories?.length === 0 && (
                <div className="muted small">No categories.</div>
              )}
              {data.categories?.map(c => (
                <Link
                  to={`/category/${c.slug}`}
                  key={c._id}
                  className="card"
                  style={{ display: 'block', marginBottom: 8 }}
                >
                  <div style={{ fontWeight: 600 }}>{c.title}</div>
                  <p className="muted small">{c.description}</p>
                </Link>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
