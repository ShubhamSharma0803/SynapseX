import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { triggerAlert } from '../hook/useAlerts';

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    role: 'member' // Default value matching your database constraint
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("No active session found");

      // Use upsert to handle both new records and existing social login stubs
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: session.user.id, 
          full_name: formData.full_name,
          email: session.user.email,
          role: formData.role,
          onboarding_completed: true // Matches the new column you added
        });

      if (error) throw error;

      triggerAlert('Success', 'Profile created successfully!', 'success');
      
      // Redirect to /home - App.jsx will now let them through because onboarding_completed is true
      navigate('/home'); 

    } catch (error) {
      console.error('Error saving profile:', error);
      triggerAlert('Error', error.message || 'Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid to match Login page */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md bg-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to SynapseX</h2>
        <p className="text-gray-400 mb-8">Please complete your profile to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
              placeholder="Enter your name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Your Role</label>
            <select
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="leader">Leader</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;