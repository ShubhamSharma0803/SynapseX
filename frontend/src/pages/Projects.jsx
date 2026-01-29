import React, { useState } from 'react';
import { Upload, Calendar, Users, FileText, Image, File, X } from 'lucide-react';
import { triggerAlert } from '../hook/useAlerts';

const Projects = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [teamMemberCount, setTeamMemberCount] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setTeamMemberCount(count);
    
    // Initialize team members array with empty objects
    const newTeamMembers = Array.from({ length: count }, (_, index) => ({
      id: index,
      name: teamMembers[index]?.name || '',
      email: teamMembers[index]?.email || '',
      github: teamMembers[index]?.github || ''
    }));
    setTeamMembers(newTeamMembers);
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    setTeamMembers(updatedMembers);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleCancel = () => {
    // Reset form or navigate back
    setFormData({
      projectName: '',
      description: '',
      startDate: '',
      endDate: ''
    });
    setTeamMemberCount(0);
    setTeamMembers([]);
    setUploadedFile(null);
  };
  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Submit clicked - Triggering Alert"); // Add this
  
  // Simulate a successful creation
  triggerAlert(
    'Project Initialized', 
    `SynapseX: ${formData.projectName} is now active.`, 
    'success'
  );

  // Optional: Trigger a warning alert for the AI part
  setTimeout(() => {
    triggerAlert(
      'AI Analysis Started', 
      'Generating your automated timeline based on project details...', 
      'info'
    );
  }, 1500);
};

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return <Image className="w-8 h-8 text-amber-500" />;
    }
    return <File className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div>

      <div className="min-h-screen bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* Left Side - Visual/Info Section */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-12 flex flex-col justify-center items-center border-r border-amber-900/30">
          <div className="max-w-lg">
            <h1 className="text-6xl font-bold mb-6 text-amber-100 leading-tight">
              Create Your <br />
              <span className="text-amber-500">New Project</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Transform your ideas into reality. Fill in the details and let's get started on building something amazing together.
            </p>
            
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:bg-amber-900/50 transition-colors duration-300">
                  <FileText className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-100">Detailed Planning</h3>
                  <p className="text-gray-500">Organize every aspect of your project</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:bg-amber-900/50 transition-colors duration-300">
                  <Users className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-100">Team Collaboration</h3>
                  <p className="text-gray-500">Work seamlessly with your team</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center group-hover:bg-amber-900/50 transition-colors duration-300">
                  <Calendar className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-100">Timeline Tracking</h3>
                  <p className="text-gray-500">Stay on schedule with milestones</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="bg-black p-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-xl mx-auto w-full">
            <h2 className="text-3xl font-bold mb-8 text-amber-100">Project Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Project Name */}
              <div className="space-y-2">
                <label htmlFor="projectName" className="block text-sm font-medium text-amber-100">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter project name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-amber-100">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Describe your project..."
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-amber-100">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-amber-100">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Team Members Count */}
              <div className="space-y-2">
                <label htmlFor="teamMemberCount" className="block text-sm font-medium text-amber-100">
                  Number of Team Members
                </label>
                <input
                  type="number"
                  id="teamMemberCount"
                  value={teamMemberCount}
                  onChange={handleTeamCountChange}
                  min="0"
                  max="20"
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter number of team members"
                />
              </div>

              {/* Dynamic Team Member Fields */}
              {teamMemberCount > 0 && (
                <div className="space-y-4 border border-amber-900/30 rounded-lg p-6 bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-amber-100 mb-4">Team Member Details</h3>
                  
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {teamMembers.map((member, index) => (
                      <div key={member.id} className="space-y-3 p-4 bg-black/50 rounded-lg border border-amber-900/20">
                        <h4 className="text-sm font-medium text-amber-500">Member {index + 1}</h4>
                        
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-400">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                            required={teamMemberCount > 0}
                            className="w-full px-3 py-2 bg-gray-800 border border-amber-900/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-400">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                            required={teamMemberCount > 0}
                            className="w-full px-3 py-2 bg-gray-800 border border-amber-900/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter email"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-400">
                            GitHub Account
                          </label>
                          <input
                            type="text"
                            value={member.github}
                            onChange={(e) => handleTeamMemberChange(index, 'github', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-amber-900/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                            placeholder="GitHub username"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-100">
                  Attachments (Images/Documents)
                </label>
                
                {!uploadedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                      isDragging 
                        ? 'border-amber-500 bg-amber-900/20' 
                        : 'border-amber-900/50 hover:border-amber-500 hover:bg-amber-900/10'
                    }`}
                  >
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                      <p className="text-amber-100 mb-2">
                        Drag & drop your file here or <span className="text-amber-500 underline">browse</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: Images (JPG, PNG) & Documents (PDF, DOC, TXT)
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="border-2 border-amber-900/50 rounded-lg p-4 bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(uploadedFile.name)}
                        <div>
                          <p className="text-white font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-300 border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-amber-900/50 transform hover:scale-105"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Projects;