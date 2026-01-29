import { toast } from 'sonner'
import { apiGet } from '../api/client'

export const triggerAlert = (title, description, type = 'success') => {
  // This sends the signal to the Toaster component
  toast[type](title, {
    description: description,
    duration: 4000,
  })

  // Store the alert history in the browser
  const history = JSON.parse(localStorage.getItem('synapse_alerts') || '[]')
  const newAlert = {
    id: Date.now(),
    title,
    description,
    type,
    timestamp: new Date().toLocaleTimeString(),
  }
  
  localStorage.setItem('synapse_alerts', JSON.stringify([newAlert, ...history]))
}

/**
 * Fetch project activities timeline from the backend
 * 
 * @param {string} projectId - The project ID to fetch activities for
 * @returns {Promise<Array>} - Array of activity objects
 */
export const fetchProjectTimeline = async (projectId) => {
  try {
    const activities = await apiGet(`/projects/${projectId}/activities`)
    return activities
  } catch (error) {
    console.error('Failed to fetch project timeline:', error)
    
    // Show error alert to user
    triggerAlert(
      'Failed to Load Timeline',
      error.message || 'Unable to fetch project activities',
      'error'
    )
    
    // Re-throw for component-level error handling
    throw error
  }
}

/**
 * Fetch all alerts/activities for the current user
 * 
 * @returns {Promise<Array>} - Array of all activities
 */
export const fetchAllAlerts = async () => {
  try {
    // This would call your backend endpoint that returns all activities
    // Adjust the endpoint based on your API structure
    const activities = await apiGet('/activities')
    return activities
  } catch (error) {
    console.error('Failed to fetch alerts:', error)
    
    triggerAlert(
      'Failed to Load Alerts',
      error.message || 'Unable to fetch alerts',
      'error'
    )
    
    throw error
  }
}