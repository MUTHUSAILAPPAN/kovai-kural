import React, { useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'


export default function Register() {
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [handle, setHandle] = useState('')
const [err, setErr] = useState('')
const { login } = useAuth()
const navigate = useNavigate()


const handleSubmit = async (e) => {
e.preventDefault()
setErr('')
console.log('Registration payload:', { name, email, password, handle });
try {
const res = await api.post('/auth/register', { name, email, password, handle })
login({ token: res.data.token, user: res.data.user })
navigate('/')
} catch (error) {
setErr(error?.response?.data?.message || 'Registration failed')
}
}


return (
<div className="auth-box">
<h3>Create account</h3>
{err && <div className="error">{err}</div>}
<form onSubmit={handleSubmit}>
<label>Name</label>
<input value={name} onChange={e => setName(e.target.value)} />
<label>Handle (unique)</label>
<input value={handle} onChange={e => setHandle(e.target.value)} />
<label>Email</label>
<input value={email} onChange={e => setEmail(e.target.value)} />
<label>Password</label>
<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
<button type="submit">Sign up</button>
</form>
</div>
)
}