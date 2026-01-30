import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Github } from 'lucide-react' // Removed MessageCircle
import { supabase } from '../supabaseClient'
import { triggerAlert } from '../hook/useAlerts'

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // App.jsx will handle the specific redirect to onboarding or home
        navigate('/home')
      }
    }
    checkUser()
  }, [navigate])

  const handleLogin = async (provider) => {
    try {
      setIsLoading(true)
      setLoadingProvider(provider)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          // Changed redirect to /onboarding to trigger the profile check
          redirectTo: `${window.location.origin}/onboarding`,
          scopes: provider === 'github' ? 'read:user user:email' : undefined,
        }
      })

      if (error) throw error

      triggerAlert(
        'Redirecting...',
        `Opening ${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication`,
        'info'
      )

    } catch (error) {
      console.error('OAuth Error:', error)
      triggerAlert(
        'Login Failed',
        error.message || `Unable to sign in with ${provider}.`,
        'error'
      )
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      triggerAlert('Login Successful', 'Welcome back!', 'success')
      navigate('/home')
    } catch (error) {
      triggerAlert('Login Failed', error.message, 'error')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Synapse<span className="text-blue-400">X</span>
          </h1>
          <p className="text-gray-400">Welcome back to the future</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Login</h2>
          
          <div className="space-y-3 mb-6">
            {/* Google Button - Replaced Discord */}
            <button
              onClick={() => handleLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition-all duration-300 shadow-md disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
            </button>

            {/* GitHub Button */}
            <button
              onClick={() => handleLogin('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md disabled:opacity-50 group"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {loadingProvider === 'github' ? 'Connecting...' : 'Continue with GitHub'}
            </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isLoading && !loadingProvider ? 'Logging in...' : 'Login with Email'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login