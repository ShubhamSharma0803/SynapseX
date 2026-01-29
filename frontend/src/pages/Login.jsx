import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Github, MessageCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { triggerAlert } from '../hook/useAlerts'

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/dashboard')
      }
    }
    checkUser()
  }, [navigate])

  // Handle OAuth login
  const handleLogin = async (provider) => {
    try {
      setIsLoading(true)
      setLoadingProvider(provider)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          // Optional: Request additional scopes if needed
          scopes: provider === 'github' ? 'read:user user:email' : undefined,
        }
      })

      if (error) {
        throw error
      }

      // Show success message
      triggerAlert(
        'Redirecting...',
        `Opening ${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication`,
        'info'
      )

    } catch (error) {
      console.error('OAuth Error:', error)
      
      triggerAlert(
        'Login Failed',
        error.message || `Unable to sign in with ${provider}. Please try again.`,
        'error'
      )
      
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  // Handle email/password login (optional - you can remove if only using OAuth)
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      setIsLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      triggerAlert(
        'Login Successful',
        'Welcome back to SynapseX!',
        'success'
      )

      navigate('/dashboard')

    } catch (error) {
      console.error('Login Error:', error)
      
      triggerAlert(
        'Login Failed',
        error.message || 'Invalid email or password',
        'error'
      )
      
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Synapse<span className="text-blue-400">X</span>
          </h1>
          <p className="text-gray-400">Welcome back to the future</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Login</h2>
          
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleLogin('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 group"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {loadingProvider === 'github' ? 'Connecting...' : 'Continue with GitHub'}
            </button>

            <button
              onClick={() => handleLogin('discord')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {loadingProvider === 'discord' ? 'Connecting...' : 'Continue with Discord'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading && !loadingProvider ? 'Logging in...' : 'Login with Email'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default Login