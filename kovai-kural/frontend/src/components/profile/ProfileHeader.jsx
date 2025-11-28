// src/components/profile/ProfileHeader.jsx
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function ProfileHeader({ profile, isOwner, onProfileUpdated }) {
  const { user } = useAuth()

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
    if (!user || isOwner) return
    // optional: follow/unfollow later
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
              <span className="ph-stat-number">{profile.followersCount || 0}</span>
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
          <button
            type="button"
            className="btn btn-ghost ph-edit-btn"
            onClick={() => {
              // hook to open edit modal later
              alert('Hook your Edit Profile modal here')
            }}
          >
            Edit profile
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleFollowToggle}
          >
            Follow
          </button>
        )}
      </div>
    </section>
  )
}
