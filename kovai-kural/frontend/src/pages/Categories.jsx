import React, { useEffect, useState } from 'react'
import api from '../services/api'
import CreateCategoryModal from '../components/CreateCategoryModal'
import './categories.css'
import { Link } from 'react-router-dom'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

 useEffect(() => {
  load()
}, [])

async function load() {
  try {
    const res = await api.get('/categories')
    console.log('categories loaded:', res.data.categories) // <-- add this
    setCategories(res.data.categories || [])
  } catch (e) { console.error(e) }
}


  const onCreated = (cat) => {
    setCategories(prev => [cat, ...prev])
    setOpen(false)
  }

  const filtered = categories.filter(c => c.title.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin: '16px 0'}}>
        <h2>Categories</h2>
        <div>
          <input placeholder="Search categories..." value={q} onChange={e => setQ(e.target.value)} style={{padding:'8px 12px', borderRadius:8}} />
          <button className="btn btn-primary" style={{marginLeft:8}} onClick={() => setOpen(true)}>Create Category</button>
        </div>
      </div>

<div className="category-grid">
  {filtered.map(cat => (
    <Link to={`/category/${cat.slug}`} key={cat._id} className="category-card" style={{ textDecoration:'none', color:'inherit' }}>
      <h3>{cat.title}</h3>
      <p className="muted small">{cat.postCount || 0} posts • Created {new Date(cat.createdAt).toLocaleDateString()}</p>
      <p>{cat.description}</p>
      <div className="rules"><strong>Rules: </strong>{cat.rules || 'No specific rules'}</div>
    </Link>
  ))}
</div>

      <CreateCategoryModal open={open} onClose={() => setOpen(false)} onCreated={onCreated} />
    </div>
  )
}
