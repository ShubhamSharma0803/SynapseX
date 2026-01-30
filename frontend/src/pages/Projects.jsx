import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Upload, Calendar, Users, FileText, Image, File, X, BrainCircuit, 
  ArrowRight, ArrowLeft, Check, Tag, Github, MessageCircle, 
  Globe, Lock, Eye, Building, Plus, Trash2, Mail
} from 'lucide-react'
import { triggerAlert } from '../hook/useAlerts'
import { apiPost } from '../api/client'
import { supabase } from '../supabaseClient'

const Projects = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Form Data State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    projectName: '',
    category: '',
    priority: 'Medium',
    
    // Step 2: Details
    description: '',
    tags: [],
    uploadedFiles: [],
    
    // Step 3: Timeline
    startDate: '',
    endDate: '',
    durationWeeks: '',
    
    // Step 4: Team & Integration
    teamMembers: [],
    githubRepo: '',
    discordServer: '',
    techStackPreferences: [],
    visibility: 'Team Only'
  })

  const [leaderName, setLeaderName] = useState('Unknown')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [techInput, setTechInput] = useState('')

  // Categories
  const categories = [
    'Web Development',
    'Mobile App',
    'AI/ML',
    'Data Science',
    'DevOps',
    'Design',
    'Blockchain',
    'Game Development',
    'Other'
  ]

  const priorities = ['Low', 'Medium', 'High', 'Critical']
  const visibilityOptions = ['Private', 'Team Only', 'Organization', 'Public']
  const roleOptions = ['Admin', 'Developer', 'Designer', 'Tester', 'Viewer']

  // Fetch leader profile
  useEffect(() => {
    const fetchLeaderProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()
        
        if (data && !error) {
          setLeaderName(data.full_name)
        } else {
          setLeaderName(session.user.email || 'Unknown')
        }
      }
    }
    fetchLeaderProfile()
  }, [])

  // Team member functions
  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          id: Date.now(),
          name: '',
          email: '',
          github_username: '',
          discord_username: '',
          role: 'Developer'
        }
      ]
    }))
  }

  const removeTeamMember = (id) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }))
  }

  const updateTeamMember = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    }))
  }

  // Tag functions
  const addTag = () => {
    if (tagInput.trim() && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Tech stack functions
  const addTech = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        techStackPreferences: [...prev.techStackPreferences, techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      techStackPreferences: prev.techStackPreferences.filter(tech => tech !== techToRemove)
    }))
  }

  // File upload functions
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }))
  }

  const removeFile = (fileName) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(file => file.name !== fileName)
    }))
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare project data matching backend model
      const projectData = {
        title: formData.projectName,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        duration_weeks: formData.durationWeeks ? parseInt(formData.durationWeeks) : null,
        leader_name: leaderName,
        team_members: formData.teamMembers.map(member => ({
          name: member.name,
          email: member.email,
          github_username: member.github_username || null,
          discord_username: member.discord_username || null,
          role: member.role
        })),
        github_repo_url: formData.githubRepo || null,
        discord_server_url: formData.discordServer || null,
        tech_stack_preferences: formData.techStackPreferences,
        tags: formData.tags,
        visibility: formData.visibility
      }

      // Create project
      const response = await apiPost('/projects/', projectData)

      // Upload files if any
      if (formData.uploadedFiles.length > 0 && response.id) {
        const fileFormData = new FormData()
        formData.uploadedFiles.forEach(file => {
          fileFormData.append('files', file)
        })

        // Note: You'll need to implement this endpoint or handle files differently
        // await apiPost(`/projects/${response.id}/upload-files`, fileFormData)
      }

      triggerAlert(
        'Project Initialized Successfully! 🎉',
        `${formData.projectName} is now live with AI-generated tasks and timeline.`,
        'success'
      )

      setTimeout(() => {
        triggerAlert(
          'Team Invitations Sent 📧',
          `${formData.teamMembers.length} team members will receive invitation emails.`,
          'info'
        )
      }, 1500)

      setTimeout(() => {
        navigate('/home')
      }, 3000)

    } catch (error) {
      console.error('Failed to create project:', error)
      
      if (error.status === 401) {
        triggerAlert('Authentication Required', 'Please log in again.', 'error')
        setTimeout(() => navigate('/login'), 1500)
        return
      }

      triggerAlert(
        'Project Creation Failed',
        error.data?.detail || 'Unable to create project. Please try again.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step indicators
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step === currentStep ? 'bg-amber-500 text-black' :
            step < currentStep ? 'bg-green-500 text-white' :
            'bg-gray-700 text-gray-400'
          } font-bold transition-all duration-300`}>
            {step < currentStep ? <Check className="w-5 h-5" /> : step}
          </div>
          {step < totalSteps && (
            <div className={`w-16 h-1 ${
              step < currentStep ? 'bg-green-500' : 'bg-gray-700'
            } transition-all duration-300`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  // Render step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-100">Basic Information</h3>
            
            {/* Project Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your project name"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Project Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Priority Level *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {priorities.map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({...formData, priority})}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      formData.priority === priority
                        ? 'bg-amber-500 text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-100">Project Details</h3>
            
            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Problem Statement / Description *
              </label>
              <textarea
                required
                rows="6"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Describe your project vision, goals, and key features in detail. The AI will use this to generate tasks and tech stack suggestions..."
              />
              <p className="text-xs text-gray-500">
                💡 Be specific for better AI recommendations
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Tags / Keywords
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Add tags (press Enter)"
                  disabled={formData.tags.length >= 10}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={formData.tags.length >= 10}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-amber-900/30 text-amber-200 rounded-full text-sm flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Attachments (PDFs, Documents, Images)
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                  isDragging ? 'border-amber-500 bg-amber-900/20' : 'border-amber-900/50 hover:border-amber-500'
                }`}
              >
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  multiple
                  className="hidden"
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <p className="text-amber-100">
                    Drag & drop or <span className="text-amber-500 underline">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, TXT, Images
                  </p>
                </label>
              </div>
              
              {/* Uploaded files list */}
              {formData.uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-white text-sm">{file.name}</p>
                          <p className="text-gray-500 text-xs">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.name)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-100">Timeline & Duration</h3>
            
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-100">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-100">
                  Expected End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Expected Duration (in weeks)
              </label>
              <input
                type="number"
                min="1"
                max="104"
                value={formData.durationWeeks}
                onChange={(e) => setFormData({...formData, durationWeeks: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., 8 weeks"
              />
            </div>

            {/* Project Leader Display */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Project Leader
              </label>
              <div className="w-full px-4 py-3 bg-gray-800/50 border border-amber-900/30 rounded-lg text-amber-200 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {leaderName}
              </div>
              <p className="text-xs text-gray-500">Auto-detected from your profile</p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-100">Team & Collaboration</h3>
            
            {/* Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-amber-100">
                  Team Members
                </label>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              {formData.teamMembers.length === 0 ? (
                <div className="text-center py-8 bg-gray-900/50 rounded-lg border border-gray-700">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No team members added yet</p>
                  <p className="text-gray-500 text-sm">Click "Add Member" to invite your team</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {formData.teamMembers.map((member, index) => (
                    <div key={member.id} className="p-4 bg-gray-900/50 rounded-lg border border-amber-900/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-amber-500">Member {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(member.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          placeholder="Full Name *"
                          required
                          className="px-3 py-2 bg-gray-800 border border-amber-900/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                          placeholder="Email *"
                          required
                          className="px-3 py-2 bg-gray-800 border border-amber-900/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={member.github_username}
                          onChange={(e) => updateTeamMember(member.id, 'github_username', e.target.value)}
                          placeholder="GitHub username"
                          className="px-3 py-2 bg-gray-800 border border-amber-900/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          value={member.discord_username}
                          onChange={(e) => updateTeamMember(member.id, 'discord_username', e.target.value)}
                          placeholder="Discord username"
                          className="px-3 py-2 bg-gray-800 border border-amber-900/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <select
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-amber-900/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Integration URLs */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-amber-100">
                Integration Links (Optional)
              </label>
              
              <div className="space-y-3">
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.githubRepo}
                    onChange={(e) => setFormData({...formData, githubRepo: e.target.value})}
                    placeholder="GitHub Repository URL"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.discordServer}
                    onChange={(e) => setFormData({...formData, discordServer: e.target.value})}
                    placeholder="Discord Server URL"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Tech Stack Preferences */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Tech Stack Preferences (or let AI suggest)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="Add technology (e.g., React, FastAPI)"
                  className="flex-1 px-4 py-2 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.techStackPreferences.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-blue-900/30 text-blue-200 rounded-full text-sm flex items-center gap-2">
                    {tech}
                    <button onClick={() => removeTech(tech)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-100">
                Project Visibility
              </label>
              <div className="grid grid-cols-2 gap-3">
                {visibilityOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({...formData, visibility: option})}
                    className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      formData.visibility === option
                        ? 'bg-amber-500 text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {option === 'Private' && <Lock className="w-4 h-4" />}
                    {option === 'Team Only' && <Users className="w-4 h-4" />}
                    {option === 'Organization' && <Building className="w-4 h-4" />}
                    {option === 'Public' && <Globe className="w-4 h-4" />}
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-amber-100">
            Initialize <span className="text-amber-500">Neural Sync</span>
          </h1>
          <p className="text-gray-400">
            Let AI orchestrate your project into actionable milestones
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-900/50 backdrop-blur-md border border-amber-900/30 rounded-2xl p-8 mb-6">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 border border-gray-700 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-amber-900/50 flex items-center justify-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-amber-900/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <BrainCircuit className="w-5 h-5 animate-pulse" />
                    Syncing with AI...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Initialize Project
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Cancel Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/home')}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            Cancel and return to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Projects