// src/components/profile/ProfileHeader.jsx
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import EditProfileModal from '../EditProfileModal'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function ProfileHeader({ profile, isOwner, onProfileUpdated }) {
  const { user, setUser } = useAuth()
  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(profile?.id || profile?._id) || false
  )
  const [followersCount, setFollowersCount] = useState(profile?.followersCount || 0)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const avatarSrc = profile.avatarUrl
    ? `${API_BASE}${profile.avatarUrl}`
    : '/default-avatar.png'

  const roleLabel =
    profile.role === 'OFFICIAL'
      ? 'OFFICIAL'
      : 'PUBLIC'

  const joined = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : ''

  async function handleFollowToggle() {
    if (!user || isOwner || loading) return
    setLoading(true)
    try {
      const userId = profile.id || profile._id
      if (isFollowing) {
        await api.post(`/users/${userId}/unfollow`)
        setIsFollowing(false)
        setFollowersCount(prev => prev - 1)
      } else {
        await api.post(`/users/${userId}/follow`)
        setIsFollowing(true)
        setFollowersCount(prev => prev + 1)
      }
    } catch (err) {
      console.error('Follow error', err)
    } finally {
      setLoading(false)
    }
  }

  function handleProfileUpdated(updatedUser) {
    setUser(updatedUser)
    if (onProfileUpdated) onProfileUpdated()
  }

  return (
    <section className="card profile-header-card">
      <div className="ph-main-row">
        {/* Avatar */}
        <div className="ph-avatar-wrap">
          <img src={avatarSrc} alt={profile.name} className="ph-avatar" />
        </div>

        {/* Name + bio + stats */}
        <div className="ph-middle">
          <div className="ph-name-row">
            <div>
              <div className="ph-username">{profile.name || profile.handle}</div>
              {profile.handle && (
                <div className="ph-handle">@{profile.handle}</div>
              )}
            </div>

            <div className={`ph-role-pill ph-role-${roleLabel.toLowerCase()}`}>
              {roleLabel}
            </div>
          </div>

          {profile.bio && (
            <div className="ph-bio">
              {profile.bio}
            </div>
          )}

          <div className="ph-stats-row">
            <div className="ph-stat-pill">
              <span className="ph-stat-number">{followersCount}</span>
              <span className="ph-stat-label">Followers</span>
            </div>
            <div className="ph-stat-pill">
              <span className="ph-stat-number">{profile.followingCount || 0}</span>
              <span className="ph-stat-label">Following</span>
            </div>
            <div className="ph-stat-pill">
              <span className="ph-stat-number">{joined}</span>
              <span className="ph-stat-label">Joined</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="ph-actions-row">
        {isOwner ? (
          <>
            <button
              type="button"
              className="btn btn-ghost ph-edit-btn"
              onClick={() => setEditModalOpen(true)}
            >
              Edit profile
            </button>
            {user?.role === 'ADMIN' && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.location.href = '/admin'}
                style={{ marginLeft: '0.5rem' }}
              >
                Admin Panel
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleFollowToggle}
            disabled={loading}
          >
            {loading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profile}
        onUpdated={handleProfileUpdated}
      />
    </section>
  )
}
