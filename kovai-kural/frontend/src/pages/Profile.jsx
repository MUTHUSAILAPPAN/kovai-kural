import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'


export default function Profile() {
const { handle } = useParams()
const [user, setUser] = useState(null)
const [err, setErr] = useState('')


useEffect(() => {
const fetchProfile = async () => {
try {
const res = await api.get(`/users/handle/${handle}`)
setUser(res.data.user)
} catch (e) {
setErr(e?.response?.data?.message || 'Failed to load profile')
}
}
fetchProfile()
}, [handle])


if (err) return <div className="container">{err}</div>
if (!user) return <div className="container">Loading...</div>


return (
<div className="profile-card">
<img src={user.avatarUrl ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${user.avatarUrl}` : '/default-avatar.png'} alt={user.name} className="avatar" />
<h2>{user.name} <small>@{user.handle}</small></h2>
<p>{user.bio}</p>
<div className="stats">
<div><strong>{user.points}</strong><div>Points</div></div>
<div><strong>{user.counts.posts}</strong><div>Posts</div></div>
<div><strong>{user.followersCount}</strong><div>Followers</div></div>
</div>
</div>
)
}