import { useMemo, useState, useEffect } from 'react'

import { AuthContext } from './authContextObject'

const AuthProvider = ({ children }) => {
    // 1. Restore token from localStorage
    const getInitialToken = () => {
        const directToken = localStorage.getItem('token')
        if (directToken) return directToken
        try {
            const stored = JSON.parse(
                localStorage.getItem('user') || localStorage.getItem('userInfo') || 'null'
            )
            return stored?.token || null
        } catch {
            return null
        }
    }

    // 2. Restore user from localStorage
    const getInitialUser = () => {
        try {
            const stored = JSON.parse(
                localStorage.getItem('user') || localStorage.getItem('userInfo') || 'null'
            )
            return stored
        } catch {
            return null
        }
    }

    const [token, setToken] = useState(getInitialToken)
    const [user, setUser] = useState(getInitialUser)
    const [isAuthenticated, setIsAuthenticated] = useState(!!getInitialToken())

    useEffect(() => {
        setIsAuthenticated(Boolean(token && user))
    }, [token, user])

    const login = (userData) => {
        const jwtToken = userData?.token || null

        setToken(jwtToken)
        setUser(userData)
        setIsAuthenticated(Boolean(jwtToken))

        if (jwtToken) {
            localStorage.setItem('token', jwtToken)
        }
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('userInfo', JSON.stringify(userData))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userInfo')
    }

    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated,
        login,
        logout,
    }), [user, token, isAuthenticated])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider