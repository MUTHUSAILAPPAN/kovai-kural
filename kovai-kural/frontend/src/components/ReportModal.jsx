import React, { useState } from 'react'
import api from '../services/api'

const REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam or misleading' },
  { value: 'HARASSMENT', label: 'Harassment or hate speech' },
  { value: 'INAPPROPRIATE', label: 'Inappropriate content' },
  { value: 'MISINFORMATION', label: 'False information' },
  { value: 'OTHER', label: 'Other (specify below)' }
]

export default function ReportModal({ open, onClose, targetId, reportType, category }) {
  const [reason, setReason] = useState('SPAM')
  const [customReason, setCustomReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    if (reason === 'OTHER' && !customReason.trim()) {
      setError('Please provide a reason')
      return
    }
    
    try {
      setSubmitting(true)
      await api.post('/reports', {
        reportType,
        targetId,
        reason,
        customReason,
        category
      })
      alert('Report submitted successfully')
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Report {reportType.toLowerCase()}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for reporting:</label>
            {REPORT_REASONS.map(r => (
              <label key={r.value} className="radio-label">
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={e => setReason(e.target.value)}
                />
                {r.label}
              </label>
            ))}
          </div>

          {reason === 'OTHER' && (
            <div className="form-group">
              <label>Please specify:</label>
              <textarea
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                rows="3"
                placeholder="Describe the issue..."
                required
              />
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
