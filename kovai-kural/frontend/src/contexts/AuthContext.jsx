import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'


const AuthContext = createContext()


export function AuthProvider({ children }) {
const [user, setUser] = useState(() => {
try {
const raw = localStorage.getItem('kk_user')
return raw ? JSON.parse(raw) : null
} catch (e) { return null }
})


useEffect(() => {
// attach token to axios if present
const raw = localStorage.getItem('kk_token')
if (raw) api.defaults.headers.common['Authorization'] = `Bearer ${raw}`
}, [])


const login = ({ token, user }) => {
localStorage.setItem('kk_token', token)
localStorage.setItem('kk_user', JSON.stringify(user))
api.defaults.headers.common['Authorization'] = `Bearer ${token}`
setUser(user)
}


const logout = () => {
localStorage.removeItem('kk_token')
localStorage.removeItem('kk_user')
delete api.defaults.headers.common['Authorization']
setUser(null)
}


return (
<AuthContext.Provider value={{ user, login, logout, setUser }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => useContext(AuthContext)