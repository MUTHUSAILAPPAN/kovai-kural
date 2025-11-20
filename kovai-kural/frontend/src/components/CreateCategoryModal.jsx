import React, { useState } from 'react'
import api from '../services/api'

export default function CreateCategoryModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [rules, setRules] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!title.trim()) { setErr('Title is required'); return }
    try {
      setLoading(true)
      const res = await api.post('/categories', { title, description: desc, rules })
      onCreated && onCreated(res.data.category)
      setTitle(''); setDesc(''); setRules('')
    } catch (err) {
      setErr(err?.response?.data?.message || 'Failed to create')
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Create Category</h3>
        {err && <div className="error">{err}</div>}
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} />
          <label>Description</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} />
          <label>Rules (one line or bullet)</label>
          <textarea value={rules} onChange={e=>setRules(e.target.value)} rows={3} />
          <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
