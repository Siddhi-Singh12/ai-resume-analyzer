import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/authContextObject'

const ProtectedRoute = ({ children }) => {
    const { token, isAuthenticated } = useContext(AuthContext)
    const storedToken = localStorage.getItem('token') || (() => {
        try {
            const stored = JSON.parse(
                localStorage.getItem('user') || localStorage.getItem('userInfo') || 'null'
            )
            return stored?.token || null
        } catch {
            return null
        }
    })()

    if (!token && !storedToken && !isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}


export default ProtectedRoute
