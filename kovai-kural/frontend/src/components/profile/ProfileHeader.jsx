// src/components/profile/ProfileHeader.jsx
import React, { useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function ProfileHeader({ profile, isOwner, onProfileUpdated }) {
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(false)

  return (
    <section className="profile-header card">
      <div className="ph-top">
        <div className="avatar-large">
          <img src={profile.avatarUrl ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${profile.avatarUrl}` : '/default-avatar.png'} alt={profile.name} />
        </div>

        <div className="ph-meta">
          <div className="ph-row">
            <h2 className="ph-name">{profile.name}</h2>
            <div className={`role-pill ${profile.role?.toLowerCase()}`}>{profile.role}</div>
          </div>

          <p className="ph-bio">{profile.bio || 'No bio yet.'}</p>

          <div className="ph-stats">
            <div><strong>{profile.followersCount || 0}</strong><div className="muted">Followers</div></div>
            <div><strong>{profile.followingCount || 0}</strong><div className="muted">Following</div></div>
            <div><strong>{new Date(profile.joinedAt || profile.createdAt).toLocaleDateString()}</strong><div className="muted">Joined</div></div>
          </div>

          <div className="ph-actions">
            {isOwner ? (
              <button className="btn" onClick={() => setEditing(s => !s)}>{editing ? 'Close' : 'Edit profile'}</button>
            ) : (
              <FollowButton profile={profile} />
            )}
          </div>
        </div>
      </div>

      {/* simple inline editor (owner only) */}
      {isOwner && editing && <ProfileEditor profile={profile} onSaved={onProfileUpdated} onClose={() => setEditing(false)} />}
    </section>
  )
}

/* Follow/unfollow button */
function FollowButton({ profile }) {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState(false)

  React.useEffect(() => {
    if (!user) return
    // assume backend gives follower preview; check if current user is in followersPreview
    setFollowing(profile.followersPreview?.some(f => f._id === user.id) || false)
  }, [profile, user])

  async function toggle() {
    if (!user) { alert('Login to follow'); return }
    setLoading(true)
    try {
      const endpoint = following ? `/users/${profile.id}/unfollow` : `/users/${profile.id}/follow`
      await api.post(endpoint)
      setFollowing(!following)
    } catch (err) {
      console.error('Follow error', err)
      alert(err?.response?.data?.message || 'Failed')
    } finally { setLoading(false) }
  }

  return <button className={`btn ${following ? 'btn-ghost' : 'btn-primary'}`} onClick={toggle} disabled={loading}>
    {following ? 'Following' : 'Follow'}
  </button>
}

/* Inline editor */
function ProfileEditor({ profile, onSaved, onClose }) {
  const [name, setName] = useState(profile.name || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth(); // ensure setUser is available from AuthContext

async function submit(e) {
  e.preventDefault();
  setLoading(true);
  try {
    const form = new FormData();
    form.append('name', name);
    form.append('bio', bio);
    if (avatar) form.append('avatar', avatar);

    const res = await api.put('/users/me', form, { headers: { 'Content-Type': 'multipart/form-data' } });

    // updated user returned in res.data.user
    const updatedUser = res.data.user;

    // update AuthContext + localStorage if this user is the logged-in user
    // Note: AuthContext must export setUser; we added it previously
    if (updatedUser && updatedUser.handle) {
      // merge existing stored user with fields from updatedUser
      const stored = JSON.parse(localStorage.getItem('kk_user') || 'null') || {};
      const merged = { ...stored, ...updatedUser };
      localStorage.setItem('kk_user', JSON.stringify(merged));
      // update axios default header if token still present
      // setUser should update state
      setUser(merged);
    }

    onSaved && onSaved();
    onClose && onClose();
  } catch (err) {
    console.error('Save profile', err);
    alert(err?.response?.data?.message || 'Failed to save');
  } finally { setLoading(false); }
}

  return (
    <form className="profile-editor" onSubmit={submit}>
      <label>Name</label>
      <input value={name} onChange={e => setName(e.target.value)} />
      <label>Bio</label>
      <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} />
      <label>Avatar</label>
      <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} />
      <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
      </div>
    </form>
  )
}
