import React, { useState } from 'react'
import api from '../services/api'

export default function EditProfileModal({ open, onClose, profile, onUpdated }) {
  const [name, setName] = useState(profile?.name || '')
  const [handle, setHandle] = useState(profile?.handle || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [avatar, setAvatar] = useState(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Update profile
      const formData = new FormData()
      if (name) formData.append('name', name)
      if (handle) formData.append('handle', handle)
      if (bio !== undefined) formData.append('bio', bio)
      if (avatar) formData.append('avatar', avatar)

      const res = await api.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Change password if provided
      if (showPasswordSection && oldPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        if (newPassword.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        await api.post('/users/me/password', { oldPassword, newPassword })
        setSuccess('Profile and password updated successfully!')
      } else {
        setSuccess('Profile updated successfully!')
      }

      setTimeout(() => {
        onUpdated(res.data.user)
        onClose()
      }, 1000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Edit Profile</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Handle</label>
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              placeholder="username"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setAvatar(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              style={{ width: '100%' }}
            >
              {showPasswordSection ? '− Hide Password Change' : '+ Change Password'}
            </button>
          </div>

          {showPasswordSection && (
            <>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
