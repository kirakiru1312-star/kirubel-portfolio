import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s to handle Render free tier cold starts
})

// Attach JWT to every request if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear credentials
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }
    return Promise.reject(err)
  }
)

export default client
