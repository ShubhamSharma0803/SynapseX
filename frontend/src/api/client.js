import { supabase } from '../supabaseClient'

/**
 * The base URL for your FastAPI backend.
 * In production (Netlify), set VITE_API_URL in the Netlify dashboard.
 * Locally, it will default to localhost:8000.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Centralized API client with automatic JWT token injection
 * * @param {string} endpoint - API endpoint (e.g., '/projects/' or '/activities')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 */
export const apiFetch = async (endpoint, options = {}) => {
  try {
    // 1. Get the current session from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      throw new Error('Failed to retrieve session')
    }

    // 2. Get the access token to authenticate with FastAPI backend
    const token = session?.access_token

    if (!token) {
      const error = new Error('Authentication required. Please log in.')
      error.status = 401
      throw error
    }

    // 3. Prepare headers with the Bearer token for FastAPI's auth.py
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers, 
    }

    // 4. Build the full URL using the Render backend address
    const url = `${API_BASE_URL}${endpoint}`

    // 5. Execute the request
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // 6. Handle errors (like 401 Unauthorized or 500 Server Error)
    if (!response.ok) {
      const error = new Error(`API Error: ${response.statusText}`)
      error.status = response.status
      
      try {
        error.data = await response.json()
      } catch (e) {
        error.data = null
      }
      
      throw error
    }

    return await response.json()

  } catch (error) {
    console.error('API Connection Error:', error)
    throw error
  }
}

/**
 * Helper methods for HTTP verbs
 */
export const apiGet = (endpoint, options = {}) => {
  return apiFetch(endpoint, { ...options, method: 'GET' })
}

export const apiPost = (endpoint, body, options = {}) => {
  return apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// ... apiPut and apiDelete remain the same