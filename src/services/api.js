import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
})

// Request Interceptor: Automatically attach Authorization: Bearer <JWT>
API.interceptors.request.use((config) => {
    // 1. Check standardized 'token' key
    let token = localStorage.getItem('token')

    // 2. Fallback check inside stored user object
    if (!token) {
        try {
            const stored = JSON.parse(
                localStorage.getItem('user') || localStorage.getItem('userInfo') || 'null'
            )
            token = stored?.token
        } catch {
            // ignore JSON parse error
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, (error) => {
    return Promise.reject(error)
})

// Response Interceptor: Handle expired/invalid tokens (Check 9)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const url = error.config?.url || ''
            const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register')

            if (!isAuthRoute) {
                // Clear stale authentication state
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                localStorage.removeItem('userInfo')

                if (window.location.pathname !== '/login') {
                    alert('Session expired. Please login again.')
                    window.location.href = '/login'
                }
            }
        }
        return Promise.reject(error)
    }
)

export default API