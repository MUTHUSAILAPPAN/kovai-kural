// src/components/CreateCategoryModal.jsx
import React, { useState } from 'react'
import api from '../services/api'
import '../styles/modal.css'

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
    if (!title.trim()) {
      setErr('Title is required')
      return
    }
    try {
      setLoading(true)
      const res = await api.post('/categories', {
        title,
        description: desc,
        rules,
      })
      onCreated && onCreated(res.data.category)
      setTitle('')
      setDesc('')
      setRules('')
      onClose()
    } catch (error) {
      console.error('Create category error', error)
      setErr(error?.response?.data?.message || 'Failed to create category')
    } finally {
      setLoading(false)
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
          <h3>Create Category</h3>
        </div>

        {err && <div className="modal-error">{err}</div>}

        <form className="modal-form" onSubmit={submit}>
          <label className="modal-label">
            Title
            <input
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Roads, Water, Waste"
            />
          </label>

          <label className="modal-label">
            Description
            <textarea
              className="modal-textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Short summary of what belongs in this category."
            />
          </label>

          <label className="modal-label">
            Rules (guidelines for posting)
            <textarea
              className="modal-textarea"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={3}
              placeholder="Be specific: what is allowed / not allowed in this category."
            />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
