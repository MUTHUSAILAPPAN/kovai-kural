import React, { useState } from 'react'
import api from '../services/api'

export default function CreatePostModal({ open, onClose, onCreated, categories = [] }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState(categories[0]?._id || '')
  const [image, setImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [mentionsText, setMentionsText] = useState('')

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !body.trim()) { setError('Title and body required'); return }
    const form = new FormData()
    form.append('title', title)
    form.append('body', body)
    form.append('category', category)
const mentionsArr = mentionsText.split(',').map(s => s.trim()).filter(Boolean)
  form.append('mentions', JSON.stringify(mentionsArr))
  await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } })

    if (image) form.append('images', image)
    setSubmitting(true)
    try {
      const res = await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      onCreated && onCreated(res.data.post)
      setTitle(''); setBody(''); setImage(null)
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create post')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Create a post</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit} className="create-form">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} />
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value=''>-- Select category --</option>
            {categories.map(c => <option key={c._id || c.slug} value={c._id}>{c.title}</option>)}
          </select>
           <label>Tag users (handles, comma separated)</label>
  <input value={mentionsText} onChange={e => setMentionsText(e.target.value)} placeholder="Officials or public" />
          <label>Body</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} />
          <label>Image (optional)</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Posting...' : 'Post'}</button>
          </div>
        </form>
        
      </div>
    </div>
  )
}
