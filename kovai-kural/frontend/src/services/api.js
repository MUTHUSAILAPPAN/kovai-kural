import axios from 'axios'


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'


const instance = axios.create({
baseURL: `${API_BASE}/api`,
timeout: 10000
})


// Response interceptor to handle auth errors centrally
instance.interceptors.response.use(
res => res,
err => {
if (err.response && err.response.status === 401) {
// optionally remove token and force logout
// localStorage.removeItem('kk_token')
}
return Promise.reject(err)
}
)


export default instance