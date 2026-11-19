import API from './api'

export const uploadResume = async (formData, token) => {
    const config = {}

    // The API request interceptor automatically injects Authorization from localStorage.
    // If a token is explicitly passed, ensure Authorization header is present.
    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await API.post(
        '/analyze/resume',
        formData,
        config
    )

    return response.data
}


export const getHistory = async () => {
    const response = await API.get('/analyze/history')
    return response.data
}

export const getAnalysisById = async (id) => {
    const response = await API.get(`/analyze/${id}`)
    return response.data
}

export const compareJDs = async (payload) => {
    const response = await API.post('/analyze/compare', payload)
    return response.data
}