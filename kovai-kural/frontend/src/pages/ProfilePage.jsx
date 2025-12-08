// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileTabs from '../components/profile/ProfileTabs'
import CategoriesJoined from '../components/profile/CategoriesJoined'
import MyPostsSidebar from '../components/profile/MyPostsSidebar'
import PeopleYouMayKnow from '../components/profile/PeopleYouMayKnow'
import CategorySuggestions from '../components/CategorySuggestions'
import './profile.css'
import '../components/profile/profile-ui.css'
import '../components/CommonSidebar.css'


export default function ProfilePage() {
  const { handle } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myPosts, setMyPosts] = useState([])

  useEffect(() => {
    fetchProfile()
  }, [handle])

  async function fetchProfile() {
    setLoading(true)
    try {
      const res = await api.get(`/users/handle/${handle}`)
      const profileUser = res.data.user
      setProfile(profileUser)
      // load posts by THIS profile user (not current user)
      const userId = profileUser._id || profileUser.id
      const postsRes = await api.get(`/posts?author=${userId}&limit=10`)
      setMyPosts(postsRes.data.posts || [])
    } catch (err) {
      console.error('Load profile error', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container">Loading profile…</div>
  if (!profile) return <div className="container">Profile not found</div>

  const isOwner = currentUser && currentUser.handle === profile.handle

  return (
    <div className="profile-root container-grid">
      <aside className="left-col">
        <CategoriesJoined
          categories={profile.categoriesPreview || []}
          onPostCreated={() => {
            fetchProfile()
          }}
        />
        <CategorySuggestions title="Categories You May Like" />
      </aside>

      <main className="center-col profile-main">
        <h1 className="page-title">My Profile</h1>

        <ProfileHeader profile={profile} isOwner={isOwner} onProfileUpdated={fetchProfile} />

        <ProfileTabs profile={profile} isOwner={isOwner} />
      </main>

      <aside className="right-col">
        <MyPostsSidebar posts={myPosts} />
        {isOwner && <PeopleYouMayKnow />}
      </aside>
    </div>
  )
}
