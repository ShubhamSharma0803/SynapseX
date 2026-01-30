import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Calendar, Users, FileText, Image, File, X, BrainCircuit } from 'lucide-react'
import { triggerAlert } from '../hook/useAlerts'
import { apiPost } from '../api/client'
import { supabase } from '../supabaseClient' //

const Projects = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: ''
  })

  const [leaderName, setLeaderName] = useState('Unknown') //
  const [teamMemberCount, setTeamMemberCount] = useState(0)
  const [teamMembers, setTeamMembers] = useState([])
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- DYNAMICALLY FETCH LEADER NAME ---
  useEffect(() => {
    const fetchLeaderProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()
        
        if (data && !error) setLeaderName(data.full_name) //
      }
    }
    fetchLeaderProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTeamCountChange = (e) => {
    const count = parseInt(e.target.value) || 0
    setTeamMemberCount(count)
    const newTeamMembers = Array.from({ length: count }, (_, index) => ({
      id: index,
      name: teamMembers[index]?.name || '',
      email: teamMembers[index]?.email || '',
      github: teamMembers[index]?.github || ''
    }))
    setTeamMembers(newTeamMembers)
  }

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers]
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
    setTeamMembers(updatedMembers)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) setUploadedFile(file)
  }

  const handleCancel = () => {
    navigate('/home') //
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Prepare data for the FastAPI AI Circuit
      const projectData = {
        title: formData.projectName,
        description: formData.description,
        leader_name: leaderName, // Dynamic from profile
        start_date: formData.startDate,
        end_date: formData.endDate,
        team_members: teamMembers,
      }

      // 2. Call backend (Triggers Gemini Summarization & Tasks)
      await apiPost('/projects/', projectData)

      triggerAlert(
        'Project Initialized',
        `SynapseX: ${formData.projectName} is now active with AI-generated tasks.`,
        'success'
      )

      // 3. Optional: AI analysis alert
      setTimeout(() => {
        triggerAlert(
          'AI Analysis Complete',
          'Gemini has generated your project timeline and tasks.',
          'info'
        )
      }, 1500)

      setTimeout(() => {
        navigate('/home') // Redirect to dashboard
      }, 2000)

    } catch (error) {
      console.error('Failed to create project:', error)
      if (error.status === 401) {
        triggerAlert('Authentication Required', 'Please log in again.', 'error')
        navigate('/login')
        return
      }
      triggerAlert('Error', error.data?.detail || 'Project creation failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* Left Side */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-12 flex flex-col justify-center items-center border-r border-amber-900/30 relative">
          <div className="max-w-lg">
            <h1 className="text-6xl font-bold mb-6 text-amber-100 leading-tight">
              Initialize <br />
              <span className="text-amber-500">Neural Sync</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Submit your project parameters and let the AI Orchestrator break down the complexity into actionable milestones.
            </p>
            
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-100">AI Task Generation</h3>
                  <p className="text-gray-500">Automatically creates 5 initial project milestones.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-black p-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-xl mx-auto w-full">
            <h2 className="text-3xl font-bold mb-8 text-amber-100">Project Parameters</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-100">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white"
                  placeholder="Enter project name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-100">Description *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white resize-none"
                  placeholder="Describe your vision..."
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-100">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-100">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-medium shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Syncing with AI...' : 'Initialize Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Projects