import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function PeopleYouMayKnow() {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [followingIds, setFollowingIds] = useState(new Set())

  useEffect(() => {
    if (user) {
      fetchSuggestions()
    }
  }, [user])

  async function fetchSuggestions() {
    try {
      const res = await api.get('/users/suggestions')
      setSuggestions(res.data.users || [])
      setFollowingIds(new Set(user?.following || []))
    } catch (err) {
      console.error('Failed to fetch suggestions', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleFollow(userId) {
    if (!user) return
    try {
      await api.post(`/users/${userId}/follow`)
      setFollowingIds(prev => new Set([...prev, userId]))
    } catch (err) {
      console.error('Follow error', err)
    }
  }

  if (loading) return <div className="card" style={{ padding: '1rem' }}>Loading...</div>
  if (!suggestions.length) return null

  return (
    <div className="people-suggestions card">
      <h3>People You May Know</h3>
      <div className="people-list">
        {suggestions.map(person => {
          const isFollowing = followingIds.has(person._id || person.id)
          const avatarSrc = person.avatarUrl 
            ? `${API_BASE}${person.avatarUrl}` 
            : '/default-avatar.png'

          return (
            <div key={person._id || person.id} className="person-item">
              <Link to={`/profile/${person.handle}`} className="person-info">
                <img src={avatarSrc} alt={person.name} className="person-avatar" />
                <div className="person-details">
                  <div className="person-name">{person.name}</div>
                  <div className="person-handle">@{person.handle}</div>
                </div>
              </Link>
              {!isFollowing && (
                <button
                  className="btn-follow-small"
                  onClick={() => handleFollow(person._id || person.id)}
                >
                  Follow
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
