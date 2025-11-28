// src/components/CreatePostModal.jsx
import React, { useEffect, useState } from 'react'
import api from '../services/api'
import '../styles/modal.css'

export default function CreatePostModal({
  open,
  onClose,
  onCreated,
  categories = [],
}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [mentionsText, setMentionsText] = useState('')

  // reset + default category when modal is opened
  useEffect(() => {
    if (open) {
      setError('')
      setSubmitting(false)
      if (!category && categories.length > 0) {
        setCategory(categories[0]._id || '')
      }
    }
  }, [open, categories])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !body.trim()) {
      setError('Title and body are required')
      return
    }

    const form = new FormData()
    form.append('title', title)
    form.append('body', body)
    if (category) form.append('category', category)

    // mentions: comma-separated handles
    const mentionsArr = mentionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (mentionsArr.length) {
      form.append('mentions', JSON.stringify(mentionsArr))
    }

    if (image) {
      form.append('images', image)
    }

    try {
      setSubmitting(true)
      const res = await api.post('/posts', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      onCreated && onCreated(res.data.post)
      // clear fields
      setTitle('')
      setBody('')
      setImage(null)
      setMentionsText('')
      setCategory(categories[0]?._id || '')
      onClose()
    } catch (err) {
      console.error('Create post error', err)
      setError(err?.response?.data?.message || 'Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3>Create Post</h3>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label">
            Title
            <input
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your issue a clear title"
            />
          </label>

          <label className="modal-label">
            Category
            <select
              className="modal-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Select category --</option>
              {categories.map((c) => (
                <option key={c._id || c.slug} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>

          <label className="modal-label">
            Tag users (handles, comma separated)
            <input
              className="modal-input"
              value={mentionsText}
              onChange={(e) => setMentionsText(e.target.value)}
              placeholder="@official1, @public_user2"
            />
          </label>

          <label className="modal-label">
            Description
            <textarea
              className="modal-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="Describe the grievance, what you tried, and what you expect."
            />
          </label>

          <label className="modal-label">
            Image (optional)
            <input
              className="modal-input"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
