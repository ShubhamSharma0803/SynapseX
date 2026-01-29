import { supabase } from '../supabaseClient'

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Centralized API client with automatic JWT token injection
 * 
 * @param {string} endpoint - API endpoint (e.g., '/projects/' or '/activities')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} - Parsed JSON response
 * @throws {Error} - Throws error with status code for error handling
 */
export const apiFetch = async (endpoint, options = {}) => {
  try {
    // Get the current session from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      throw new Error('Failed to retrieve session')
    }

    // Get the access token
    const token = session?.access_token

    // If no token is available, throw an authentication error
    if (!token) {
      const error = new Error('No authentication token available')
      error.status = 401
      throw error
    }

    // Prepare headers with Authorization
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers, // Allow custom headers to override defaults
    }

    // Build the full URL
    const url = `${API_BASE_URL}${endpoint}`

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle non-OK responses
    if (!response.ok) {
      const error = new Error(`API Error: ${response.statusText}`)
      error.status = response.status
      error.response = response
      
      // Try to parse error body
      try {
        error.data = await response.json()
      } catch (e) {
        error.data = null
      }
      
      throw error
    }

    // Parse and return JSON response
    const data = await response.json()
    return data

  } catch (error) {
    // Re-throw with additional context
    console.error('API Fetch Error:', error)
    throw error
  }
}

/**
 * Convenience method for GET requests
 */
export const apiGet = (endpoint, options = {}) => {
  return apiFetch(endpoint, { ...options, method: 'GET' })
}

/**
 * Convenience method for POST requests
 */
export const apiPost = (endpoint, body, options = {}) => {
  return apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Convenience method for PUT requests
 */
export const apiPut = (endpoint, body, options = {}) => {
  return apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/**
 * Convenience method for DELETE requests
 */
export const apiDelete = (endpoint, options = {}) => {
  return apiFetch(endpoint, { ...options, method: 'DELETE' })
}