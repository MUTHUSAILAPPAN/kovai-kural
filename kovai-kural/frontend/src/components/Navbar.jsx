import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'


export default function Navbar() {
const { user, logout } = useAuth()


return (
<nav className="nav">
<div className="nav-left">
<Link to="/" className="brand">Kovai Kural</Link>
</div>
<div className="nav-right">
{user ? (
<>
<Link to={`/profile/${user.handle}`} className="nav-link">Profile</Link>
<button className="btn-link" onClick={logout}>Sign Out</button>
</>
) : (
<>
<Link to="/login" className="nav-link">Login</Link>
<Link to="/register" className="nav-link">Sign up</Link>
</>
)}
</div>
</nav>
)
}