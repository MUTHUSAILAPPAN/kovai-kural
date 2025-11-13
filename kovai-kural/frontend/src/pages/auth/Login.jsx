import React, { useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'


export default function Login() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [err, setErr] = useState('')
const { login } = useAuth()
const navigate = useNavigate()


const handleSubmit = async (e) => {
e.preventDefault()
setErr('')
try {
const res = await api.post('/auth/login', { email, password })
login({ token: res.data.token, user: res.data.user })
navigate('/')
} catch (error) {
setErr(error?.response?.data?.message || 'Login failed')
}
}


return (
<div className="auth-box">
<h3>Sign in</h3>
{err && <div className="error">{err}</div>}
<form onSubmit={handleSubmit}>
<label>Email</label>
<input value={email} onChange={e => setEmail(e.target.value)} />
<label>Password</label>
<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
<button type="submit">Login</button>
</form>
</div>
)
}